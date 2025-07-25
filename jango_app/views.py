from collections import defaultdict
import pandas as pd
from django.views.generic import ListView, TemplateView
from .models import Post, Profile, Categories, ProductTraining, JoiningApplication,TourPlan,UserVideoUnlock,Territory, ProductVideo, VideoQuestion, VideoAnswer, UserVideoQuizResult # Updated import
from django.contrib.auth import authenticate, login
from .forms import JoiningForm, UserRegistrationForm , TourPlanForm
from google.oauth2 import service_account
from django.shortcuts import render, redirect, HttpResponse, get_object_or_404
from django.contrib import messages
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from django.conf import settings
import json
import calendar
from datetime import date
from django.contrib.auth.decorators import login_required
MONTHS = ['Jan-2025', 'Fab-2025', 'Mar-2025', 'Apr-2025', 'May-2025', 'Jun-2025',
            'Jul-2025', 'Aug-2025', 'Sep-2025', 'Oct-2025', 'Nov-2025', 'Dec-2025']

# ========== GOOGLE SHEETS SETTINGS ==========
SERVICE_ACCOUNT_FILE = r'C:\Users\Bhargav\PycharmProjects\PYPROGRAM\Django_Project\jango New\jango\jango\Service Account Final.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SPREADSHEET_ID = '1wBr1ml39yaYl45Xfr1kUdbEl8dljaHpwAPDdeB530bo'  # Just the ID, not full URL
RANGE_NAME = 'Jan-2025!A1:G100'

def get_sheet_service():
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('sheets', 'v4', credentials=creds)



# ========== GOOGLE SHEET DATA FUNCTION ==========
def get_final_sum_by_month(sheet_id):
    creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)

    month_totals = {}

    for month in MONTHS:
        try:
            range_name = f"{month}!A5:F100"
            result = service.spreadsheets().values().get(
                spreadsheetId=sheet_id,
                range=range_name
            ).execute()
            values = result.get('values', [])

            total = 0
            for row in values:
                if len(row) >= 5:
                    # Skip row if 'Total:' is present in col B or col A
                    if (row[0].strip().lower() == 'total:' or
                            row[1].strip().lower() == 'total:'):
                        continue
                    try:
                        amount = float(row[4])
                        total += amount
                    except ValueError:
                        continue   # skip if value is not a number

            month_totals[month] = total
        except Exception as e:
            print(f"Error reading {month}: {e}")
            month_totals[month] = 0

    return month_totals




# ========== Territory Wise Data ==========
def get_date_territory_mapping(sheet_id, employee_name):
    service = get_sheet_service()

    range_name = 'Master!A2:Z1000'
    result = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range=range_name
    ).execute()
    rows = result.get('values', [])

    date_territory_list = []

    for row in rows:
        if len(row) >= 8:
            date = row[3].strip()
            territory = row[6].strip().upper()
            name_in_row = row[2].strip().lower()   # assuming column C = employee name

            if name_in_row == employee_name.lower():
                date_territory_list.append({
                    'date': date,
                    'territory': territory
                })

    return date_territory_list

# ========== DASHBOARD VIEW ==========

@login_required
def dashboard_view(request):
    user = request.user
    try:
        sheet_id = user.profile.sheet_id
    except:
        sheet_id = None

    if not sheet_id:
        return render(request, 'dashboard.html', {'error': 'Google Sheet ID not set for your profile.'})

    # Sheet data (monthly totals)
    month_data = get_final_sum_by_month(sheet_id)
    labels = list(month_data.keys())
    totals = list(month_data.values())
    chart_data = json.dumps({'labels': labels, 'totals': totals})

    # TourPlan chart data (territory-wise)
    from django.db.models import Count
    territory_counts = TourPlan.objects.exclude(territory_name=None).values('territory_name__name').annotate(count=Count('id'))
    territory_labels = [item['territory_name__name'] for item in territory_counts]
    territory_values = [item['count'] for item in territory_counts]

    territory_chart_data = json.dumps({'labels': territory_labels, 'values': territory_values})

    return render(request, 'dashboard.html', {
        'labels': labels,
        'totals': totals,
        'chart_data': chart_data,
        'territory_chart_data': territory_chart_data,
        'username': user.username,
        'total_final': sum(totals)
})

# ========== HOME PAGE ==========
class HomePageView(ListView):
    model = Post
    template_name = 'home.html'
    context_object_name = 'all_posts_list'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['trainings'] = ProductTraining.objects.filter(status='PUBLISH')
        context['all_categories'] = Categories.objects.all()
        return context


# ========== ABOUT PAGE ==========
class AboutView(TemplateView):
    template_name = 'about.html'


# ========== PRODUCT PAGE ==========
class ProductView(TemplateView):
    template_name = 'product.html'


# ========== LOGIN VIEW ==========
def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')  # <-- Fix here
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password')
            return render(request, 'login.html')

    return render(request, 'login.html')


# ========== REGISTRATION VIEW ==========
def register_user(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()

            profile = user.profile
            profile.role = form.cleaned_data['role']
            profile.save()

            messages.success(request, 'Registration successful! Please login.')
            return redirect('login')
    else:
        form = UserRegistrationForm()
    return render(request, 'register.html', {'form': form})


# ========== JOINING FORM VIEW ==========
def joining_form_view(request):
    if request.method == 'POST':
        form = JoiningForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Form submitted successfully!')
            return redirect('home')
        else:
            return render(request, 'joining_form.html', {'form': form})
    else:
        form = JoiningForm()
    return render(request, 'joining_form.html', {'form': form})


def get_current_month_dates():
    today = date.today()
    year = today.year
    month = today.month
    month_range = calendar.monthrange(year, month)[1]
    dates = []
    for day in range(1, month_range + 1):
        d = date(year, month, day)
        weekday = d.strftime('%A')   # e.g., 'Sunday'
        dates.append({'date': d, 'weekday': weekday})
    return dates


@login_required
def submit_tour_plan(request):
    current_month_dates = get_current_month_dates()

    try:
        # Single territory (if Profile has territory FK)
        user_territories = [request.user.profile.territory] if request.user.profile.territory else []
    except:
        # If using ManyToMany, fallback
        user_territories = request.user.profile.territories.all()

    if request.method == 'POST':
        form = TourPlanForm(request.POST, user=request.user)
        if form.is_valid():
            tour_plan = form.save(commit=False)
            tour_plan.user = request.user
            tour_plan.save()
            messages.success(request, 'Tour plan submitted successfully!')
            return redirect('dashboard')
    else:
        form = TourPlanForm(user=request.user)

    return render(request, 'tour_plan.html', {
        'form': form,
        'date_list': current_month_dates,
        'user_territories': user_territories
    })

@login_required
def training_quiz(request, training_id):
    training = ProductTraining.objects.get(id=training_id)
    # Old quiz logic - we will not use this for video-specific quizzes
    return redirect('home') # Redirecting as we will handle quiz per video

@login_required
def product_videos(request, product_id):
    product_training = get_object_or_404(ProductTraining, id=product_id)
    videos = product_training.videos.all().order_by('order')

    user_results = UserVideoQuizResult.objects.filter(user=request.user, video__in=videos)
    result_map = {result.video.id: result for result in user_results}

    unlocked_video_ids = set()
    for i, video in enumerate(videos):
        if i == 0:
            unlocked_video_ids.add(video.id)
        else:
            prev_video = videos[i - 1]
            result = result_map.get(prev_video.id)
            if result and result.completed and result.passed:
                unlocked_video_ids.add(video.id)
            else:
                break  # Stop unlocking further videos

    return render(request, 'product_videos.html', {
        'product_training': product_training,
        'videos': videos,
        'unlocked_video_ids': unlocked_video_ids,
        'result_map': result_map,
    })


from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import ProductVideo, VideoQuestion, VideoAnswer, UserVideoQuizResult, UserVideoUnlock, UserCategoryProgress # सुनिश्चित करें कि ये सभी मॉडल यहां इम्पोर्टेड हैं

@login_required
def submit_quiz(request, video_id):
    video = get_object_or_404(ProductVideo, id=video_id)
    questions = VideoQuestion.objects.filter(video=video)
    score = 0
    total_questions = questions.count()
    all_answers_correct = True # नया फ्लैग

    if request.method == 'POST':
        for question in questions:
            selected_answer_id = request.POST.get(f'question_{question.id}')
            if selected_answer_id:
                try:
                    selected_answer = VideoAnswer.objects.get(id=selected_answer_id, question=question)
                    if selected_answer.is_correct:
                        score += 1
                    else:
                        all_answers_correct = False # एक भी गलत उत्तर, तो फ्लैग फॉल्स
                except VideoAnswer.DoesNotExist:
                    all_answers_correct = False # यदि कोई उत्तर नहीं चुना गया या अमान्य आईडी, तो भी गलत

        percentage = (score / total_questions) * 100 if total_questions > 0 else 0

        # UserVideoQuizResult को अपडेट या बनाएं
        user_quiz_result, created = UserVideoQuizResult.objects.update_or_create(
            user=request.user,
            video=video,
            defaults={
                'score': percentage,
                'completed': True, # क्विज़ सबमिट हो गया है
                'passed': all_answers_correct # पास तभी जब सारे उत्तर सही हों
            }
        )

        # यदि सारे उत्तर सही हैं और पास हो गया
        if all_answers_correct:
            messages.success(request, 'Congratulations! You passed the quiz. The next video is unlocked.')

            # अगला वीडियो अनलॉक करें
            next_video = ProductVideo.objects.filter(
                product_training=video.product_training,
                order__gt=video.order # 'order' फील्ड का उपयोग करें, id__gt के बजाय
            ).order_by('order').first()

            if next_video:
                UserVideoUnlock.objects.get_or_create(user=request.user, video=next_video)
            else:
                # यदि कोई अगला वीडियो नहीं है, तो पूरी कैटेगरी को 'completed' मार्क करें (या जैसा भी आपका लॉजिक हो)
                # सुनिश्चित करें कि UserCategoryProgress मॉडल मौजूद है और category फील्ड सही है
                # (यह आपके models.py में ProductTraining.category से संबंधित होना चाहिए)
                try:
                    UserCategoryProgress.objects.get_or_create(
                        user=request.user,
                        category=video.product_training.category # यहां category ऑब्जेक्ट पास करें
                    )
                    messages.info(request, 'You have completed all videos in this training category!')
                except AttributeError:
                    # यदि ProductTraining का category एट्रीब्यूट नहीं है या UserCategoryProgress नहीं है
                    messages.warning(request, 'All videos completed, but category progress could not be updated.')

        else:
            # यदि सारे उत्तर सही नहीं हैं
            messages.error(request, 'Incorrect answers. Please review the video and try the quiz again.')

        # क्विज़ सबमिट होने के बाद हमेशा वीडियो लिस्ट पेज पर रीडायरेक्ट करें
        return redirect('product_videos', product_id=video.product_training.id)

    # यदि GET अनुरोध है (सीधे URL पर नेविगेट किया गया)
    messages.error(request, 'Invalid request method for quiz submission.')
    return redirect('product_videos', product_id=video.product_training.id)

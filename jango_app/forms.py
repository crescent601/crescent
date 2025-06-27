from django import forms
from django.contrib.auth.models import User
from .models import Profile, JoiningApplication, QualificationProof , TourPlan , UserTerritory , VideoQuestion , VideoAnswer

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    role = forms.ChoiceField(choices=Profile.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

class JoiningForm(forms.ModelForm):
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), required=False)
    place_of_birth = forms.CharField(max_length=100, required=False)
    age = forms.IntegerField(required=False)
    present_address = forms.CharField(widget=forms.Textarea(attrs={'rows': 3, 'cols': 70}), required=False)
    present_contact_no = forms.CharField(max_length=20, required=False)
    present_email_id = forms.EmailField(max_length=100, required=False)
    permanent_address = forms.CharField(widget=forms.Textarea(attrs={'rows': 3, 'cols': 70}), required=False)
    permanent_contact_no = forms.CharField(max_length=20, required=False)
    permanent_landline = forms.CharField(max_length=20, required=False)
    gender = forms.CharField(max_length=20, required=False)
    nationality = forms.CharField(max_length=50, required=False)
    pan_card = forms.CharField(max_length=10, required=False)
    marital_status = forms.CharField(max_length=20, required=False)
    blood_group = forms.CharField(max_length=5, required=False)
    aadhar_card = forms.CharField(max_length=12, required=False)
    academic_qualification = forms.CharField(widget=forms.Textarea(attrs={'rows': 5, 'cols': 70}), label='Academic Qualification (Starting from SSC to highest qualification…)', required=False)
    gaps_in_education = forms.CharField(widget=forms.Textarea(attrs={'rows': 2, 'cols': 70}), required=False)
    professional_certificate = forms.CharField(widget=forms.Textarea(attrs={'rows': 2, 'cols': 70}), required=False)
    professional_experience = forms.CharField(widget=forms.Textarea(attrs={'rows': 5, 'cols': 70}), required=False)
    total_work_experience = forms.CharField(max_length=200, required=False)
    gaps_in_work_experience = forms.CharField(widget=forms.Textarea(attrs={'rows': 2, 'cols': 70}), required=False)
    technical_skills = forms.CharField(widget=forms.Textarea(attrs={'rows': 2, 'cols': 70}), label='Technical skills profile Tools/technologies worked on:', required=False)
    family_particulars = forms.CharField(widget=forms.Textarea(attrs={'rows': 7, 'cols': 70}), required=False)
    languages_known = forms.CharField(widget=forms.Textarea(attrs={'rows': 5, 'cols': 70}), required=False)
    computer_skills = forms.CharField(widget=forms.Textarea(attrs={'rows': 5, 'cols': 70}), required=False)
    professional_references = forms.CharField(widget=forms.Textarea(attrs={'rows': 3, 'cols': 70}), required=False)
    medical_history = forms.CharField(widget=forms.Textarea(attrs={'rows': 2, 'cols': 70}), required=False)
    emergency_name = forms.CharField(max_length=100, required=False)
    emergency_relation = forms.CharField(max_length=50, required=False)
    emergency_address = forms.CharField(widget=forms.Textarea(attrs={'rows': 2, 'cols': 70}), required=False)
    emergency_contact_no = forms.CharField(max_length=20, required=False)
    emergency_alternate_no = forms.CharField(max_length=20, required=False)
    convicted = forms.ChoiceField(choices=[('Yes', 'Yes'), ('NO', 'NO')], widget=forms.RadioSelect(), required=False)
    conviction_details = forms.CharField(widget=forms.Textarea(attrs={'rows': 2, 'cols': 70}), required=False)
    owns_vehicle = forms.ChoiceField(choices=[('Yes', 'Yes'), ('NO', 'NO')], widget=forms.RadioSelect(), required=False)
    vehicle_registration_no = forms.CharField(max_length=50, required=False)
    vehicle_type = forms.CharField(max_length=50, required=False)
    driving_license_no = forms.CharField(max_length=50, required=False)
    declaration = forms.CharField(widget=forms.Textarea(attrs={'rows': 3, 'cols': 70}), required=False)
    place = forms.CharField(max_length=100, required=False)
    signature = forms.CharField(max_length=100, required=False)

    class Meta:
        model = JoiningApplication
        fields = ['first_name', 'middle_name', 'last_name', 'email', 'mobile_number', 'address', 'date_of_birth', 'place_of_birth', 'age',
                  'present_address', 'present_contact_no', 'present_email_id', 'permanent_address', 'permanent_landline', 'gender', 'nationality', 'pan_card', 'marital_status', 'blood_group', 'aadhar_card',
                  'academic_qualification', 'gaps_in_education', 'professional_certificate', 'professional_experience',
                  'total_work_experience', 'gaps_in_work_experience', 'technical_skills', 'family_particulars',
                  'languages_known', 'computer_skills', 'professional_references', 'medical_history', 'emergency_name',
                  'emergency_relation', 'emergency_address', 'emergency_contact_no', 'emergency_alternate_no', 'convicted',
                  'conviction_details', 'owns_vehicle', 'vehicle_registration_no', 'vehicle_type', 'driving_license_no',
                  'declaration', 'place', 'signature']
        labels = {
            'first_name': 'First Name',
            'middle_name': 'Middle Name',
            'last_name': 'Last Name',
            'email': 'Email-Id',
            'mobile_number': 'Personal number',
            'date_of_birth': 'Date of Birth',
            'age': 'Age',
            'permanent_address': 'Permanent Address',
            'permanent_contact_no': 'Contact No',
            'permanent_landline': 'Landline',
            'gender': 'Gender',
            'nationality': 'Nationality',
            'pan_card': 'PAN Card',
            'marital_status': 'Marital Status',
            'blood_group': 'Blood Group',
            'aadhar_card': 'Aadhar Card',
            'academic_qualification': 'Academic Qualification (Starting from SSC to highest qualification…)',
            'gaps_in_education': 'Gaps in Education (If any, give reasons)',
            'professional_certificate': 'Any other Professional Certificate/Qualification',
            'professional_experience': 'Professional/ Work Experience',
            'total_work_experience': 'Total Work Experience',
            'gaps_in_work_experience': 'Any Gaps in Professional/ Work Experience (with reason)',
            'technical_skills': 'Technical skills profile Tools/technologies worked on:',
            'family_particulars': 'Family Particulars',
            'languages_known': 'Languages Known',
            'computer_skills': 'Computer/ Technical Skills',
            'professional_references': 'Professional References',
            'medical_history': 'Any Past Medical history/ Major illness',
            'emergency_name': 'Name of Person',
            'emergency_relation': 'Relation',
            'emergency_address': 'Address',
            'emergency_contact_no': 'Contact No',
            'emergency_alternate_no': 'Alternate No',
            'convicted': 'a) Have you at any time been convicted...',
            'conviction_details': 'Conviction Details',
            'owns_vehicle': 'b) Do You Own a Two or Four Wheeler...',
            'vehicle_registration_no': 'Vehicle Registration No',
            'vehicle_type': 'Type of Vehicle',
            'driving_license_no': 'Valid Vehicle driving License No',
            'declaration': 'Declaration',
            'place': 'Place',
            'signature': 'Signature',
        }

class QualificationProofForm(forms.ModelForm):
    file = forms.FileField(widget=forms.ClearableFileInput(), required=False)

    class Meta:
        model = QualificationProof
        fields = ['file']

class TourPlanForm(forms.ModelForm):
    class Meta:
        model = TourPlan
        fields = ['date', 'territory']

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

        if user:
            user_territories = UserTerritory.objects.filter(user=user)
            self.fields['territory'].queryset = [ut.territory for ut in user_territories]

class VideoQuestionForm(forms.ModelForm):
    class Meta:
        model = VideoQuestion
        fields = ['product_training', 'video', 'question_text']

class VideoAnswerForm(forms.Form):
    option1 = forms.CharField(max_length=300)
    option2 = forms.CharField(max_length=300)
    option3 = forms.CharField(max_length=300)
    option4 = forms.CharField(max_length=300)
    correct_option = forms.ChoiceField(choices=[
        ('option1', 'Option 1'),
        ('option2', 'Option 2'),
        ('option3', 'Option 3'),
        ('option4', 'Option 4'),
    ], widget=forms.RadioSelect)




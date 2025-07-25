from django.db import models
from django.contrib.auth.models import User
import re

# Categories for training
class Categories(models.Model):
    name = models.CharField(max_length=200)
    order = models.IntegerField(default=0)  # Categories ka order
    # ... baaki fields ...

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Categories" # Added for better admin display


# Main Posts (if needed for homepage scrolling content)
class Post(models.Model):
    text = models.TextField()
    # Change ImageField to URLField to store the Google Drive link
    Scroll_image_url = models.URLField(
        max_length=500,  # Set an appropriate max_length for URLs
        blank=True,      # Allow the field to be blank in forms
        null=True,       # Allow the field to be NULL in the database
        verbose_name="Scroll Image URL" # Added for better admin display
    )

    def __str__(self):
        return self.text[:50]
    
    class Meta:
        verbose_name_plural = "Posts" # Added for better admin display


# Territories for tour planning and user mapping
class Territory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Territories" # Added for better admin display


# User Profile with roles and multiple territories
class Profile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    sheet_id = models.CharField(max_length=200, blank=True, null=True)
    territories = models.ManyToManyField(Territory, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
    class Meta:
        verbose_name_plural = "Profiles" # Added for better admin display


# Product Training with category
class ProductTraining(models.Model):
    STATUS = (
        ('PUBLISH', 'PUBLISH'),
        ('DRAFT', 'DRAFT'),
    )
    featured_image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="Featured Image URL"
    )
    title = models.CharField(max_length=500)
    # Temporary comment for Git test
    # --- Start Git Test Change ---
    # This is a test comment to ensure Git push works.
    # --- End Git Test Change ---
    created_at = models.DateField(auto_now_add=True)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    description = models.TextField()
    slug = models.SlugField(default='', max_length=500, null=True, blank=True)
    status = models.CharField(choices=STATUS, max_length=100, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Product Trainings"
        
class ProductVideo(models.Model):
    product_training = models.ForeignKey(ProductTraining, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=500, blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)  # YouTube URL field
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product_training.title} - Video: {self.title or self.video_url}"

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Product Videos" # Added for better admin display

    # --- ADD THIS NEW METHOD ---
    def get_youtube_video_id(self):
        """
        Extracts the YouTube video ID from various YouTube URL formats.
        """
        if not self.video_url:
            return None

        # Common watch URL
        match = re.search(r'(?:https?://)?(?:www\.)?(?:youtube\.com|youtu\.be)/(?:watch\?v=|embed/|v/|)([a-zA-Z0-9_-]{11})', self.video_url)
        if match:
            return match.group(1)

        return None

    def get_embed_url(self):
        """
        Constructs the embeddable YouTube URL for use in an iframe.
        """
        video_id = self.get_youtube_video_id()
        if video_id:
            # Using standard YouTube embed URL. Note the `?rel=0` to prevent related videos.
            return f"https://www.youtube.com/embed/{video_id}?rel=0"
        return None



# Application for joining (job or user form)
class JoiningApplication(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile_number = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    class Meta:
        verbose_name_plural = "Joining Applications" # Added for better admin display


# Qualification Proofs for each application
class QualificationProof(models.Model):
    joining_application = models.ForeignKey(JoiningApplication, related_name='qualification_proofs', on_delete=models.CASCADE)
    # --- CHANGED FROM FileField TO URLField ---
    file_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="File URL" # Changed from file
    )
    # -------------------------------------------

    def __str__(self):
        return f"Qualification Proof for {self.joining_application.first_name} {self.joining_application.last_name}"
    
    class Meta:
        verbose_name_plural = "Qualification Proofs" # Added for better admin display


# Mapping Users to Territories
class UserTerritory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    territory = models.ForeignKey(Territory, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.territory.name}"
    
    class Meta:
        verbose_name_plural = "User Territories" # Added for better admin display


# Tour Plan (user visits in territories)
class TourPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    territory = models.ForeignKey(Territory, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.territory.name}"
    
    class Meta:
        verbose_name_plural = "Tour Plans" # Added for better admin display


# Quiz: Questions for each video
class VideoQuestion(models.Model):
    product_training = models.ForeignKey(ProductTraining, on_delete=models.CASCADE, related_name='video_questions', null=True, blank=True)
    question_text = models.CharField(max_length=500)
    video = models.ForeignKey(ProductVideo, on_delete=models.CASCADE, related_name='questions')

    def __str__(self):
        return self.question_text
    
    class Meta:
        verbose_name_plural = "Video Questions" # Added for better admin display


# Answers for each question
class VideoAnswer(models.Model):
    question = models.ForeignKey(VideoQuestion, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.answer_text
    
    class Meta:
        verbose_name_plural = "Video Answers" # Added for better admin display


# User's result for each video quiz
class UserVideoQuizResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(ProductVideo, on_delete=models.CASCADE)
    score = models.IntegerField()
    total_questions = models.IntegerField()
    completed = models.BooleanField(default=False)
    attempted_on = models.DateTimeField(auto_now_add=True)
    passed = models.BooleanField(default=False)


    class Meta:
        unique_together = ('user', 'video')
        verbose_name_plural = "User Video Quiz Results" # Added for better admin display

    def __str__(self):
        return f"{self.user.username} - {self.video.title} - {self.score}/{self.total_questions}"
    
class UserCategoryProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'category')
        verbose_name_plural = "User Category Progress"

    def __str__(self):
        return f"{self.user.username} - {self.category.name} (Completed: {self.completed})"
    
class UserVideoUnlock(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(ProductVideo, on_delete=models.CASCADE)
    unlocked_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'video')
        verbose_name_plural = "Unlocked Videos"

    def __str__(self):
        return f"{self.user.username} unlocked {self.video.title}"
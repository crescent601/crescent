from django.contrib import admin
from .models import (
    Categories, Post, Territory, Profile, ProductTraining,
    JoiningApplication, QualificationProof, UserTerritory,
    TourPlan, ProductVideo,
    VideoQuestion, VideoAnswer, UserVideoQuizResult as UserVideoQuizResultNew
)

# Inline for QualificationProofs inside JoiningApplication
class QualificationProofInline(admin.TabularInline):
    model = QualificationProof
    extra = 1

class JoiningApplicationAdmin(admin.ModelAdmin):
    inlines = [QualificationProofInline]
    list_display = ('first_name', 'last_name', 'email', 'mobile_number')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'sheet_id')
    filter_horizontal = ('territories',)

# Inline for Video Answers inside VideoQuestion
class VideoAnswerInline(admin.TabularInline):
    model = VideoAnswer
    extra = 4  # 4 options per question

# Admin for VideoQuestion with inline VideoAnswer
@admin.register(VideoQuestion)
class VideoQuestionAdmin(admin.ModelAdmin):
    inlines = [VideoAnswerInline]
    list_display = ('question_text', 'video')

# Inline for VideoQuestion inside ProductVideo
class VideoQuestionInline(admin.TabularInline):
    model = VideoQuestion
    extra = 1

@admin.register(ProductVideo)
class ProductVideoAdmin(admin.ModelAdmin):
    inlines = [VideoQuestionInline]
    list_display = ('title', 'product_training', 'order')
    ordering = ('order',)

@admin.register(ProductTraining)
class ProductTrainingAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status')
    prepopulated_fields = {'slug': ('title',)}

admin.site.register(Categories)
admin.site.register(Post)
admin.site.register(Territory)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(JoiningApplication, JoiningApplicationAdmin)
admin.site.register(QualificationProof)
admin.site.register(UserTerritory)
admin.site.register(TourPlan)
admin.site.register(UserVideoQuizResultNew)

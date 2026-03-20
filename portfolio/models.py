from django.db import models

class Profile(models.Model):
    name = models.CharField(max_length=100)
    tagline = models.CharField(max_length=200) 
    about = models.TextField()
    about_p1 = models.TextField(blank=True)
    about_p2 = models.TextField(blank=True)
    about_p3 = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    resume = models.FileField(upload_to='resume/', blank=True, null=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    email = models.EmailField()
    location = models.CharField(max_length=200, blank=True)
    degree = models.CharField(max_length=200, blank=True)
    typing_phrases = models.TextField(blank=True, help_text="One phrase per line")
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Profile"


class SkillCategory(models.Model):
    name = models.CharField(max_length=100)  # e.g. "Languages", "Frameworks", "Tools"
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Skill Categories"


class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=100, blank=True)  
    proficiency = models.PositiveIntegerField(default=80)  
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']


class Project(models.Model):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
        ('concept', 'Concept'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='projects/', blank=True, null=True)
    tech_stack = models.CharField(max_length=300)  
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order', '-created_at']


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} — {self.subject}"

    class Meta:
        ordering = ['-sent_at']
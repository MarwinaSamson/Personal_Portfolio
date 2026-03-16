from django.shortcuts import render
from django.http import JsonResponse
from .models import Profile, SkillCategory, Project, ContactMessage

def index(request):
    profile = Profile.objects.filter(is_active=True).first()
    skill_categories = SkillCategory.objects.prefetch_related('skills').all()
    featured_projects = Project.objects.filter(is_featured=True)
    all_projects = Project.objects.all()

    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        if name and email and message:
            ContactMessage.objects.create(
                name=name, email=email, subject=subject, message=message
            )
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'error': 'Missing fields'})

    context = {
        'profile': profile,
        'skill_categories': skill_categories,
        'featured_projects': featured_projects,
        'all_projects': all_projects,
    }
    return render(request, 'portfolio/index.html', context)
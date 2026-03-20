from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Count
from .models import *  # Empty, but ok
from portfolio.models import Profile, SkillCategory, Skill, Project, ContactMessage
import json


@login_required
def dashboard(request):
    projects_count = Project.objects.count()
    skills_count = Skill.objects.count()
    unread_messages = ContactMessage.objects.filter(is_read=False).count()
    profile = Profile.objects.first()
    
    # Recent messages
    recent_messages = ContactMessage.objects.order_by('-sent_at')[:4]
    
    # Recent projects
    recent_projects = Project.objects.order_by('-created_at')[:3]
    # All projects for the projects table
    projects = Project.objects.all()
    
    skill_categories = SkillCategory.objects.prefetch_related('skills').all()

    context = {
        'projects_count': projects_count,
        'skills_count': skills_count,
        'unread_messages': unread_messages,
        'recent_messages': recent_messages,
        'recent_projects': recent_projects,
        'profile': profile,
        'projects': projects,
        'skill_categories': skill_categories,
    }
    return render(request, 'admin_app/admin-dashboard.html', context)

# AJAX endpoints for JS interactions 
@require_http_methods(["POST"])
@login_required
def save_profile(request):
    try:
        # accept JSON body
        payload = json.loads(request.body.decode('utf-8')) if request.body else request.POST

        name = payload.get('name')
        email = payload.get('email')
        tagline = payload.get('tagline') or payload.get('hero_badge')
        about = payload.get('about') or payload.get('hero_desc')

        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create(
                name=name or '',
                email=email or '',
                tagline=tagline or '',
                about=about or '',
                location=payload.get('location') or '',
                degree=payload.get('degree') or '',
                is_active=True
            )
        else:
            if name is not None:
                profile.name = name
            if email is not None:
                profile.email = email
            if tagline is not None:
                profile.tagline = tagline
            if about is not None:
                profile.about = about
            location = payload.get('location')
            degree = payload.get('degree')
            if location is not None:
                profile.location = location
            if degree is not None:
                profile.degree = degree
            typing_phrases = payload.get('typing_phrases')
            if typing_phrases is not None:
                profile.typing_phrases = typing_phrases
            github = payload.get('github')
            linkedin = payload.get('linkedin')
            if github is not None:
                profile.github = github
            if linkedin is not None:
                profile.linkedin = linkedin
            profile.save()

        messages.success(request, 'Profile updated!')
        return JsonResponse({'success': True, 'id': profile.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(["POST"])
@login_required
def save_project(request):
    try:
        # Support both JSON payloads and multipart/form-data (with files)
        if request.content_type and request.content_type.startswith('application/json'):
            payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        else:
            payload = request.POST or {}

        proj_id = payload.get('id')
        title = payload.get('title')
        description = payload.get('description')
        tech_stack = payload.get('tech_stack')
        github_url = payload.get('github_url')
        live_url = payload.get('live_url')
        status = payload.get('status') or 'completed'
        raw_featured = payload.get('is_featured', False)
        is_featured = True if raw_featured in [True, 'true', 'True', '1', 1] else False

        if proj_id:
            project = Project.objects.filter(id=proj_id).first()
            if not project:
                return JsonResponse({'success': False, 'error': 'Project not found'}, status=404)
            project.title = title or project.title
            project.description = description or project.description
            project.tech_stack = tech_stack or project.tech_stack
            project.github_url = github_url or project.github_url
            project.live_url = live_url or project.live_url
            project.status = status
            project.is_featured = is_featured
            # handle uploaded thumbnail if present
            if request.FILES.get('thumbnail'):
                project.thumbnail = request.FILES.get('thumbnail')
            project.save()
        else:
            project = Project.objects.create(
                title=title or 'Untitled',
                description=description or '',
                tech_stack=tech_stack or '',
                github_url=github_url or '',
                live_url=live_url or '',
                status=status,
                is_featured=is_featured
            )
            if request.FILES.get('thumbnail'):
                project.thumbnail = request.FILES.get('thumbnail')
                project.save()

        messages.success(request, 'Project updated!')
        return JsonResponse({'success': True, 'id': project.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@require_http_methods(["POST"])
@login_required
def save_skills(request):
    try:
        payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        skills = payload.get('skills') or []

        for s in skills:
            name = s.get('name')
            category_name = s.get('category') or 'Uncategorized'
            proficiency = int(s.get('proficiency') or 0)
            icon = s.get('icon') or ''

            cat, _ = SkillCategory.objects.get_or_create(name=category_name)
            skill = Skill.objects.filter(name=name, category=cat).first()
            if skill:
                skill.proficiency = proficiency
                skill.icon = icon
                skill.save()
            else:
                Skill.objects.create(name=name, category=cat, proficiency=proficiency, icon=icon)

        messages.success(request, 'Skills updated!')
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@require_http_methods(["DELETE"])
@login_required
def delete_project(request, project_id):
    try:
        project = Project.objects.filter(id=project_id).first()
        if not project:
            return JsonResponse({'success': False, 'error': 'Project not found'}, status=404)
        project.delete()
        messages.success(request, 'Project deleted!')
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@require_http_methods(["GET"])
@login_required
def get_project(request, project_id):
    try:
        project = Project.objects.filter(id=project_id).first()
        if not project:
            return JsonResponse({'success': False, 'error': 'Project not found'}, status=404)
        return JsonResponse({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'tech_stack': project.tech_stack,
            'github_url': project.github_url,
            'live_url': project.live_url,
            'status': project.status,
            'is_featured': project.is_featured
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

# Placeholder for other CRUD
def projects_list(request):
    projects = Project.objects.all()
    return render(request, 'admin_app/projects_list.html', {'projects': projects})  # Template later

@require_http_methods(["GET"])
@login_required
def get_messages(request):
    msgs = ContactMessage.objects.order_by('-sent_at')
    data = [{
        'id': m.id,
        'from': m.name,
        'email': m.email,
        'subject': m.subject,
        'body': m.message,
        'time': m.sent_at.strftime('%b %d, %Y'),
        'is_read': m.is_read
    } for m in msgs]
    return JsonResponse({'messages': data})


@require_http_methods(["POST"])
@login_required
def mark_message_read(request, msg_id):
    try:
        msg = ContactMessage.objects.get(id=msg_id)
        msg.is_read = True
        msg.save()
        return JsonResponse({'success': True})
    except ContactMessage.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Not found'}, status=404)


@require_http_methods(["DELETE"])
@login_required
def delete_message(request, msg_id):
    try:
        msg = ContactMessage.objects.get(id=msg_id)
        msg.delete()
        return JsonResponse({'success': True})
    except ContactMessage.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Not found'}, status=404)
    
    
@require_http_methods(["POST"])
@login_required
def save_about(request):
    try:
        payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        p1 = payload.get('p1', '')
        p2 = payload.get('p2', '')
        p3 = payload.get('p3', '')

        profile = Profile.objects.first()
        if not profile:
            return JsonResponse({'success': False, 'error': 'No profile found'}, status=404)

        profile.about_p1 = p1
        profile.about_p2 = p2
        profile.about_p3 = p3
        profile.about = '\n\n'.join(filter(None, [p1, p2, p3]))
        profile.save()

        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
@require_http_methods(["POST"])
@login_required
def save_profile_image(request):
    try:
        image = request.FILES.get('profile_image')
        if not image:
            return JsonResponse({'success': False, 'error': 'No image provided'}, status=400)

        # basic size check — 2MB
        if image.size > 5 * 1024 * 1024:
            return JsonResponse({'success': False, 'error': 'File too large. Max 5MB.'}, status=400)

        # basic type check
        allowed = ['image/jpeg', 'image/png', 'image/webp']
        if image.content_type not in allowed:
            return JsonResponse({'success': False, 'error': 'Invalid file type'}, status=400)

        profile = Profile.objects.first()
        if not profile:
            return JsonResponse({'success': False, 'error': 'No profile found'}, status=404)

        profile.profile_image = image
        profile.save()

        return JsonResponse({'success': True, 'url': profile.profile_image.url})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
    
@require_http_methods(["POST"])
@login_required
def save_skill(request):
    try:
        payload = json.loads(request.body.decode('utf-8')) if request.body else {}
        skill_id    = payload.get('id')
        name        = payload.get('name', '').strip()
        category_name = payload.get('category', 'Uncategorized').strip()
        icon        = payload.get('icon', '').strip()
        proficiency = int(payload.get('proficiency', 80))

        if not name:
            return JsonResponse({'success': False, 'error': 'Name is required'}, status=400)

        cat, _ = SkillCategory.objects.get_or_create(name=category_name)

        if skill_id:
            skill = Skill.objects.filter(id=skill_id).first()
            if not skill:
                return JsonResponse({'success': False, 'error': 'Skill not found'}, status=404)
            skill.name        = name
            skill.category    = cat
            skill.icon        = icon
            skill.proficiency = proficiency
            skill.save()
        else:
            skill = Skill.objects.create(
                name=name, category=cat, icon=icon, proficiency=proficiency
            )

        return JsonResponse({'success': True, 'id': skill.id})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    
@require_http_methods(["DELETE"])
@login_required
def delete_skill(request, skill_id):
    try:
        skill = Skill.objects.get(id=skill_id)
        skill.delete()
        return JsonResponse({'success': True})
    except Skill.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Not found'}, status=404)



# Marwina Samson — Personal Portfolio

A full-stack personal portfolio website built with Django and PostgreSQL, featuring a custom Content Management System (CMS) admin panel that allows complete control over all portfolio content without touching any code.



## Live Features

### Public Portfolio Site

- Hero Section — Animated typing effect, profile photo, social links, and call-to-action buttons
- About Me — Multi-paragraph bio with a read more/less accordion toggle
- Skills and Technologies — Skill cards with progress bars, organized by category with logos
- Projects — Project cards with thumbnails, tech stack tags, status badges, GitHub and Live Demo links
- Contact Form — Functional contact form that saves messages directly to the database
- Responsive Design — Mobile-friendly layout with hamburger navigation

### Admin CMS Panel

The portfolio includes a custom-built admin dashboard at /admin/ that allows the owner to manage all content through a clean interface — no code editing required.

What you can manage from the CMS:

- Profile and Hero — Update name, email, location, degree, bio, profile photo, and typing animation phrases
- Social Links — Save GitHub and LinkedIn URLs
- Projects — Add, edit, and delete projects with thumbnails, tech stack, status, and featured toggle
- Skills — Add, edit, and delete skills with icons and proficiency levels, organized by category
- About Section — Edit all three about paragraphs independently
- Messages / Inbox — View, read, and delete contact form submissions from visitors



## Tech Stack

- Backend: Python 3.12, Django 5
- Database: PostgreSQL
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Fonts: Syne, DM Mono, DM Sans via Google Fonts
- Icons: Devicon SVG via jsDelivr CDN
- Auth: Django built-in authentication
- Media: Pillow for image uploads



## Project Structure

portfolio_project/
├── portfolio/               # Public-facing portfolio app
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   ├── templates/portfolio/index.html
│   └── static/
│       ├── css/index.css
│       └── js/index.js
│
├── admin_app/               # Custom CMS admin app
│   ├── views.py
│   ├── urls.py
│   └── templates/admin_app/admin-dashboard.html
│
└── static/
    ├── css/admin-dashboard.css
    └── js/admin-dashboard.js
```



### Access

- http://localhost:8000/ — Public portfolio site
- http://localhost:8000/admin/ — Custom CMS dashboard
- http://localhost:8000/django-admin/ — Django built-in admin



## Admin Panel

The CMS is accessible at /admin/ and requires login. Once logged in, you can update your personal information and profile photo, edit the hero section typing phrases, add and manage projects and skills, edit your about section, and read or delete messages sent through the contact form. All changes reflect on the public portfolio immediately after saving.



## Deployment

This project is configured for deployment on Railway with gunicorn as the WSGI server, whitenoise for static file serving, dj-database-url for database configuration, python-decouple for environment variables, and Cloudinary for persistent media file storage.


## Author

Marwina Samson
BS Information Technology, 4th Year Student
Western Mindanao State University, College of Computing Studies

GitHub: https://github.com/MarwinaSamson
Email: marwinasamson204@gmail.com


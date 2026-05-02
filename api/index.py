import os
import sys

# Add the project directory to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set default environment variables if not set
os.environ.setdefault('SECRET_KEY', os.getenv('SECRET_KEY', 'your-secret-key-here'))
os.environ.setdefault('DEBUG', os.getenv('DEBUG', 'False'))

from portfolio_project.wsgi import application

app = application

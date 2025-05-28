#!/usr/bin/env bash
set -e  # exit on any error

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🗄️  Applying migrations..."
python manage.py migrate

echo "👤 Creating superuser if missing..."
python manage.py createsuperuser_auto

echo "✅ Build steps complete."

#!/bin/bash

# 🚀 Create New Project from Template
# Usage: ./create-project.sh my-new-project

if [ -z "$1" ]; then
  echo "❌ Error: Project name required"
  echo ""
  echo "Usage: ./create-project.sh my-new-project"
  echo ""
  echo "Examples:"
  echo "  ./create-project.sh recipe-db"
  echo "  ./create-project.sh my-saas"
  echo "  ./create-project.sh internal-tool"
  exit 1
fi

PROJECT_NAME=$1
PROJECT_DIR="../$PROJECT_NAME"

echo "🚀 Creating new project: $PROJECT_NAME"
echo ""

# Check if directory exists
if [ -d "$PROJECT_DIR" ]; then
  echo "❌ Error: Directory $PROJECT_DIR already exists"
  exit 1
fi

# Copy template
echo "📁 Copying template..."
cp -r . "$PROJECT_DIR"

# Remove git history
echo "🔄 Removing template git history..."
rm -rf "$PROJECT_DIR/.git"

# Update package.json
echo "📝 Updating package.json..."
cd "$PROJECT_DIR"
sed -i.bak "s/@app\/template/@app\/$PROJECT_NAME/g" package.json
sed -i.bak "s/AI-proof TypeScript template with maximum enforcement/$PROJECT_NAME/g" package.json
rm package.json.bak

# Initialize new git repo
echo "📦 Initializing new git repository..."
git init
git add .
git commit -m "Initial commit from template"

echo ""
echo "✅ Project created successfully!"
echo ""
echo "Next steps:"
echo ""
echo "  cd ../$PROJECT_NAME"
echo "  pnpm install"
echo "  pnpm run prepare"
echo "  cp packages/config/.env.example .env"
echo "  # Edit .env with your values"
echo "  pnpm dev"
echo ""
echo "📋 See .github/TEMPLATE_CHECKLIST.md for full setup"
echo ""

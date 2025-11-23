#!/bin/bash

echo "🚀 Starting Victor Mobile Web Application..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cat > .env << EOL
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="victor-mobile-dev-secret-$(date +%s)"
EOL
    echo "✅ .env file created"
fi

# Check if Prisma client is generated
if [ ! -d "node_modules/.prisma" ]; then
    echo "🗄️  Generating Prisma client..."
    npx prisma generate
fi

# Check if database exists
if [ ! -f "dev.db" ]; then
    echo "🗄️  Setting up database..."
    npx prisma db push
    echo "✅ Database created"
fi

echo ""
echo "✨ Starting development server..."
echo "🌐 Open http://localhost:3000 in your browser"
echo ""

npm run dev

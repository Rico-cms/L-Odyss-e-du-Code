# L'Odyssée du Code

A React-based interactive coding learning platform built with Vite.

## 🚀 Deploying to Vercel

This repository is configured for easy deployment to Vercel. Follow these steps:

### Option 1: Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Import this repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📦 Project Structure

```
L-Odyssée-du-Code/
├── code-quest/          # Main React + Vite application
│   ├── src/            # Source files
│   ├── public/         # Static assets
│   ├── package.json    # App dependencies
│   └── vite.config.js  # Vite configuration
├── vercel.json         # Vercel deployment configuration
├── package.json        # Root package.json for build commands
└── README.md           # This file
```

## 🛠️ Local Development

```bash
# Install dependencies
cd code-quest
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Or from the root directory:

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

The repository includes:
- **vercel.json**: Configures Vercel to build the `code-quest` subdirectory
- **package.json**: Root-level scripts for easy command execution
- **.gitignore**: Excludes build artifacts and dependencies

## 📝 Notes

- The main application is in the `code-quest` directory
- Build output goes to `code-quest/dist`
- The app uses Vite with React for optimal performance

# Fix Vercel Deployment - Missing app/ folder

## The Problem
Your GitHub repo has files at root, but Next.js 13+ needs an `app/` folder structure.

## The Solution
You need to commit your `app/` folder to GitHub.

## Steps to Fix:

### 1. Check what's currently tracked by git:
```bash
git status
```

### 2. Add the app folder and all necessary files:
```bash
git add app/
git add components/
git add lib/
git add package.json
git add package-lock.json
git add next.config.js
git add tsconfig.json
git add tailwind.config.ts
git add postcss.config.js
```

### 3. Commit everything:
```bash
git commit -m "Add Next.js app folder structure and all dependencies"
```

### 4. Push to GitHub:
```bash
git push origin main
```

### 5. After pushing, verify on GitHub:
Go to: https://github.com/richardagaya/webina

You should now see:
- ✅ `app/` folder
- ✅ `app/api/mpesa-callback/route.ts` file
- ✅ `components/` folder
- ✅ `lib/` folder
- ✅ `package.json` at root

### 6. Vercel will auto-deploy
Once you push, Vercel should automatically detect the changes and redeploy.

### 7. Check Vercel Settings
In Vercel Dashboard → Settings → General:
- **Root Directory**: Should be blank (not `app/`)
- **Build Command**: `next build` (default)
- **Output Directory**: Leave blank

## Critical Files That Must Be in Repo:
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/api/register/route.ts`
- `app/api/mpesa-callback/route.ts` ← **MUST BE THERE!**
- `package.json` (with "next" in dependencies)


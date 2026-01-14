# Vercel Deployment Checklist

## Files that MUST be in your GitHub repo:

### Root level files:
- ✅ `package.json` (with "next" in dependencies)
- ✅ `next.config.js`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.js`
- ✅ `README.md`

### App folder structure:
- ✅ `app/layout.tsx`
- ✅ `app/page.tsx`
- ✅ `app/globals.css`
- ✅ `app/api/register/route.ts`
- ✅ `app/api/mpesa-callback/route.ts` ← **CRITICAL - This must be in repo!**

### Other folders:
- ✅ `components/` folder
- ✅ `lib/` folder

## Vercel Settings to Check:

1. **Root Directory**: Should be blank (or `/`) - NOT `app/`
2. **Build Command**: Should be `next build` (default)
3. **Output Directory**: Leave blank (Next.js default)

## How to verify your repo has all files:

1. Go to: `https://github.com/richardagaya/webina`
2. Check if you see:
   - `app/` folder
   - `app/api/mpesa-callback/route.ts` file
   - `package.json` at root

If these are missing, you need to commit and push them!


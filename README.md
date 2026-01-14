# Webinar Landing Page

A beautiful, modern landing page for webinar registration built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- 📱 Mobile-friendly interface
- ✅ Form validation
- 🎯 User-friendly registration flow
- ✨ Beautiful gradient backgrounds
- 🚀 Built with Next.js 14 (App Router)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
webinar/
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page component
├── package.json         # Dependencies
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Customization

You can easily customize:
- Event details (date, time, location)
- Form fields
- Colors and styling in `tailwind.config.ts`
- Content in `app/page.tsx`

## Build for Production

```bash
npm run build
npm start
```

## License

MIT


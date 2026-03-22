# Lunario 🌙

Lunario is a modern, responsive web application for tracking astrological cycles and lunar phases. Designed for the 2026–2027 astrological year, it provides a comprehensive timeline, cycle insights, and a detailed calendar view to align your planning with the stars.

## 🚀 Features

- **Astrological Timeline**: A comprehensive view of the 52 lunar phases across the astrological year.
- **Cycle Insights ("Por Ciclo")**: Deep dive into specific astrological cycles (e.g., Aries, Taurus) and their 4 corresponding lunar phases (New, First Quarter, Full, Last Quarter).
- **Interactive Calendar**: A detailed monthly grid view showing exactly when each phase begins.
- **Current Phase Detection**: Instantly see today's lunar phase and astrological theme.
- **Unified Single-Column Layout**: A harmonious, distraction-free reading experience that gracefully scales from mobile devices to ultra-wide desktop monitors.
- **Dark Mode Optimized**: Built with a sleek, gold-accented dark theme for comfortable viewing.
- **Calendar Export**: Easily export the year's events to integrate with your personal calendar.

## 🛠️ Tech Stack

This project is built using modern, bleeding-edge web technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/) & `@supabase/ssr`
- **Icons:** [Lucide React](https://lucide.dev/)
- **Dates Handling:** `date-fns`
- **Language:** TypeScript

## 📦 Getting Started

First, install the dependencies. The project uses standard package managers (npm, yarn, pnpm, or bun):

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗂️ Project Structure

- `src/app/(main)/page.tsx` - The **Timeline** (Línea de Tiempo) view.
- `src/app/(main)/ciclos/page.tsx` - The **Cycles** (Por Ciclo) view.
- `src/app/(main)/calendario/page.tsx` - The **Calendar** (Calendario) grid view.
- `src/app/globals.css` - Global styles, CSS variables, and layout directives.
- `src/lib/data.ts` - Hardcoded definitions for the 2026-2027 astrological cycles and phases.

## 🌐 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Any commits pushed to the `master` or `main` branch will automatically trigger a new deployment.

---

*Built for Poliphonia Studio.*

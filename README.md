# Proposal Website

A romantic proposal experience built with Next.js. The site combines soft animations, photo moments, and a playful flow to create a memorable surprise.

## Features

- Smooth animated screens and transitions
- Background audio support
- Photo gallery and final reveal
- Responsive layout for desktop and mobile

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- Motion
- Swiper.js

## Local Setup

```bash
git clone <your-repo-url>
cd proposal-site
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Keep the default Next.js settings.
4. Deploy.

The project already includes `vercel.json` and a valid Next.js app structure, so it is ready for Vercel deployment.

## Project Structure

```text
src/
  app/
  components/
public/
  audio/
  gif/
  images/
```

## Notes

- The repository is set up as a private project.
- Large media files are stored in `public/`.
- If you change the app root or add another lockfile, update the deployment root accordingly.

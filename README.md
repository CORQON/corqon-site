# CORQON Marketing Website

Premium dark-mode marketing website for CORQON, built with Next.js 14, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following:

```bash
# Calendly Scheduling URL
NEXT_PUBLIC_SCHEDULING_URL="https://calendly.com/corqon/30min?back=1"
```

**Important**: Do not include the `month` parameter in the URL (e.g., `&month=2025-12`) as this would lock the widget to a specific month.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

### Required Variables

- `NEXT_PUBLIC_SCHEDULING_URL`: The Calendly scheduling URL used for the embedded widget on the `/contact` page. This should point to your Calendly booking page with the `?back=1` parameter for navigation.

### Deployment

When deploying to production (Vercel, Netlify, etc.), make sure to add the `NEXT_PUBLIC_SCHEDULING_URL` environment variable in your hosting platform's settings:

1. Go to your hosting platform's dashboard
2. Navigate to Environment Variables settings
3. Add: `NEXT_PUBLIC_SCHEDULING_URL` = `https://calendly.com/corqon/30min?back=1`
4. Redeploy the application

**Important**: The environment variable must be set for the scheduling widget to work. If missing, users will see a fallback message with an email contact link.

## Features

- **Calendly Integration**: Embedded scheduling widget on the contact page
- **Hash Navigation**: Smooth scrolling to sections with hash links
- **Premium UI**: Dark mode design with glass panels and subtle animations
- **Responsive Design**: Optimized for all screen sizes
- **TypeScript**: Full type safety throughout the codebase

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── contact/           # Contact/scheduling page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── SchedulingEmbed.tsx # Calendly embed component
│   └── ...                # Other components
├── lib/                   # Utility functions and hooks
│   └── useSmoothScroll.ts # Smooth scroll helper
└── public/                # Static assets
```

## Contact

For questions or support, contact us at info@corqon.com


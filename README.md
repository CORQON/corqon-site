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
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/corqon/30min?back=1"
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

- `NEXT_PUBLIC_CALENDLY_URL`: The Calendly scheduling URL used for the embedded widget on the `/contact` page. This should point to your Calendly booking page with the `?back=1` parameter for navigation.

### Deployment to Vercel

**Critical**: The Calendly integration requires the environment variable to be set in Vercel for both Preview and Production environments.

#### Setting Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_CALENDLY_URL`
   - **Value**: `https://calendly.com/corqon/30min?back=1`
   - **Environment**: Select **Production**, **Preview**, and **Development** (or at minimum Production and Preview)
4. Click **Save**
5. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**
   - Or push a new commit to trigger a new deployment

#### Example Value:
```
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/corqon/30min?back=1
```

**Important**: 
- The environment variable must be set for the scheduling widget to work
- If missing, users will see a fallback message with an email contact link
- The URL must use HTTPS (HTTP URLs will be automatically upgraded)
- Do not include the `month` parameter in the URL

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
│   ├── CalendlyInline.tsx # Calendly inline embed component
│   └── ...                # Other components
├── lib/                   # Utility functions and hooks
│   └── useSmoothScroll.ts # Smooth scroll helper
└── public/                # Static assets
```

## Contact

For questions or support, contact us at info@corqon.com


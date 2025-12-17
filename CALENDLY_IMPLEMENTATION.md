# Calendly Scheduling Implementation

## Summary

Implemented Calendly scheduling integration on the CORQON marketing site with a premium-styled scheduling experience.

## Changes Made

### 1. New Components & Utilities

- **`components/SchedulingEmbed.tsx`**: Reusable Calendly inline widget component
  - Loads Calendly script via Next.js Script component
  - Reads scheduling URL from environment variable
  - Displays non-blocking warning if env var is missing
  - Responsive design (720px desktop, 820px mobile)
  - CORQON styling: glass panel, rounded corners, subtle borders

- **`lib/useSmoothScroll.ts`**: Helper hook for smooth hash navigation
  - Detects if user is already on target page
  - Smoothly scrolls to anchored section
  - Handles cross-page and same-page navigation

### 2. Updated Pages

- **`app/contact/page.tsx`**: Completely replaced with scheduling UI
  - Main heading: "Schedule a walkthrough"
  - Subtext: "Pick a time that fits. You will receive a calendar invite instantly."
  - Inline Calendly embed
  - Fallback email contact option
  - Hash scroll handler for #schedule anchor
  - Added `id="schedule"` for deep linking

### 3. Updated CTA Buttons

All "Plan a pilot" and "Schedule a walkthrough" buttons now route to `/contact#schedule`:

- **`app/page.tsx`**: 
  - Hero "Plan a pilot" button
  - Final CTA "Schedule a walkthrough" button
  
- **`components/Navbar.tsx`**:
  - Top navigation "Plan a pilot" button
  
- **`components/Footer.tsx`**:
  - Footer "Plan a pilot" link

### 4. Environment Configuration

- **`.env.local`**: Created with scheduling URL
- **`.env.local.example`**: Template for other developers
- Both contain: `NEXT_PUBLIC_SCHEDULING_URL="https://calendly.com/corqon/30min?back=1"`

### 5. Documentation

- **`README.md`**: Created comprehensive setup documentation
  - Installation instructions
  - Environment variable configuration
  - Development and build commands
  - Deployment notes
  - Project structure overview

## Technical Details

### Calendly Integration

- Uses Calendly inline widget: `<div class="calendly-inline-widget">`
- Script loaded via Next.js `<Script strategy="afterInteractive">`
- Script ID: `calendly-widget-script` (prevents duplication)
- Base URL: `https://calendly.com/corqon/30min?back=1`
- No month parameter (prevents locking to specific month)

### Smooth Scrolling

- Hash navigation handled via `useEffect` in contact page
- 100px offset from top for navbar clearance
- Smooth scroll behavior with `window.scrollTo({ behavior: 'smooth' })`
- Works for both cross-page (`/contact#schedule`) and same-page navigation

### Responsive Design

- Desktop: 720px height
- Mobile (≤640px): 820px height (more scroll space)
- Minimum width: 320px
- Horizontal overflow prevented on mobile

### Styling

- Dark premium UI matching CORQON brand
- Glass panel effect: `bg-white/5 backdrop-blur-xl`
- Subtle borders: `border-white/10`
- Rounded corners: `rounded-2xl`
- Text colors: white and white/70

## Testing

✅ Build successful (`npm run build`)
✅ No linter errors
✅ TypeScript compilation successful
✅ All routes generated correctly

## Deployment Checklist

1. Ensure `.env.local` exists locally (already created)
2. Add `NEXT_PUBLIC_SCHEDULING_URL` to production hosting platform
3. Verify URL does not include `&month=` parameter
4. Test scheduling widget on production after deployment

## Files Modified

- `app/contact/page.tsx`
- `app/page.tsx`
- `components/Footer.tsx`
- `components/Navbar.tsx`

## Files Created

- `components/SchedulingEmbed.tsx`
- `lib/useSmoothScroll.ts`
- `.env.local`
- `.env.local.example`
- `README.md`
- `CALENDLY_IMPLEMENTATION.md` (this file)


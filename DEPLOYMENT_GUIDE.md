# CD Template Generator - Deployment Guide

This guide will help you deploy your CD Template Generator application to Vercel, even if you're encountering build errors locally.

## Current Build Issues

There appears to be a type error in the `src/lib/pdf-generator.ts` file. The error message is:

```
Type error: Type 'boolean' is not assignable to type 'View'.
```

This is likely due to a type mismatch in the React PDF renderer components. Before deploying, you have two options:

### Option 1: Fix the Type Error

1. Open `src/lib/pdf-generator.ts`
2. Look for the `CDTemplate` component around line 267
3. The issue is with the return type of the component. You can try:
   - Adding explicit type annotations
   - Checking if any boolean values are being incorrectly passed to View components
   - Ensuring all props are properly typed

### Option 2: Deploy with Type Checking Disabled

If you need to deploy quickly and fix the type issues later, you can temporarily disable TypeScript type checking during build:

1. Modify your `next.config.js` file:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     // ... other config
     typescript: {
       // ⚠️ Dangerously allow production builds to successfully complete even if
       // your project has type errors.
       ignoreBuildErrors: true,
     },
     // ... rest of your config
   };
   ```

2. This will allow the build to complete despite TypeScript errors.

## Deploying to Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Create a Vercel Blob store for image storage:
   - Go to your Vercel dashboard
   - Navigate to Storage → Create a new Blob store
   - Copy the provided `BLOB_READ_WRITE_TOKEN`

### Deployment Steps

#### Using Vercel Dashboard (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" or "Add New..." → "Project"
4. Import your repository
5. Configure environment variables:
   - Add `BLOB_READ_WRITE_TOKEN` with your token value
6. Under "Build & Development Settings":
   - If you're using Option 2 above, you can also set the "Override" for the build command to:
     ```
     next build --no-lint
     ```
7. Click "Deploy"
8. After deployment, add `NEXT_PUBLIC_APP_URL` with your new deployment URL in the project settings

#### Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. During the interactive setup:
   - Enter your environment variables when prompted
   - Confirm deployment settings
   - If using Option 2, you can set the build command to `next build --no-lint`

5. After deployment, update `NEXT_PUBLIC_APP_URL` in your project settings

## Post-Deployment

After deploying, verify that all features work correctly:

- Image uploads and cropping
- PDF generation
- Form submissions
- Mobile responsiveness

## Troubleshooting

- **Image uploads fail**: Check that your Blob store is properly configured and the `BLOB_READ_WRITE_TOKEN` is correct
- **PDF generation issues**: Check browser console for errors related to React PDF renderer
- **Styling issues**: Verify that Tailwind CSS is properly loaded
- **API errors**: Check Vercel logs for any server-side errors

## Long-term Fixes

Once deployed, you should:

1. Fix the TypeScript errors in your local development environment
2. Re-enable type checking for future builds
3. Add proper error handling for production
4. Set up monitoring and analytics

## Need Help?

If you continue to encounter issues, you can:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the [Next.js deployment guide](https://nextjs.org/docs/deployment)
3. Consult the [React PDF documentation](https://react-pdf.org/) for PDF rendering issues 
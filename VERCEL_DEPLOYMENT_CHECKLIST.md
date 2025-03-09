# Vercel Deployment Checklist

Use this checklist to ensure you've completed all the necessary steps for deploying your CD Template Generator to Vercel.

## Before Deployment

- [ ] Make sure all code changes are committed and pushed to your repository
- [ ] Ensure your project builds locally without errors (`npm run build`)
- [ ] Create a Vercel account if you don't have one already (https://vercel.com/signup)
- [ ] Create a Vercel Blob store for image storage

## Environment Variables

Your application requires the following environment variables:

- [ ] `BLOB_READ_WRITE_TOKEN`: Token for Vercel Blob storage (required)
- [ ] `NEXT_PUBLIC_APP_URL`: The URL of your deployed application (set after first deployment)
- [ ] `MAX_UPLOAD_SIZE`: Maximum file size for uploads in bytes (optional, defaults to 5MB)

## Deployment Steps

### Option 1: Vercel Dashboard (Recommended)

- [ ] Push your code to a GitHub/GitLab/Bitbucket repository
- [ ] Go to the [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "New Project" or "Add New..." -> "Project"
- [ ] Import your repository
- [ ] Configure environment variables:
  - [ ] Add `BLOB_READ_WRITE_TOKEN` with your token value
- [ ] Click "Deploy"
- [ ] After deployment, add `NEXT_PUBLIC_APP_URL` with your new deployment URL

### Option 2: Vercel CLI

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Deploy your project: `vercel`
- [ ] During the interactive setup:
  - [ ] Enter your environment variables when prompted
  - [ ] Confirm deployment settings
- [ ] After deployment, update `NEXT_PUBLIC_APP_URL` in your project settings

## Post-Deployment

- [ ] Verify that your site is accessible at the deployment URL
- [ ] Test image upload functionality
- [ ] Test PDF generation
- [ ] Test all interactive components
- [ ] Check mobile responsiveness
- [ ] Set up a custom domain (optional)

## Troubleshooting

- If image uploads fail, check that your Blob store is properly configured and the `BLOB_READ_WRITE_TOKEN` is correct
- If the application URL is incorrect in generated content, ensure `NEXT_PUBLIC_APP_URL` is set to your deployed URL
- For other issues, check Vercel deployment logs in your project dashboard

## Monitoring and Analytics

- [ ] Set up Vercel Analytics to monitor performance (optional)
- [ ] Configure error monitoring (e.g., Sentry) for production errors (optional)

---

For more detailed instructions, refer to the `README.md` file in the project root. 
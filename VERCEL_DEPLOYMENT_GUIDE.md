# CD Template Generator - First Deployment Guide

This guide will walk you through deploying your CD Template Generator to Vercel for the first time.

## Prerequisites

Before you begin deployment, make sure you have:

1. A Vercel account (sign up at https://vercel.com/signup if you don't have one)
2. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)
3. All build errors fixed (which we've done)

## Step 1: Set Up Vercel Blob Storage

You need to create a Vercel Blob store for image storage:

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. In the sidebar, click on **Storage**
3. Select **Create Blob Store**
4. Name your store (e.g., "cd-template-generator")
5. Click **Create**
6. After creation, you'll see a **Token** - copy this token as you'll need it during deployment
   - This is your `BLOB_READ_WRITE_TOKEN`
   - **Important**: This token is only shown once, so make sure to save it in a secure place

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended for First Deployment)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your Git repository:
   - Connect to GitHub/GitLab/Bitbucket if you haven't already
   - Select your CD Template Generator repository
4. Configure your project:
   - **Project Name**: Enter a name (e.g., "cd-template-generator")
   - **Framework Preset**: Should automatically detect Next.js
   - **Root Directory**: Leave as is (should be `/`)
5. Under **Environment Variables**, add the following:
   - `BLOB_READ_WRITE_TOKEN`: Paste the token you copied from Step 1
   - Note: `NEXT_PUBLIC_APP_URL` will be set after deployment
6. Click **Deploy**
7. Wait for the deployment to complete (this typically takes a few minutes)

### Option B: Using Vercel CLI

If you prefer using the command line:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project directory and run:
   ```bash
   vercel
   ```

4. Follow the interactive prompts:
   - Link to an existing project? Select "No" for first deployment
   - Set up a new project? Select "Yes"
   - Enter project name when prompted
   - When asked about environment variables, add `BLOB_READ_WRITE_TOKEN`
   - For most other questions, you can accept the defaults

## Step 3: Configure Post-Deployment Settings

After your first successful deployment:

1. Go to your project in the Vercel Dashboard
2. Copy your deployment URL (e.g., `https://cd-template-generator.vercel.app`)
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_APP_URL`
   - **Value**: Paste your deployment URL
5. Click **Save**
6. Go to **Deployments**, find your latest deployment, and click **Redeploy** to apply the new environment variable

## Step 4: Verify Your Deployment

1. Visit your deployed site (using the URL from Step 3)
2. Test these key functionality areas:
   - Navigate through all pages
   - Upload images for CD templates
   - Generate and download PDF templates
   - Verify mobile responsiveness

## Step 5: Set Up a Custom Domain (Optional)

To use your own domain:

1. In your Vercel Dashboard, go to your project
2. Click on **Settings** → **Domains**
3. Enter your domain name and click **Add**
4. Follow the instructions to configure your DNS settings

## Troubleshooting Common Issues

### Image Upload Issues

If image uploads aren't working:
- Verify your `BLOB_READ_WRITE_TOKEN` is correct
- Check browser console for any errors
- Make sure your Blob store is properly configured

### PDF Generation Issues

If PDF generation isn't working:
- Check browser console for errors
- Verify that all required image fields are filled
- Try with smaller images if you're having performance issues

### Build Errors

If you encounter new build errors:
- Check the deployment logs in Vercel Dashboard
- Make sure all environment variables are properly set
- Check for any missing dependencies

## Next Steps After Deployment

1. **Set Up Analytics**: Consider adding Vercel Analytics to monitor site performance
2. **Enable Error Monitoring**: Add error tracking with a service like Sentry
3. **Regular Maintenance**: Keep your dependencies updated regularly
4. **Gather User Feedback**: Collect feedback to improve the application

## Automated Deployments

Once set up, Vercel will automatically deploy new versions whenever you push to your main branch. No additional steps are required for future deployments.

---

Your CD Template Generator is now live and accessible to users worldwide! If you encounter any issues during deployment, refer to the [Vercel Documentation](https://vercel.com/docs) or reach out for assistance. 
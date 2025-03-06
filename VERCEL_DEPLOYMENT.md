# Deploying MiniCDWorld to Vercel

This guide explains how to deploy the MiniCDWorld application to Vercel using GitHub.

## Architecture Overview

MiniCDWorld uses an in-memory processing approach for handling file uploads and PDF generation:

1. **Frontend**: React application for user interface
2. **Backend**: Express API deployed as Vercel serverless functions
3. **File Storage**: In-memory storage for the duration of the user session
4. **PDF Generation**: On-demand PDF creation with PDFKit

This architecture is optimized for quick deployments without external dependencies like AWS S3.

## Prerequisites

Before deploying, you need:

1. A GitHub account with your MiniCDWorld repository
2. A Vercel account (free tier is fine)

## Deployment Steps

1. Push your code to GitHub if you haven't already.

2. Log in to Vercel and import your GitHub repository.

3. Configure the following settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install`

4. Add the following environment variables in Vercel's project settings:

   | Name | Value | Description |
   |------|-------|-------------|
   | NODE_ENV | production | Set environment to production |

5. Deploy your application by clicking "Deploy".

## Verifying Your Deployment

After deployment:

1. Test the application by visiting your Vercel domain.
2. Check that file uploads work correctly.
3. Verify that PDF generation and downloads function as expected.

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs for errors.
2. Verify your environment variables are set correctly.
3. Check if your application is hitting Vercel's serverless function limits:
   - Memory: 1024MB (set in vercel.json)
   - Duration: 10 seconds (set in vercel.json)
   - Payload: 5MB (set in file upload middleware)

## Limitations

The in-memory approach has some limitations to be aware of:

1. **Session-based storage**: PDFs and uploaded files are only stored for the duration of the session (or until the serverless function is recycled).
2. **Concurrent requests**: Heavy processing in memory can affect performance with multiple users.
3. **Function timeout**: Vercel limits serverless functions to a maximum of 10 seconds execution time.

If you need more persistent storage in the future, consider adding a database or storage service like Vercel Blob Storage or AWS S3. 
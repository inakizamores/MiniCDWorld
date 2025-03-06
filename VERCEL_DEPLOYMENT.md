# Deploying MiniCDWorld to Vercel

This guide explains how to deploy the MiniCDWorld application to Vercel using GitHub.

## Prerequisites

Before deploying, you need:

1. A GitHub account with your MiniCDWorld repository
2. A Vercel account (free tier is fine)
3. An AWS account for S3 storage (or another storage solution)

## Setup AWS S3 Bucket

Since Vercel's serverless functions don't have a persistent file system, we use AWS S3 for file storage:

1. Log in to your AWS Management Console
2. Create a new S3 bucket with a unique name
3. Configure CORS for your bucket to allow access from your Vercel domain:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "POST", "PUT"],
       "AllowedOrigins": ["https://your-vercel-domain.vercel.app"],
       "ExposeHeaders": []
     }
   ]
   ```
4. Create an IAM user with programmatic access and attach the `AmazonS3FullAccess` policy (or create a more restrictive policy for production)
5. Save the Access Key ID and Secret Access Key for the next step

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
   | STORAGE_TYPE | s3 | Use S3 for file storage |
   | AWS_ACCESS_KEY_ID | your-access-key | Your AWS access key |
   | AWS_SECRET_ACCESS_KEY | your-secret-key | Your AWS secret access key |
   | AWS_REGION | us-east-1 | AWS region where your bucket is located |
   | AWS_S3_BUCKET | your-bucket-name | Name of your S3 bucket |
   | CORS_ORIGIN | https://your-vercel-domain.vercel.app | Your Vercel domain |

5. Deploy your application by clicking "Deploy".

## Verifying Your Deployment

After deployment:

1. Test the application by visiting your Vercel domain.
2. Check that file uploads work correctly.
3. Verify that PDF generation and downloads function as expected.

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs for errors.
2. Verify your AWS credentials and permissions.
3. Ensure your S3 bucket CORS configuration is correct.
4. Check that all required environment variables are set in Vercel.

## Local Development vs. Production

The application is designed to work in both environments:

- **Local development**: Files are stored locally in `uploads/` and `output/` folders.
- **Production**: Files are stored in AWS S3 when `STORAGE_TYPE=s3`.

To test the production configuration locally, set `STORAGE_TYPE=s3` in your local `.env` file and provide your AWS credentials. 
/**
 * Blob storage configuration utilities
 * Provides fallback token functionality for initial deployment
 */

/**
 * Gets the Blob read/write token with fallback mechanism
 * IMPORTANT: You will need to manually update this with your actual token
 * for the first deployment, then use environment variables later
 */
export function getBlobToken() {
  // Try to use the environment variable if available
  const envToken = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (envToken && typeof envToken === 'string' && envToken.length > 0) {
    return envToken;
  }
  
  // ⚠️ TEMPORARY: For first deployment only
  // After first deployment succeeds, REMOVE THIS and use environment variables!
  // You'll need to update this to your actual token value for the first deployment
  return "vercel_blob_rw_Q1SEjnqlPHN9kuBR_oxUOOkRAWHV56rLTIG7KtOsfcXXi47";
} 
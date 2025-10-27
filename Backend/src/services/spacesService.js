import AWS from 'aws-sdk';
import crypto from 'crypto';

// Simple UUID v4 generator using crypto
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = crypto.randomBytes(1)[0] % 16;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Configure AWS SDK for DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
  region: process.env.DO_SPACES_REGION || 'nyc3',
  s3ForcePathStyle: false, // Configures to use subdomain/virtual calling format.
  signatureVersion: 'v4'
});

/**
 * Upload a file to DigitalOcean Spaces
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} folder - Folder path (optional)
 * @param {string} clientName - Client name for identification (optional)
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadToSpaces = async (fileBuffer, fileName, mimeType, folder = '', clientName = null) => {
  try {
    // Generate filename with client name if provided
    const fileExtension = fileName.split('.').pop();
    let uniqueFileName;
    
    if (clientName) {
      // Clean client name (remove spaces, special chars)
      const cleanClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      uniqueFileName = `${cleanClientName}_profile_${Date.now()}.${fileExtension}`;
    } else {
      uniqueFileName = `${generateUUID()}-${Date.now()}.${fileExtension}`;
    }
    
    const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    const uploadParams = {
      Bucket: process.env.DO_SPACES_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read', // Make file publicly accessible
      CacheControl: 'max-age=31536000', // Cache for 1 year
    };

    const result = await s3.upload(uploadParams).promise();
    
    // Return both the direct URL and CDN URL
    const cdnUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${key}`;
    
    return {
      success: true,
      url: result.Location,
      cdnUrl: cdnUrl,
      key: key,
      bucket: process.env.DO_SPACES_BUCKET_NAME,
      fileName: uniqueFileName
    };
  } catch (error) {
    console.error('Error uploading to DigitalOcean Spaces:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

/**
 * Delete a file from DigitalOcean Spaces
 * @param {string} key - File key/path in the bucket
 * @returns {Promise<Object>} Delete result
 */
export const deleteFromSpaces = async (key) => {
  try {
    const deleteParams = {
      Bucket: process.env.DO_SPACES_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
    
    return {
      success: true,
      message: 'File deleted successfully',
      key: key
    };
  } catch (error) {
    console.error('Error deleting from DigitalOcean Spaces:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Get a signed URL for temporary access to a private file
 * @param {string} key - File key/path in the bucket
 * @param {number} expiresIn - Expiration time in seconds (default: 3600)
 * @returns {Promise<string>} Signed URL
 */
export const getSignedUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error(`Signed URL generation failed: ${error.message}`);
  }
};

export default {
  uploadToSpaces,
  deleteFromSpaces,
  getSignedUrl,
}; 
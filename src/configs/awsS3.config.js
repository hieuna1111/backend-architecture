const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const awsS3Config = {
  region: process.env.AWS_REGION_BUCKET_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const awsS3 = new S3Client(awsS3Config);

module.exports = { awsS3, PutObjectCommand, GetObjectCommand };

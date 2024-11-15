import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export const getS3Config = () => ({
  s3: {
    endPoint: process.env.S3_END_POINT,
    port: +process.env.S3_PORT,
    useSSL: process.env.S3_USE_SSL === 'true',
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION ?? 'us-east-1',
  },
  staticObject: {
    bucketName: process.env.S3_BUCKET_NAME,
  },
});

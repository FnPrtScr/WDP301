'use strict';
require('dotenv').config();
const { S3Client,PutObjectCommand } = require("@aws-sdk/client-s3");
const { AWS_BUCKET_ACCESS_KEY, AWS_BUCKET_SECRET_KEY } = process.env;

const s3Config = {
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: AWS_BUCKET_SECRET_KEY
    }
}

const s3=new S3Client(s3Config)
module.exports = {
    s3,PutObjectCommand
}
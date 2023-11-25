'use strict';

const crypto = require('crypto');
const cloudinary = require('../configs/cloudinary.config');
const {
  awsS3,
  PutObjectCommand,
  GetObjectCommand,
} = require('../configs/awsS3.config');

const randomImageName = () => crypto.randomBytes(16).toString('hex');

// UPLOAD AWS S3

const uploadFileFromLocalToAwsS3 = async ({ file }) => {
  try {
    const imageName = randomImageName();
    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME_S3,
      Key: imageName,
      Body: file?.buffer,
      ContentType: 'image/jpeg',
    });
    await awsS3.send(putCommand);
    // export url
    return `${process.env.AWS_CLOUD_FRONT_DISTRIBUTION_URL}/${imageName}`;
  } catch (error) {
    console.log('Error uploading file to s3 client:' + error);
  }
};

// UPLOAD AWS S3

// 1. upload image from url
const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      'https://down-vn.img.susercontent.com/file/bcddb5611948cbae7b4251d72c7b10c9';
    const folderName = 'product/shopId';
    const newFileName = 'testDemo';
    const result = await cloudinary.uploader.upload(urlImage, {
      // public_id: newFileName,
      folder: folderName,
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

// 2. upload image from local
const uploadImageFromLocal = async ({ path, folderName = 'product/8049' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      // public_id: 'thumb',
      folder: folderName,
    });
    return {
      imageUrl: result.secure_url,
      shopId: 8049,
      thumbUrl: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.log(error);
  }
};

// 3. upload multiple images from local
const uploadMultipleImageFromLocal = async ({
  files,
  folderName = 'product/8049',
}) => {
  try {
    if (!files?.length) return;
    const uploadPromises = files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });

      return {
        imageUrl: result.secure_url,
        shopId: 8049,
        thumbUrl: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: 'jpg',
        }),
      };
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadFileFromLocalToAwsS3,
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultipleImageFromLocal,
};

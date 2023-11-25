'use strict';

const express = require('express');
const UploadController = require('../../controllers/upload.controller');
const { authentication } = require('../../common/utils/auth.util');
const { uploadDisk, uploadMemory } = require('./../../configs/multer.config');
const router = express.Router();

router.post('/image', authentication, UploadController.uploadImage);

router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  authentication,
  UploadController.uploadThumbImage
);

router.post(
  '/product/multiple-images',
  uploadDisk.array('files', 3),
  authentication,
  UploadController.uploadMultipleImages
);

// upload to s3

router.post(
  '/product/bucket',
  uploadMemory.single('file'),
  authentication,
  UploadController.uploadFileFromLocalToS3
);

module.exports = router;

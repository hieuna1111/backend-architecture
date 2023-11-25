const {
  okResponse,
  createdResponse,
} = require('../common/utils/handleSuccess.util');
const catchAsync = require('../common/helpers/catchAsync.helper');
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultipleImageFromLocal,
  uploadFileFromLocalToAwsS3,
} = require('../services/upload.service');
const { throwBadRequest } = require('../common/utils/handleError.util');

class UploadController {
  uploadImage = catchAsync(async (req, res) => {
    okResponse({
      res,
      message: 'Upload image successfully',
      metadata: await uploadImageFromUrl(),
    });
  });

  uploadThumbImage = catchAsync(async (req, res) => {
    const { file } = req;
    throwBadRequest(!file, 'file not attached');
    okResponse({
      res,
      message: 'Upload image successfully',
      metadata: await uploadImageFromLocal({
        path: file.path,
      }),
    });
  });

  uploadMultipleImages = catchAsync(async (req, res) => {
    const { files } = req;
    throwBadRequest(!files || !files.length, 'files array not attached');
    okResponse({
      res,
      message: 'Upload images array successfully',
      metadata: await uploadMultipleImageFromLocal({ files }),
    });
  });

  uploadFileFromLocalToS3 = catchAsync(async (req, res) => {
    const { file } = req;
    throwBadRequest(!file, 'file not attached');
    okResponse({
      res,
      message: 'Upload file to s3 successfully',
      metadata: await uploadFileFromLocalToAwsS3({ file }),
    });
  });
}

module.exports = new UploadController();

import { NextFunction, Request, Response } from 'express';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';

const fileTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET } = process.env;

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_KEY + '',
    secretAccessKey: S3_SECRET + '',
  },
});

// IMPORTANT  to handle

// 5- investigate ACL options

export const fileUpload = (req: Request, res: Response, _next: NextFunction) => {
  const form = formidable({ allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024 }); //5mb max

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(413).send('File size exceeds limit');
    }

    const file = files.file as File;

    if (!file) {
      return res.status(404).send('Please make sure to provide a file to upload');
    }

    if (fileTypes.indexOf(file.mimetype + '') === -1) {
      return res.status(422).send('File type is not supported');
    }
    const fileStream = fs.createReadStream(file.filepath);
    const upload = new Upload({
      client: s3,
      params: {
        ACL: 'public-read',
        Bucket: S3_BUCKET,
        Key: `${Date.now().toString()}-${file.originalFilename}`,
        Body: fileStream,
      },
      tags: [],
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });

    upload.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });

    upload.done();
    res.send('File has been uploaded');
  });
};

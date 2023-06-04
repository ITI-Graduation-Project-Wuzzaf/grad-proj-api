import { NextFunction, Request, Response } from 'express';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
import { AbortMultipartUploadCommandOutput, CompleteMultipartUploadCommandOutput, S3Client } from '@aws-sdk/client-s3';

const fileTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

type UploadPromise = void | CompleteMultipartUploadCommandOutput | AbortMultipartUploadCommandOutput;

const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET, CF_DOMAIN } = process.env;

const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_KEY + '',
    secretAccessKey: S3_SECRET + '',
  },
});

export const fileUpload = (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({ allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024, maxFiles: 2 }); //5mb max

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(413).send([{ message: 'File size exceeds limit' }]);
    }

    req.body = fields;
    const uploadPromises: Promise<UploadPromise>[] = [];
    Object.entries(files).forEach(([fieldName, f]) => {
      const file = f as File;

      if (fileTypes.indexOf(file.mimetype + '') === -1) {
        return res.status(422).send([{ message: 'File type is not supported' }]);
      }
      const fileStream = fs.createReadStream(file.filepath);
      const upload = new Upload({
        client: s3,
        params: {
          ACL: 'public-read',
          Bucket: S3_BUCKET,
          Key: `${Date.now().toString()}-${file.originalFilename}`,
          Body: fileStream,
          ContentType: file.mimetype + '',
        },
        tags: [],
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      uploadPromises.push(
        upload.done().then((data: CompleteMultipartUploadCommandOutput | void) => {
          req.body[fieldName] = `${CF_DOMAIN}/${data?.Key}`;
        }),
      );
    });
    await Promise.all(uploadPromises);
    next();
  });
};

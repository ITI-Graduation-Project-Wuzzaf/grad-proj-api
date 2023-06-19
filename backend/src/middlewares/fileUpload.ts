import { BadRequestError } from './../errors/BadRequestError';
import { NextFunction, Request, Response } from 'express';
import formidable, { File } from 'formidable';
import fs from 'fs';
import ImageKit from 'imagekit';
import { jsonParser } from '../utilities/jsonParser';

const { KIT_PUBLIC, KIT_PRIVATE, KIT_URL } = process.env;

const imagekit = new ImageKit({
  publicKey: KIT_PUBLIC + '',
  privateKey: KIT_PRIVATE + '',
  urlEndpoint: KIT_URL + '',
});

const fileTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const fileUpload = (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({ allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024, maxFiles: 2 }); //5mb max
  if (req.headers['content-type']?.split(';')[0] !== 'multipart/form-data') {
    throw new BadRequestError('Only multipart/form-data is allowed');
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(413).send([{ message: 'File size exceeds limit' }]);
    }
    console.log(files);

    req.body = fields;
    if (fields.skills) req.body.skills = jsonParser(req.body.skills);
    if (fields.links) req.body.links = jsonParser(req.body.links);

    // const uploadPromises: Promise<void>[] = [];
    Object.entries(files).forEach(([fieldName, f]) => {
      const file = f as File;

      if (fileTypes.indexOf(file.mimetype + '') === -1) {
        return res.status(422).send([{ message: 'File type is not supported' }]);
      }
      const fileStream = fs.createReadStream(file.filepath);
      const fileName = `${Date.now().toString()}-${file.originalFilename}`;
      imagekit.upload({
        file: fileStream,
        fileName,
        useUniqueFileName: false,
      });

      req.body[fieldName] = fileName.replace(/\s+/g, '_');
      // uploadPromises.push(
      //   imagekit.upload({
      //     file: fileStream,
      //     fileName: `${Date.now().toString()}-${file.originalFilename}`,
      //     useUniqueFileName: false,
      //   }),
      // );
    });
    // await Promise.all(uploadPromises);
    next();
  });
};

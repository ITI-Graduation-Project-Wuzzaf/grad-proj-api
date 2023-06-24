"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = void 0;
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const fileTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const { S3_KEY, S3_SECRET, S3_REGION, S3_BUCKET, CF_DOMAIN } = process.env;
const s3 = new client_s3_1.S3Client({
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_KEY + '',
        secretAccessKey: S3_SECRET + '',
    },
});
const fileUpload = (req, res, next) => {
    const form = (0, formidable_1.default)({ allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024, maxFiles: 2 }); //5mb max
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(413).send([{ message: 'File size exceeds limit' }]);
        }
        req.body = fields;
        const uploadPromises = [];
        Object.entries(files).forEach(([fieldName, f]) => {
            const file = f;
            if (fileTypes.indexOf(file.mimetype + '') === -1) {
                return res.status(422).send([{ message: 'File type is not supported' }]);
            }
            const fileStream = fs_1.default.createReadStream(file.filepath);
            const upload = new lib_storage_1.Upload({
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
            uploadPromises.push(upload.done().then((data) => {
                req.body[fieldName] = `${CF_DOMAIN}/${data === null || data === void 0 ? void 0 : data.Key}`;
            }));
        });
        yield Promise.all(uploadPromises);
        next();
    }));
};
exports.fileUpload = fileUpload;

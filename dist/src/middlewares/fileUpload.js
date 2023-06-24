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
const BadRequestError_1 = require("./../errors/BadRequestError");
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const imagekit_1 = __importDefault(require("imagekit"));
const jsonParser_1 = require("../utilities/jsonParser");
const { KIT_PUBLIC, KIT_PRIVATE, KIT_URL } = process.env;
const imagekit = new imagekit_1.default({
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
const fileUpload = (req, res, next) => {
    var _a;
    const form = (0, formidable_1.default)({ allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024, maxFiles: 2 }); //5mb max
    if (((_a = req.headers['content-type']) === null || _a === void 0 ? void 0 : _a.split(';')[0]) !== 'multipart/form-data') {
        throw new BadRequestError_1.BadRequestError('Only multipart/form-data is allowed');
    }
    form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(413).send([{ message: 'File size exceeds limit' }]);
        }
        req.body = fields;
        if (fields.skills)
            req.body.skills = (0, jsonParser_1.jsonParser)(req.body.skills);
        if (fields.links)
            req.body.links = (0, jsonParser_1.jsonParser)(req.body.links);
        // const uploadPromises: Promise<void>[] = [];
        Object.entries(files).forEach(([fieldName, f]) => {
            const file = f;
            if (fileTypes.indexOf(file.mimetype + '') === -1) {
                return res.status(422).send([{ message: 'File type is not supported' }]);
            }
            const fileStream = fs_1.default.createReadStream(file.filepath);
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
    }));
};
exports.fileUpload = fileUpload;

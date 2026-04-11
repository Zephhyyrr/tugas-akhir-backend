import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';

const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const IMAGE_MAX_SIZE = 5 * 1024 * 1024;
const VIDEO_MAX_SIZE = 100 * 1024 * 1024;

const imageMimeTypes = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/pjpeg',
    'image/x-png', 'image/webp', 'image/avif', 'image/heic',
    'image/gif', 'image/bmp', 'image/tiff', 'image/svg+xml',
    'image/vnd.microsoft.icon'
];

const videoMimeTypes = [
    'video/mp4', 'video/x-matroska', 'video/webm', 'video/avi',
    'video/mpeg', 'video/quicktime', 'video/x-msvideo',
    'video/x-flv', 'video/x-ms-wmv'
];

const extAllowed = [
    '.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic',
    '.gif', '.bmp', '.tiff', '.svg', '.ico',
    '.mp4', '.mkv', '.webm'
];

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype.toLowerCase();

        const isValidMime = imageMimeTypes.includes(mime) || videoMimeTypes.includes(mime);
        const isValidExt = extAllowed.includes(ext);

        if (isValidMime && isValidExt) {
            cb(null, true);
        } else {
            cb(new Error('File harus berupa gambar (jpg/jpeg/png/webp) atau video (mp4/mkv/webm)'));
        }
    },
    limits: {
        fileSize: VIDEO_MAX_SIZE,
    },
});

const isImage = (mimeType: string): boolean => imageMimeTypes.includes(mimeType.toLowerCase());
const isVideo = (mimeType: string): boolean => videoMimeTypes.includes(mimeType.toLowerCase());

export const validateUploadSizeByType = (req: Request, _res: Response, next: NextFunction): void => {
    const files = req.files
        ? Array.isArray(req.files)
            ? req.files
            : Object.values(req.files).flat()
        : req.file
            ? [req.file]
            : [];

    for (const file of files) {
        if (isImage(file.mimetype) && file.size > IMAGE_MAX_SIZE) {
            next(new Error('Ukuran gambar maksimal 5MB'));
            return;
        }

        if (isVideo(file.mimetype) && file.size > VIDEO_MAX_SIZE) {
            next(new Error('Ukuran video maksimal 100MB'));
            return;
        }
    }

    next();
};

export default upload;
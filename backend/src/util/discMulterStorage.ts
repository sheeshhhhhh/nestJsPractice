import * as multer from 'multer';
import * as crypto from 'crypto';

const diskMulterStorage = (destination: string) => {
  const diskStorage = multer.diskStorage({
    destination: (req, res, cb) => {
      return cb(null, destination);
    },
    filename: (req, file, cb) => {
      const fileId = crypto.randomBytes(10).toString('hex');
      return cb(null, `${fileId}_${file.originalname}`);
    },
  });

  return diskStorage;
};

export default diskMulterStorage;

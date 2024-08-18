import { diskStorage, StorageEngine, FileFilterCallback } from "multer";
import path from "path";

export const storage: StorageEngine = diskStorage({
  destination(req, file, cb) {
    cb(null, './upload')
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  },
})

// export function fileFilter(req, file: Express.Multer.File, cb: FileFilterCallback) {
//   const imgType = /jpeg|jpg|png/
//     const extName = imgType.test(path.extname(file.originalname).toLowerCase())
//     const mimeType = imgType.test(file.mimetype)

//     if(extName && mimeType) {
//       cb(null, true)
//     } else {
//       cb(new Error('Only accept images & types: jpeg, jpg or png'))
//     }
// } 
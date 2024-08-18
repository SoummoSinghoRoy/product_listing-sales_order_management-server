import * as fs from 'fs';

export function unsyncUploadedFile(uploadLocation: any): void {
  fs.unlink(uploadLocation, (err: any) => {
    if(err) throw err;
  })
}
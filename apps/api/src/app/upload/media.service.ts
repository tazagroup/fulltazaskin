import { Injectable, Req, Res } from '@nestjs/common';
import fs = require('fs');
const stream = require('stream')
let bufferStream = new stream.PassThrough();
let outbuffer = new stream.PassThrough();
@Injectable()
export class MediaService {
  constructor(
  ) {}
  getFileExtension(file) {
    let fileName = file.originalname;
    return fileName.split('.').pop();
  }
  getFileNameWithoutExtension(file) {
    return file.split('.').slice(0, -1).join('.');
  }

}

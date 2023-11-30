import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import fs = require('fs');
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpserveService } from './upserve.service';
export const editFileName = (req: any, file: any, callback: any) => {
  file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
  const filename = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = new Date().getTime();
  callback(null, `${filename}_${randomName}${fileExtName}`);
};
export const DeleteFile = (path: any) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    return true;
  } else {
    console.error(false);
    return false;
  }
};
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) { }
@Post('server')
    @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // const path = './dist/' + req.query.folder;
          const path = '/home/tazaspac/tazaskinclinic/images/' + req.query.folder;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            console.log('Folder created:', path);
          } else {
            console.log('Folder already exists:', path);
          }
          // const path = './dist/' + req.query.folder+'/assets';
          cb(null, path);
        },
        filename: editFileName,
      }),
    }),
  )
  async server(@UploadedFile() file) { 
      return await this.uploadService.upload(file);
  }
@Post('local')
    @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // const path = './dist/' + req.query.folder;
          const path = '/home/tazaspac/tazaskinclinic/images/' + req.query.folder;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
            console.log('Folder created:', path);
          } else {
            console.log('Folder already exists:', path);
          }
          // const path = './dist/' + req.query.folder+'/assets';
          cb(null, path);
        },
        filename: editFileName,
      }),
    }),
  )
  async serverlocal(@UploadedFile() file) { 
   // console.error(file);
    
    const originalPath = file.path;
    // Create a directory to save resized copies
    //const resizedDirectory = './uploads/resized/';
    if (!fs.existsSync(originalPath)) {
      fs.mkdirSync(originalPath, { recursive: true });
    }
    // await sharp(originalPath)
    //   .webp({ quality: 90 }) // Adjust quality as needed (0-100)
    //   .toFile(`${originalPath.replace(extname(originalPath), '.webp')}`);
    return await this.uploadService.uploadlocal(file);
  }
  @Get()
  findAll() {
    // const rootPath = process.cwd();
    // return rootPath;
    return this.uploadService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(id, updateUploadDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string,@Body() data: any) {
    return this.uploadService.remove(id,data);
  }
}

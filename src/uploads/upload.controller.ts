import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express'; // 👈 Import Response from express

@Controller('api/uploads')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file provided');
    console.log('file uploaded', { file });
    return {
      message: 'file uploaded successfully',
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
    };
  }

  // POST: ~/api/uploads/multiple-files
  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  public uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('no file provided');
    }

    console.log('Files uploaded', { files });
    return { message: 'Files uploaded successfully' };
  }

  @Get(':images')
  public showImages(@Param('images') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images' });
  }
}

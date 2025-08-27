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
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Response } from 'express'; // 👈 Import Response from express
import { SingleFileUploadDTO } from './dto/single-file.dto';
import { MultipleFilesUploadDTO } from './dto/file-upload.dto';

@Controller('api/uploads')
export class UploadController {
  // SINGLE file upload
  @Post()
  @UseInterceptors(FileInterceptor('file')) // Expects field name "file"
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SingleFileUploadDTO, // 👈 Use single file DTO
    description: 'Upload a single file',
  })
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file provided');
    return {
      message: 'file uploaded successfully',
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
    };
  }

  // MULTIPLE files upload
  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files')) // Expects field name "files"
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MultipleFilesUploadDTO, // 👈 Use multiple files DTO
    description: 'Upload multiple files at once',
  })
  public uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('no files provided');
    }
    return {
      message: 'Files uploaded successfully',
      count: files.length,
      filenames: files.map((file) => file.filename),
    };
  }

  @Get(':images')
  public showImages(@Param('images') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images' });
  }
}

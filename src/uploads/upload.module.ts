import { BadRequestException, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 21432345)}`;
          const fileName = `${prefix}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('unsupported file format'), false); // Fixed typo: 'forma' -> 'format'
        }
      },
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  ],
  controllers: [UploadController],
  providers: [],
  exports: [],
})
export class UploadModule {}

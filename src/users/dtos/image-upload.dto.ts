import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'Profile image file',
  })
  file: Express.Multer.File;
}

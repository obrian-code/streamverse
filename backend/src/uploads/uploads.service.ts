import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.resolve(this.configService.get<string>('upload.dest') || './uploads');
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      this.uploadDir,
      path.join(this.uploadDir, 'avatars'),
      path.join(this.uploadDir, 'posters'),
      path.join(this.uploadDir, 'backdrops'),
      path.join(this.uploadDir, 'thumbnails'),
      path.join(this.uploadDir, 'logos'),
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created upload directory: ${dir}`);
      }
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    subfolder: string = 'general',
  ): Promise<{ url: string; filename: string; path: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${uuidv4()}${ext}`;
    const targetDir = path.join(this.uploadDir, subfolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    const url = `/uploads/${subfolder}/${filename}`;

    return { url, filename, path: filePath };
  }

  async uploadAvatar(file: Express.Multer.File): Promise<{ url: string }> {
    const result = await this.uploadFile(file, 'avatars');
    return { url: result.url };
  }

  async uploadPoster(file: Express.Multer.File): Promise<{ url: string }> {
    const result = await this.uploadFile(file, 'posters');
    return { url: result.url };
  }

  async uploadBackdrop(file: Express.Multer.File): Promise<{ url: string }> {
    const result = await this.uploadFile(file, 'backdrops');
    return { url: result.url };
  }

  async uploadLogo(file: Express.Multer.File): Promise<{ url: string }> {
    const result = await this.uploadFile(file, 'logos');
    return { url: result.url };
  }

  async uploadThumbnail(file: Express.Multer.File): Promise<{ url: string }> {
    const result = await this.uploadFile(file, 'thumbnails');
    return { url: result.url };
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const relativePath = fileUrl.replace('/uploads/', '');
    const filePath = path.join(this.uploadDir, relativePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.log(`Deleted file: ${filePath}`);
    }
  }

  getMulterOptions() {
    const maxSize = this.configService.get<number>('upload.maxFileSize') || 10485760;

    return {
      limits: {
        fileSize: maxSize,
      },
      fileFilter: (req: any, file: Express.Multer.File, cb: Function) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/svg+xml',
          'video/mp4',
          'video/m3u8',
          'application/x-mpegURL',
          'video/quicktime',
        ];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`File type ${file.mimetype} not allowed`), false);
        }
      },
    };
  }
}

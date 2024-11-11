// minio.service.ts

import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private readonly client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'your-minio-endpoint',
      port: 9000,
      useSSL: false, // Используйте true, если у вас HTTPS
      accessKey: 'your-access-key',
      secretKey: 'your-secret-key',
    });
  }

  async uploadFile(
    bucketName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileStream = file.buffer;
    await this.client.putObject(bucketName, fileName, fileStream);
    const fileUrl = `http://your-minio-endpoint:9000/${bucketName}/${fileName}`;
    return fileUrl;
  }
}

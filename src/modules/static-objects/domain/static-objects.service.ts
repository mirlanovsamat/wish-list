import { Readable } from 'stream';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client as MinioClient } from 'minio';
import { v4 as uuid } from 'uuid';
import { getS3Config } from 'src/common/configs/s3.config';
import { StaticObjectsRepository } from '../data/static-objects.repository';
import { StaticObjectEntity } from 'src/common/entities/static-object.entity';
import { MultipartFile } from '@fastify/multipart';

const s3Config = getS3Config();

@Injectable()
export class StaticObjectService {
  private readonly logger = new Logger(StaticObjectService.name);

  constructor(
    private readonly staticObjectRepository: StaticObjectsRepository,
    @Inject(MINIO_CONNECTION) private readonly minioClient: MinioClient,
  ) {}

  async uploadAndSaveOneIcon(
    imageFile: MultipartFile,
    { mimeType }: { mimeType?: string } = {},
  ) {
    let imageBuffer = null;

    try {
      imageBuffer = await imageFile.toBuffer();
    } catch (err) {
      throw new BadRequestException('File size limit reached');
    }

    try {
      return this.uploadSaveAndReturnOne(imageBuffer, {
        prefix: 'images/',
        mimeType,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error uploading files ${error}`);
    }
  }

  async uploadSaveAndReturnOne(
    data: Readable,
    { prefix, mimeType }: { prefix: string; mimeType?: string } = {
      prefix: '',
      mimeType: '',
    },
  ): Promise<StaticObjectEntity> {
    const fileExt = mimeType ? `.${mimeType.split('/')[1]}` : '';
    const objectKey = `${prefix}${uuid()}${fileExt}`;

    await this.minioClient.putObject(
      s3Config.staticObject.bucketName,
      objectKey,
      data,
    );
    const url = this.generateObjectUrl(objectKey);
    const staticObject =
      await this.staticObjectRepository.insertAndFetchOne(url);

    return staticObject;
  }

  async getOneById(id: number): Promise<StaticObjectEntity> {
    return this.staticObjectRepository.getOneById(id);
  }

  private generateObjectUrl(objectKey: string): string {
    const { staticObject, s3 } = s3Config;
    const protocol = s3.useSSL ? 'https' : 'http';
    const url = `${protocol}://${s3.endPoint}:${s3.port}/${staticObject.bucketName}/${objectKey}`;
    return url;
  }
}

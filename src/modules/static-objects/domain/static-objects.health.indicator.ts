import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client as MinioClient } from 'minio';

@Injectable()
export class StaticObjectsHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(MINIO_CONNECTION) private readonly minioClient: MinioClient,
  ) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const isConnected = Boolean(await this.minioClient.listBuckets());

      return this.getStatus('MINIO_CONNECTION_CHECK', isConnected);
    } catch (error) {
      throw new HealthCheckError('MINIO or AWS S3 Connection check failed', {
        error,
      });
    }
  }
}

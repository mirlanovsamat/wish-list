import { Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getS3Config } from 'src/common/configs/s3.config';
import { StaticObjectService } from './domain/static-objects.service';
import { StaticObjectsRepository } from './data/static-objects.repository';
import { StaticObjectsHealthIndicator } from './domain/static-objects.health.indicator';
import { StaticObjectController } from './presenter/static-object.controller';
import { StaticObjectEntity } from 'src/common/entities/static-object.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaticObjectEntity]),
    NestMinioModule.registerAsync({
      isGlobal: false,
      useFactory: () => {
        const config = getS3Config();

        return config.s3;
      },
    }),
  ],
  providers: [
    StaticObjectService,
    StaticObjectsRepository,
    StaticObjectsHealthIndicator,
  ],
  controllers: [StaticObjectController],
  exports: [
    StaticObjectService,
    StaticObjectsHealthIndicator,
    StaticObjectsRepository,
  ],
})
export class StaticObjectsModule {}

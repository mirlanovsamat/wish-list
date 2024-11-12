import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllStaticObjectsQuery } from '../presenter/queries/get-all-static-objects.query';
import { StaticObjectEntity } from 'src/common/entities/static-object.entity';

@Injectable()
export class StaticObjectsRepository {
  constructor(
    @InjectRepository(StaticObjectEntity)
    private readonly staticObjectRepository: Repository<StaticObjectEntity>,
  ) {}

  getAll({ page, perPage }: GetAllStaticObjectsQuery) {
    const queryBuilder = this.staticObjectRepository
      .createQueryBuilder('staticObject')
      .skip((page - 1) * perPage)
      .take(perPage);

    return queryBuilder.getManyAndCount();
  }

  insertAndFetchOne(url: string): Promise<StaticObjectEntity> {
    const staticObject = this.staticObjectRepository.create({ url });
    return this.staticObjectRepository.save(staticObject);
  }

  getOneById(id: number): Promise<StaticObjectEntity | null> {
    return this.staticObjectRepository.findOne({ where: { id: id } });
  }
}

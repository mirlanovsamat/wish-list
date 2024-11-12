import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { WishEntity } from './wish.entity';

@Entity('static_objects')
export class StaticObjectEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'url',
    type: 'text',
  })
  url: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: 'now()',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: 'now()',
  })
  updatedAt: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: string | null;

  @OneToOne(() => UserEntity, (user) => user.staticObject, {
    onDelete: 'CASCADE',
  })
  user?: UserEntity;

  @OneToOne(() => WishEntity, (wish) => wish.staticObject, {
    onDelete: 'CASCADE',
  })
  wish?: UserEntity;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { StaticObjectEntity } from './static-object.entity';

@Entity('wishes')
export class WishEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'title',
    type: 'text',
  })
  title: string;

  @Column({
    name: 'user_id',
    type: 'bigint',
  })
  userId: number;

  @Column({
    name: 'static_object_id',
    type: 'bigint',
    nullable: true,
  })
  staticObjectId: number;

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

  @ManyToOne(() => UserEntity, (user) => user.wishes)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToOne(() => StaticObjectEntity, (staticObject) => staticObject.wish)
  @JoinColumn({ name: 'static_object_id' })
  staticObject?: StaticObjectEntity;
}

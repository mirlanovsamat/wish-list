import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { WishEntity } from './wish.entity';
import { StaticObjectEntity } from './static-object.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id: number;

  @Column({
    name: 'username',
    type: 'text',
    nullable: true,
  })
  username: string | null;

  @Column({
    name: 'email',
    type: 'text',
    unique: true,
  })
  email: string | null;

  @Column({
    name: 'password',
    type: 'text',
    nullable: true,
  })
  password: string | null;

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

  @OneToMany(() => WishEntity, (wish) => wish.user)
  wishes: WishEntity[];

  @OneToOne(() => StaticObjectEntity, (staticObject) => staticObject.user)
  @JoinColumn({ name: 'static_object_id' })
  staticObject?: StaticObjectEntity;
}

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
  ManyToMany,
  JoinTable,
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
    name: 'name',
    type: 'text',
    nullable: true,
  })
  name: string | null;

  @Column({
    name: 'family_name',
    type: 'text',
    nullable: true,
  })
  familyName: string | null;

  @Column({
    name: 'gender',
    type: 'text',
    nullable: true,
  })
  gender: string | null;

  @Column({
    name: 'birth_day',
    type: 'timestamptz',
    nullable: true,
  })
  birthDay: string | null;

  @Column({
    name: 'location',
    type: 'text',
    nullable: true,
  })
  location: string | null;

  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  bio: string | null;

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
  staticObject: StaticObjectEntity;

  @ManyToMany(() => UserEntity, (user) => user.following)
  @JoinTable({
    name: 'user_followers',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'follower_id',
      referencedColumnName: 'id',
    },
  })
  followers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.followers)
  following: UserEntity[];
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Wish } from './wish.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(() => Wish, (wish) => wish.user)
  wishes: Wish[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Favorite } from '../../favorites/entities/favorite.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 100 })
  name: string;

  @ApiProperty()
  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude()
  @Column({ length: 255, select: false })
  password: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, length: 500 })
  refreshToken: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, type: 'timestamp' })
  resetPasswordToken: Date;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true, length: 255 })
  resetPasswordCode: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}

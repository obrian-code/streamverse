import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum FavoriteContentType {
  MOVIE = 'movie',
  SERIES = 'series',
  CHANNEL = 'channel',
}

@Entity('favorites')
@Unique(['userId', 'contentId', 'contentType'])
export class Favorite {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ApiProperty()
  @Column()
  contentId: string;

  @ApiProperty({ enum: FavoriteContentType })
  @Column({ type: 'enum', enum: FavoriteContentType })
  contentType: FavoriteContentType;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}

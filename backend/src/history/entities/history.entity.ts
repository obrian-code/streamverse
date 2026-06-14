import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum HistoryContentType {
  MOVIE = 'movie',
  SERIES = 'series',
  EPISODE = 'episode',
}

@Entity('history')
export class History {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty()
  @Column()
  contentId: string;

  @ApiProperty({ enum: HistoryContentType })
  @Column({ type: 'enum', enum: HistoryContentType })
  contentType: HistoryContentType;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  seasonNumber: number;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  episodeNumber: number;

  @ApiProperty()
  @Column({ default: 0 })
  progress: number;

  @ApiProperty()
  @Column({ default: 0 })
  duration: number;

  @ApiProperty()
  @Column({ default: 0 })
  resumedAt: number;

  @ApiProperty()
  @Column({ default: false })
  completed: boolean;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: true })
  posterUrl: string;

  @ApiProperty()
  @CreateDateColumn()
  watchedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

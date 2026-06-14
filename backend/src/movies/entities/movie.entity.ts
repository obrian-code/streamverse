import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum MovieStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

@Entity('movies')
export class Movie {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 255 })
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  poster: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  backdrop: string;

  @ApiProperty()
  @Column({ length: 100 })
  category: string;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  duration: number;

  @ApiProperty({ nullable: true })
  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @ApiProperty({ nullable: true })
  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true, default: 0 })
  rating: number;

  @ApiProperty({ enum: MovieStatus })
  @Column({ type: 'enum', enum: MovieStatus, default: MovieStatus.PUBLISHED })
  status: MovieStatus;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  videoUrl: string;

  @ApiProperty({ default: 0 })
  @Column({ type: 'int', default: 0 })
  views: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Episode } from './episode.entity';

export enum SeriesStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

@Entity('series')
export class Series {
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

  @ApiProperty({ nullable: true })
  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true, default: 0 })
  rating: number;

  @ApiProperty({ enum: SeriesStatus })
  @Column({ type: 'enum', enum: SeriesStatus, default: SeriesStatus.PUBLISHED })
  status: SeriesStatus;

  @ApiProperty({ default: 0 })
  @Column({ type: 'int', default: 0 })
  views: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Episode, (episode) => episode.series, {
    cascade: true,
    eager: false,
  })
  episodes: Episode[];
}

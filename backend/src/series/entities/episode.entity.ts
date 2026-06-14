import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Series } from './series.entity';

@Entity('episodes')
export class Episode {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  seriesId: string;

  @ApiProperty()
  @Column({ type: 'int' })
  season: number;

  @ApiProperty()
  @Column({ type: 'int' })
  episode: number;

  @ApiProperty()
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column({ length: 500 })
  videoUrl: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'int', nullable: true })
  duration: number;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Series, (series) => series.episodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seriesId' })
  series: Series;
}

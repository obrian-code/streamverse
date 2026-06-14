import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ChannelStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
}

@Entity('channels')
export class Channel {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ nullable: true })
  logo: string;

  @ApiProperty()
  @Column({ length: 100 })
  category: string;

  @ApiProperty()
  @Column({ length: 500 })
  streamUrl: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 100, nullable: true })
  country: string;

  @ApiProperty({ enum: ChannelStatus })
  @Column({ type: 'enum', enum: ChannelStatus, default: ChannelStatus.ACTIVE })
  status: ChannelStatus;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  epgData: Record<string, any>;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}

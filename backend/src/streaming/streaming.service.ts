import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Channel } from '../channels/entities/channel.entity';

interface StreamSession {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'series' | 'channel' | 'episode';
  quality: string;
  startedAt: Date;
  lastHeartbeat: Date;
  clientId: string;
}

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(StreamingService.name);
  private activeSessions: Map<string, StreamSession> = new Map();

  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    private configService: ConfigService,
  ) {}

  async getStreamUrl(contentType: string, contentId: string): Promise<any> {
    switch (contentType) {
      case 'channel': {
        const channel = await this.channelsRepository.findOne({
          where: { id: contentId },
        });
        if (!channel) {
          throw new NotFoundException('Channel not found');
        }
        return {
          streamUrl: channel.streamUrl,
          type: 'hls',
          channel: channel,
        };
      }
      case 'movie':
        return {
          streamUrl: `${this.configService.get('streaming.serverUrl')}/api/v1/streaming/movie/${contentId}/master.m3u8`,
          type: 'hls',
        };
      case 'episode':
        return {
          streamUrl: `${this.configService.get('streaming.serverUrl')}/api/v1/streaming/episode/${contentId}/master.m3u8`,
          type: 'hls',
        };
      default:
        throw new NotFoundException('Invalid content type');
    }
  }

  createSession(
    userId: string,
    contentId: string,
    contentType: StreamSession['contentType'],
    quality: string,
    clientId: string,
  ): StreamSession {
    const session: StreamSession = {
      id: `${userId}_${contentId}_${Date.now()}`,
      userId,
      contentId,
      contentType,
      quality,
      startedAt: new Date(),
      lastHeartbeat: new Date(),
      clientId,
    };

    this.activeSessions.set(session.id, session);
    this.logger.log(`Stream session created: ${session.id}`);

    return session;
  }

  updateHeartbeat(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (!session) return false;

    session.lastHeartbeat = new Date();
    return true;
  }

  endSession(sessionId: string): boolean {
    const deleted = this.activeSessions.delete(sessionId);
    if (deleted) {
      this.logger.log(`Stream session ended: ${sessionId}`);
    }
    return deleted;
  }

  getActiveSessions(userId?: string): StreamSession[] {
    if (userId) {
      return Array.from(this.activeSessions.values()).filter(
        (s) => s.userId === userId,
      );
    }
    return Array.from(this.activeSessions.values());
  }

  getSessionStats() {
    return {
      activeSessions: this.activeSessions.size,
      uniqueUsers: new Set(
        Array.from(this.activeSessions.values()).map((s) => s.userId),
      ).size,
    };
  }

  cleanupStaleSessions(maxAgeMs: number = 300000) {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of this.activeSessions) {
      if (now - session.lastHeartbeat.getTime() > maxAgeMs) {
        this.activeSessions.delete(id);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.log(`Cleaned ${cleaned} stale sessions`);
    }

    return cleaned;
  }

  getAvailableQualities(): string[] {
    return ['240p', '360p', '480p', '720p', '1080p', '4K'];
  }
}

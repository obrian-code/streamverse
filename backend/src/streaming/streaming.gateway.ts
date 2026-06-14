import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  namespace: '/streaming',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class StreamingGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(StreamingGateway.name);
  private connectedClients: Map<string, { userId: string; socketId: string }> =
    new Map();

  constructor(
    private streamingService: StreamingService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('Streaming WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;

      if (!token) {
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.accessSecret'),
      });

      this.connectedClients.set(client.id, {
        userId: payload.sub,
        socketId: client.id,
      });

      client.data.user = payload;

      client.emit('connected', {
        message: 'Connected to StreamVerse streaming server',
        clientId: client.id,
      });

      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (error) {
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const clientInfo = this.connectedClients.get(client.id);

    if (clientInfo) {
      this.streamingService.getActiveSessions(clientInfo.userId).forEach((session) => {
        if (session.clientId === client.id) {
          this.streamingService.endSession(session.id);
          this.server.emit('sessionEnded', {
            sessionId: session.id,
            userId: clientInfo.userId,
          });
        }
      });

      this.connectedClients.delete(client.id);
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('startStream')
  async handleStartStream(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { contentId: string; contentType: string; quality?: string },
  ) {
    try {
      const quality = data.quality || '720p';
      const userId = client.data.user.sub;

      const streamInfo = await this.streamingService.getStreamUrl(
        data.contentType,
        data.contentId,
      );

      const session = this.streamingService.createSession(
        userId,
        data.contentId,
        data.contentType as any,
        quality,
        client.id,
      );

      client.emit('streamStarted', {
        sessionId: session.id,
        streamUrl: streamInfo.streamUrl,
        type: streamInfo.type,
        quality,
        startedAt: session.startedAt,
      });

      client.join(`session:${session.id}`);
      client.join(`user:${userId}`);

      this.server.emit('streamActivity', {
        type: 'started',
        userId,
        contentId: data.contentId,
        contentType: data.contentType,
      });

      this.logger.log(
        `Stream started: ${data.contentType}/${data.contentId} by user ${userId}`,
      );
    } catch (error) {
      client.emit('error', {
        message: error.message || 'Failed to start stream',
      });
    }
  }

  @SubscribeMessage('heartbeat')
  handleHeartbeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    const updated = this.streamingService.updateHeartbeat(data.sessionId);
    if (!updated) {
      client.emit('error', { message: 'Session not found or expired' });
      return;
    }
    client.emit('heartbeatAck', { timestamp: new Date() });
  }

  @SubscribeMessage('endStream')
  handleEndStream(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string },
  ) {
    const ended = this.streamingService.endSession(data.sessionId);

    if (ended) {
      client.leave(`session:${data.sessionId}`);
      this.server.emit('streamActivity', {
        type: 'ended',
        sessionId: data.sessionId,
      });
      client.emit('streamEnded', { sessionId: data.sessionId });
    }
  }

  @SubscribeMessage('changeQuality')
  handleChangeQuality(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sessionId: string; quality: string },
  ) {
    const session = this.streamingService
      .getActiveSessions()
      .find((s) => s.id === data.sessionId);

    if (!session) {
      client.emit('error', { message: 'Session not found' });
      return;
    }

    client.emit('qualityChanged', {
      sessionId: data.sessionId,
      quality: data.quality,
    });
  }

  @SubscribeMessage('getSessionStats')
  handleGetSessionStats(@ConnectedSocket() client: Socket) {
    const stats = this.streamingService.getSessionStats();
    client.emit('sessionStats', stats);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: new Date() });
  }
}

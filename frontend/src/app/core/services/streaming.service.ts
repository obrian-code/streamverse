import { Injectable, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { APP_CONFIG, AppConfig } from '../../app.config';

export interface StreamMessage {
  type: 'connected' | 'disconnected' | 'error' | 'stream_status' | 'epg_update' | 'channel_change';
  payload?: any;
  channelId?: string;
  status?: 'playing' | 'paused' | 'buffering' | 'ended';
  timestamp: string;
}

@Injectable()
export class StreamingService implements OnDestroy {
  private wsSubject: WebSocketSubject<StreamMessage> | null = null;
  private connectionState = new BehaviorSubject<'disconnected' | 'connecting' | 'connected'>('disconnected');
  private messageSubject = new Subject<StreamMessage>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  readonly connectionState$ = this.connectionState.asObservable();
  readonly messages$ = this.messageSubject.asObservable();

  constructor(@Inject(APP_CONFIG) private config: AppConfig) {}

  connect(): void {
    if (this.wsSubject && this.connectionState.value === 'connected') return;

    this.connectionState.next('connecting');

    try {
      this.wsSubject = webSocket<StreamMessage>({
        url: this.config.wsUrl,
        deserializer: msg => JSON.parse(msg.data),
        serializer: msg => JSON.stringify(msg),
        openObserver: {
          next: () => {
            this.connectionState.next('connected');
            this.reconnectAttempts = 0;
          }
        },
        closeObserver: {
          next: () => {
            this.connectionState.next('disconnected');
            this.attemptReconnect();
          }
        }
      });

      this.wsSubject.subscribe({
        next: (message) => this.messageSubject.next(message),
        error: () => {
          this.connectionState.next('disconnected');
          this.attemptReconnect();
        }
      });
    } catch (error) {
      this.connectionState.next('disconnected');
      console.error('[StreamingService] WebSocket connection error:', error);
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.wsSubject?.complete();
    this.wsSubject = null;
    this.connectionState.next('disconnected');
    this.reconnectAttempts = 0;
  }

  sendMessage(message: Omit<StreamMessage, 'timestamp'>): void {
    if (!this.wsSubject || this.connectionState.value !== 'connected') {
      console.warn('[StreamingService] Cannot send message: not connected');
      return;
    }

    this.wsSubject.next({
      ...message,
      timestamp: new Date().toISOString()
    } as StreamMessage);
  }

  joinChannel(channelId: string): void {
    this.sendMessage({
      type: 'channel_change',
      channelId
    });
  }

  leaveChannel(channelId: string): void {
    this.sendMessage({
      type: 'channel_change',
      channelId: '',
      payload: { leaveChannel: channelId }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[StreamingService] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);

    this.reconnectTimer = setTimeout(() => {
      console.log(`[StreamingService] Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.connect();
    }, delay);
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.messageSubject.complete();
    this.connectionState.complete();
  }
}

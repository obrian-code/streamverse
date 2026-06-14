import { InjectionToken } from '@angular/core';

export interface AppConfig {
  appName: string;
  apiUrl: string;
  streamingUrl: string;
  wsUrl: string;
  storagePrefix: string;
  tokenKey: string;
  refreshTokenKey: string;
  pageSize: number;
  debounceTime: number;
  maxRetries: number;
  sessionTimeout: number;
  refreshThreshold: number;
  availableLanguages: string[];
  defaultLanguage: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

function isLocalDev(): boolean {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
}

function getBaseUrl(): string {
  return isLocalDev() ? 'http://localhost:3000/api/v1' : '/api/v1';
}

function getWsUrl(): string {
  const proto = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
  return isLocalDev() ? 'ws://localhost:3000/ws' : `${proto}://${window.location.host}/ws`;
}

function getStreamingUrl(): string {
  return isLocalDev() ? 'http://localhost:3000/stream' : '/stream';
}

export const appConfig: AppConfig = {
  appName: 'StreamVerse',
  apiUrl: getBaseUrl(),
  streamingUrl: getStreamingUrl(),
  wsUrl: getWsUrl(),
  storagePrefix: 'streamverse_',
  tokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  pageSize: 20,
  debounceTime: 400,
  maxRetries: 3,
  sessionTimeout: 3600000,
  refreshThreshold: 300000,
  availableLanguages: ['en', 'es'],
  defaultLanguage: 'en'
};

export const APP_CONFIG_PROVIDER = {
  provide: APP_CONFIG,
  useValue: appConfig
};

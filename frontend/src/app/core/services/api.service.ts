import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, retry, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from '../../app.config';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  status: 'success' | 'error';
}

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  get<T>(endpoint: string, params?: HttpParams | Record<string, any>): Observable<ApiResponse<T>> {
    const httpParams = params instanceof HttpParams
      ? params
      : params ? this.buildParams(params) : undefined;

    return this.http.get<ApiResponse<T>>(`${this.config.apiUrl}/${endpoint}`, { params: httpParams }).pipe(
      retryWhen(errors => errors.pipe(
        mergeMap((error: HttpErrorResponse, index: number) => {
          if (index >= this.config.maxRetries || error.status < 500) {
            return throwError(() => error);
          }
          return timer(Math.pow(2, index) * 1000);
        })
      )),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.config.apiUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.config.apiUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(endpoint: string, body: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.config.apiUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.config.apiUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  upload<T>(endpoint: string, formData: FormData): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.config.apiUrl}/${endpoint}`, formData, {
      headers: new HttpHeaders({ 'Accept': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message || `Server error: ${error.status}`;
    }

    console.error(`[API Error] ${error.status}: ${errorMessage}`, error);
    return throwError(() => ({ status: error.status, message: errorMessage }));
  }
}

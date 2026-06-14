import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'sv-login',
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <a routerLink="/" class="text-4xl font-extrabold gradient-text">StreamVerse</a>
          <h1 class="mt-6 text-2xl font-bold text-white">Iniciar sesión</h1>
          <p class="mt-2 text-surface-400">Accede a tu cuenta para continuar</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="card p-6 space-y-4">
          @if (error()) {
            <div class="p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm">
              {{ error() }}
            </div>
          }

          <div class="space-y-1.5">
            <label class="text-sm text-surface-400">Email</label>
            <input formControlName="email" type="email" placeholder="tu@email.com"
                   class="input-field" autocomplete="email" />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <p class="text-xs text-accent">Ingresa un email válido</p>
            }
          </div>

          <div class="space-y-1.5">
            <label class="text-sm text-surface-400">Contraseña</label>
            <input formControlName="password" type="password" placeholder="••••••••"
                   class="input-field" autocomplete="current-password" />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="text-xs text-accent">La contraseña es requerida</p>
            }
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-surface-400 cursor-pointer">
              <input type="checkbox" class="rounded border-surface-600 bg-surface-800 accent-accent" />
              Recordarme
            </label>
            <a href="#" class="text-primary-400 hover:text-primary-300 transition-colors">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" class="btn-primary w-full py-3"
                  [disabled]="loginForm.invalid || loading()">
            @if (loading()) {
              <mat-spinner diameter="20" strokeWidth="3" class="mx-auto"></mat-spinner>
            } @else {
              Iniciar sesión
            }
          </button>

          <p class="text-center text-sm text-surface-400 pt-2">
            ¿No tienes cuenta?
            <a routerLink="/auth/register" class="text-primary-400 hover:text-primary-300 font-medium">Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParams['redirect'] || '/';
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Credenciales inválidas');
      }
    });
  }
}

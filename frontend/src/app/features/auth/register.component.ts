import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../core/services/auth.service';

@Component({
  selector: 'sv-register',
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-md space-y-8">
        <div class="text-center">
          <a routerLink="/" class="text-4xl font-extrabold gradient-text">StreamVerse</a>
          <h1 class="mt-6 text-2xl font-bold text-white">Crear cuenta</h1>
          <p class="mt-2 text-surface-400">Regístrate para disfrutar de todo el contenido</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="card p-6 space-y-4">
          @if (error()) {
            <div class="p-3 bg-accent/10 border border-accent/30 rounded-lg text-accent text-sm">
              {{ error() }}
            </div>
          }

          <div class="space-y-1.5">
            <label class="text-sm text-surface-400">Nombre de usuario</label>
            <input formControlName="username" placeholder="usuario123"
                   class="input-field" autocomplete="username" />
            @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
              <p class="text-xs text-accent">Mínimo 3 caracteres</p>
            }
          </div>

          <div class="space-y-1.5">
            <label class="text-sm text-surface-400">Email</label>
            <input formControlName="email" type="email" placeholder="tu@email.com"
                   class="input-field" autocomplete="email" />
            @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
              <p class="text-xs text-accent">Ingresa un email válido</p>
            }
          </div>

          <div class="space-y-1.5">
            <label class="text-sm text-surface-400">Contraseña</label>
            <input formControlName="password" type="password" placeholder="••••••••"
                   class="input-field" autocomplete="new-password" />
            @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
              <p class="text-xs text-accent">Mínimo 6 caracteres</p>
            }
          </div>

          <div class="space-y-1.5">
            <label class="text-sm text-surface-400">Confirmar contraseña</label>
            <input formControlName="confirmPassword" type="password" placeholder="••••••••"
                   class="input-field" autocomplete="new-password" />
            @if (registerForm.hasError('mismatch') && registerForm.get('confirmPassword')?.touched) {
              <p class="text-xs text-accent">Las contraseñas no coinciden</p>
            }
          </div>

          <div class="flex items-start gap-2 text-sm text-surface-400">
            <input type="checkbox" formControlName="acceptTerms"
                   class="mt-0.5 rounded border-surface-600 bg-surface-800 accent-accent" />
            <span>Acepto los <a href="#" class="text-primary-400 hover:text-primary-300">términos y condiciones</a> y la
                  <a href="#" class="text-primary-400 hover:text-primary-300">política de privacidad</a></span>
          </div>

          <button type="submit" class="btn-primary w-full py-3"
                  [disabled]="registerForm.invalid || loading()">
            @if (loading()) {
              <mat-spinner diameter="20" strokeWidth="3" class="mx-auto"></mat-spinner>
            } @else {
              Crear cuenta
            }
          </button>

          <p class="text-center text-sm text-surface-400 pt-2">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" class="text-primary-400 hover:text-primary-300 font-medium">Inicia sesión</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const data: RegisterRequest = {
      email: this.registerForm.get('email')?.value,
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      confirmPassword: this.registerForm.get('confirmPassword')?.value
    };

    this.auth.register(data).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Error al registrarse');
      }
    });
  }
}

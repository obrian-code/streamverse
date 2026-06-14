import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User, UserPreferences } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'sv-profile',
  template: `
    <div class="content-container py-8 max-w-3xl mx-auto space-y-8">
      <div class="space-y-2">
        <h1 class="text-3xl md:text-4xl font-bold text-white">Mi Perfil</h1>
        <p class="text-surface-400">Administra tu cuenta y preferencias</p>
      </div>

      @if (auth.currentUser(); as user) {
        <div class="card p-6 space-y-6">
          <div class="flex items-center gap-6">
            <div class="relative">
              <div class="w-24 h-24 rounded-full overflow-hidden bg-primary-600 flex items-center justify-center">
                @if (user.avatar) {
                  <img [src]="user.avatar" alt="Avatar" class="w-full h-full object-cover" />
                } @else {
                  <mat-icon class="text-white text-4xl">person</mat-icon>
                }
              </div>
              <button class="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center
                             hover:bg-accent-light transition-colors shadow-lg"
                      matTooltip="Cambiar foto">
                <mat-icon class="text-white text-sm">camera_alt</mat-icon>
              </button>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">{{ user.username }}</h2>
              <p class="text-surface-400">{{ user.email }}</p>
              <span class="inline-block px-2 py-0.5 mt-1 bg-primary-600/20 text-primary-400 text-xs rounded-full">
                {{ user.role === 'admin' ? 'Administrador' : 'Usuario' }}
              </span>
            </div>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="card p-6 space-y-4">
          <h3 class="text-lg font-semibold text-white">Información personal</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-sm text-surface-400">Nombre de usuario</label>
              <input formControlName="username" class="input-field" />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm text-surface-400">Email</label>
              <input formControlName="email" type="email" class="input-field" />
            </div>
          </div>

          <button type="submit" class="btn-primary" [disabled]="saving()">
            {{ saving() ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </form>

        <div class="card p-6 space-y-4">
          <h3 class="text-lg font-semibold text-white">Preferencias</h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-white text-sm">Reproducción automática</p>
                <p class="text-surface-400 text-xs">Reproducir el siguiente episodio automáticamente</p>
              </div>
              <button (click)="togglePreference('autoplay')"
                      class="w-12 h-7 rounded-full transition-colors relative"
                      [class.bg-accent]="preferences().autoplay"
                      [class.bg-surface-700]="!preferences().autoplay">
                <div class="w-5 h-5 bg-white rounded-full absolute top-1 transition-transform"
                     [class.translate-x-6]="preferences().autoplay"
                     [class.translate-x-1]="!preferences().autoplay">
                </div>
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="text-white text-sm">Subtítulos</p>
                <p class="text-surface-400 text-xs">Mostrar subtítulos por defecto</p>
              </div>
              <button (click)="togglePreference('subtitles')"
                      class="w-12 h-7 rounded-full transition-colors relative"
                      [class.bg-accent]="preferences().subtitles"
                      [class.bg-surface-700]="!preferences().subtitles">
                <div class="w-5 h-5 bg-white rounded-full absolute top-1 transition-transform"
                     [class.translate-x-6]="preferences().subtitles"
                     [class.translate-x-1]="!preferences().subtitles">
                </div>
              </button>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm text-surface-400">Idioma de subtítulos</label>
              <select [(ngModel)]="preferences().subtitleLanguage"
                      (ngModelChange)="updatePreferences()"
                      class="input-field text-sm">
                <option value="es">Español</option>
                <option value="en">Inglés</option>
                <option value="fr">Francés</option>
                <option value="pt">Portugués</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="text-sm text-surface-400">Calidad de video predeterminada</label>
              <select [(ngModel)]="preferences().quality"
                      (ngModelChange)="updatePreferences()"
                      class="input-field text-sm">
                <option value="auto">Automática</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `]
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  profileForm!: FormGroup;
  saving = signal(false);
  preferences = signal<UserPreferences>({
    language: 'es',
    autoplay: true,
    subtitles: false,
    subtitleLanguage: 'es',
    quality: 'auto',
    matureContent: false
  });

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [this.auth.currentUser()?.username || '', Validators.required],
      email: [this.auth.currentUser()?.email || '', [Validators.required, Validators.email]]
    });

    const prefs = this.auth.currentUser()?.preferences;
    if (prefs) {
      this.preferences.set({ ...this.preferences(), ...prefs });
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    this.saving.set(true);
    this.auth.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success('Perfil actualizado correctamente');
      },
      error: () => this.saving.set(false)
    });
  }

  togglePreference(key: keyof UserPreferences): void {
    const current = this.preferences();
    const updated = { ...current, [key]: !current[key as keyof typeof current] as boolean };
    this.preferences.set(updated as UserPreferences);
    this.updatePreferences();
  }

  updatePreferences(): void {
    this.auth.updatePreferences(this.preferences()).subscribe();
  }
}

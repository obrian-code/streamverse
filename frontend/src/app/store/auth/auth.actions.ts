import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { User, LoginRequest, RegisterRequest, AuthTokens } from '../../core/services/auth.service';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ user: User; tokens: AuthTokens }>(),
    'Login Failure': props<{ error: string }>(),

    'Register': props<{ data: RegisterRequest }>(),
    'Register Success': props<{ user: User; tokens: AuthTokens }>(),
    'Register Failure': props<{ error: string }>(),

    'Logout': emptyProps(),
    'Logout Complete': emptyProps(),

    'Load User': emptyProps(),
    'Load User Success': props<{ user: User }>(),
    'Load User Failure': props<{ error: string }>(),

    'Update Profile': props<{ data: Partial<User> }>(),
    'Update Profile Success': props<{ user: User }>(),
    'Update Profile Failure': props<{ error: string }>(),

    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ tokens: AuthTokens }>(),
    'Refresh Token Failure': props<{ error: string }>(),
  }
});

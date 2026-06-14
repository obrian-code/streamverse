import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../../core/services/auth.service';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),

  on(AuthActions.logoutComplete, () => ({
    ...initialAuthState
  })),

  on(AuthActions.loadUser, (state) => ({
    ...state,
    loading: true
  })),

  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false
  })),

  on(AuthActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user
  }))
);

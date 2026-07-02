import { Injectable, signal } from '@angular/core';
import { supabase } from './supabase.client';

export type AuthUser = {
  id: string;
  email: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AuthUser | null>(null);
  readonly isLoading = signal(true);

  readonly isLoggedIn = () => this.user() !== null;

  readonly init = async (): Promise<void> => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    this.user.set(session?.user ? { id: session.user.id, email: session.user.email! } : null);
    this.isLoading.set(false);

    supabase.auth.onAuthStateChange((_event, session) => {
      this.user.set(session?.user ? { id: session.user.id, email: session.user.email! } : null);
    });
  };

  readonly signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  readonly signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };
}

import { inject, Injectable } from '@angular/core';
import {
  AuthTokenResponsePassword,
  createClient,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;

  private readonly storage = inject(StorageService);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async login(
    email: string,
    password: string
  ): Promise<Boolean> {
    const result = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.data.session?.access_token) {
      this.setToken(result.data.session.access_token);
    }
    return !!result.data.session?.access_token;
  }

  setToken(token: string): void {
    this.storage.set<string>('token-api', environment.apiKey);
    this.storage.set<string>('token', token);
  }

  async logout(): Promise<void> {
    console.log('Entrooooo');
    this.storage.remove('token-api');
    this.storage.remove('token');

    await this.supabase.auth.signOut();
    // this.router.navigate(['/login']);
  }

  isLogged(): boolean {
    const token = this.storage.get<string>('token');
    const apiKey = this.getApiKey();
    return !!token && !!apiKey;
  }

  getApiKey(): string | null {
    const token = this.storage.get<string>('token-api');
    return token;
  }
}

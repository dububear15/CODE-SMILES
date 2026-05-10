import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

const AVATAR_KEY = 'user_avatar';

@Injectable({ providedIn: 'root' })
export class AvatarService {

  constructor(private api: ApiService, private auth: AuthService) {}

  /** Get avatar from session cache */
  getAvatar(): string {
    return sessionStorage.getItem(AVATAR_KEY) ?? '';
  }

  /** Save avatar to session cache */
  setAvatar(url: string): void {
    sessionStorage.setItem(AVATAR_KEY, url);
  }

  /** Clear avatar cache */
  clearAvatar(): void {
    sessionStorage.removeItem(AVATAR_KEY);
  }

  /**
   * Handle file input change — converts to base64, saves to DB and cache.
   * Returns a Promise that resolves with the base64 string.
   */
  uploadFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject('Please select an image file.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        reject('Image must be under 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const user = this.auth.getUser();
        if (!user?.id) {
          reject('Not logged in.');
          return;
        }

        this.api.updateAvatar(user.id, base64).subscribe({
          next: () => {
            this.setAvatar(base64);
            resolve(base64);
          },
          error: (err) => reject(err?.error?.message ?? 'Upload failed.')
        });
      };
      reader.onerror = () => reject('Failed to read file.');
      reader.readAsDataURL(file);
    });
  }
}

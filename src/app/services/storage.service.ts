import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
    private storage: Storage = localStorage;

    set<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            this.storage.setItem(key, serialized);
        } catch (error) {
            console.error(`❌ Error guardando en localStorage [${key}]`, error);
        }
    }

    get<T>(key: string): T | null {
        const item = this.storage.getItem(key);
        if (!item) return null;

        try {
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Error parseando valor de localStorage [${key}]`, error);
            return null;
        }
    }


    remove(key: string): void {
        this.storage.removeItem(key);
    }


    clear(): void {
        this.storage.clear();
    }

    useSessionStorage(): void {
        this.storage = sessionStorage;
    }

    useLocalStorage(): void {
        this.storage = localStorage;
    }
}

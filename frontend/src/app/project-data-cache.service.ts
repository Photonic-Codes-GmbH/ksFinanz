import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataCacheService {
  public data: Map<string, string | number>;

  public constructor() {
    this.data = new Map<string, string | number>();
  }

  public getValue(key: string): string | number {
    return this.data.get(key) ?? '';
  }

  public setValue(key: string, value: string | number): void {
    this.data.set(key, value);
  }
}

import { Injectable } from '@angular/core'

import { Entry } from '../models/entry.model'

@Injectable({
  providedIn: 'root'
})
export class EntriesCacheService {

  public entries: Entry[] = []

  public insertOrUpdateMany(entries: Entry[]): void {

    for (const entry of entries) {

      this.insertOrUpdateOne(entry)
    }
  }

  public insertOrUpdateOne(entry: Entry): void {

    const index = this.entries.findIndex(e => e.id === entry.id)

    if (index === -1) this.entries.push(entry)
    else this.entries[index] = entry
  }

  public deleteMany(entries: Entry[]): void {

    for (const entry of entries) {
      this.deleteOne(entry)
    }
  }

  public deleteOne(entry: Entry): void {

    const index = this.entries.findIndex(e => e.id === entry.id)

    if (index === -1) return

    this.entries.splice(index, 1)
  }
}

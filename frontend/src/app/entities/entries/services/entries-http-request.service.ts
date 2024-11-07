import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { ConfigService } from '../../../core/services/config.service'
import { Entry } from '../models/entry.model'
import { CreateEntryDTO } from '../dto/create-entry.dto'
import { EntryDTO } from '../dto/entry.dto'
import { UpdateEntryDTO } from '../dto/update-entry.dto'

@Injectable({
	providedIn: 'root'
})
export class EntriesHttpRequestService {

	private readonly url: string

	public constructor(private readonly config: ConfigService, private readonly http: HttpClient) {

		this.url = `${this.config.baseUrl}/entries`
	}

	public findAll(): Observable<Entry[]> {

		return this.http.get<Entry[]>(this.url)
	}

	public findOne(id: string): Observable<Entry> {

		return this.http.get<Entry>(`${this.url}/${id}`)
	}

	public createOrUpdate(entry: Entry): Observable<Entry> {

		const dto: EntryDTO = {
			id: entry.id,
			kategorie: entry.kategorie,
			wohnlage: entry.wohnlage,
			ort: entry.ort,
			von: entry.von,
			bis: entry.bis,
			mittelwert: entry.mittelwert,
			makler: entry.makler,
			brokerId: entry?.broker?.id ?? undefined,
		}

		return this.http.post<Entry>(`${this.url}/actions/createOrUpdate`, dto)
	}

	public create(entry: Entry): Observable<Entry> {

		const dto: CreateEntryDTO = {
			kategorie: entry.kategorie!,
			wohnlage: entry.wohnlage!,
			ort: entry.ort!,
			von: entry.von!,
			bis: entry.bis!,
			mittelwert: entry.mittelwert!,
			makler: entry.makler!,
			brokerId: entry?.broker?.id ?? undefined,
		}

		return this.http.post<Entry>(this.url, dto)
	}

	public update(entry: Entry): Observable<Entry> {

		const dto: UpdateEntryDTO = {
			kategorie: entry.kategorie,
			wohnlage: entry.wohnlage,
			ort: entry.ort,
			von: entry.von,
			bis: entry.bis,
			mittelwert: entry.mittelwert,
			makler: entry.makler,
			brokerId: entry?.broker?.id ?? undefined,
		}

		return this.http.put<Entry>(`${this.url}/${entry.id}`, dto)
	}

	public delete(entry: Entry): Observable<Entry> {

		return this.http.delete<Entry>(`${this.url}/${entry.id}`)
	}
}

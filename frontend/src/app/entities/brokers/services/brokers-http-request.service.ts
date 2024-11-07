import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { ConfigService } from '../../../core/services/config.service'
import { Broker } from '../models/broker.model'
import { CreateBrokerDTO } from '../dto/create-broker.dto'
import { BrokerDTO } from '../dto/broker.dto'
import { UpdateBrokerDTO } from '../dto/update-broker.dto'

@Injectable({
	providedIn: 'root'
})
export class BrokersHttpRequestService {

	private readonly url: string

	public constructor(private readonly config: ConfigService, private readonly http: HttpClient) {

		this.url = `${this.config.baseUrl}/brokers`
	}

	public findAll(): Observable<Broker[]> {

		return this.http.get<Broker[]>(this.url)
	}

	public findOne(id: string): Observable<Broker> {

		return this.http.get<Broker>(`${this.url}/${id}`)
	}

	public createOrUpdate(broker: Broker): Observable<Broker> {

		const dto: BrokerDTO = {
			id: broker.id,
			name: broker.name,
			entriesIds: broker?.entries?.map(entry => entry.id) ?? [],
		}

		return this.http.post<Broker>(`${this.url}/actions/createOrUpdate`, dto)
	}

	public create(broker: Broker): Observable<Broker> {

		const dto: CreateBrokerDTO = {
			name: broker.name!,
			entriesIds: broker?.entries?.map(entry => entry.id) ?? [],
		}

		return this.http.post<Broker>(this.url, dto)
	}

	public update(broker: Broker): Observable<Broker> {

		const dto: UpdateBrokerDTO = {
			name: broker.name,
			entriesIds: broker?.entries?.map(entry => entry.id) ?? [],
		}

		return this.http.put<Broker>(`${this.url}/${broker.id}`, dto)
	}

	public delete(broker: Broker): Observable<Broker> {

		return this.http.delete<Broker>(`${this.url}/${broker.id}`)
	}
}

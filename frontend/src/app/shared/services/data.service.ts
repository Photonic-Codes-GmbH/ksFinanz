import { Injectable } from '@angular/core'

import { EngineService } from '../../engine/services/engine.service'
import { EntriesService } from '../../entities/entries/services/entries.service'
import { EntriesCacheService } from '../../entities/entries/services/entries-cache.service'
import { BrokersService } from '../../entities/brokers/services/brokers.service'
import { BrokersCacheService } from '../../entities/brokers/services/brokers-cache.service'

@Injectable({
	providedIn: 'root'
})
export class DataService {

	public constructor(
		private readonly engineService: EngineService,
		public readonly entriesService: EntriesService,
		public readonly entriesCacheService: EntriesCacheService,
		public readonly brokersService: BrokersService,
		public readonly brokersCacheService: BrokersCacheService,
	) {

		this.engineService.error$.subscribe((error) => console.error(error))

		this.engineService.loaded$.subscribe(() => {
			this.reload()
			this.entriesService.updatedOne$.subscribe(() => this.reload())
			this.entriesService.updatedMany$.subscribe(() => this.reload())
			this.brokersService.updatedOne$.subscribe(() => this.reload())
			this.brokersService.updatedMany$.subscribe(() => this.reload())
		})
		
		this.entriesService.findAll()
		this.brokersService.findAll()

		this.engineService.emitLoaded()
	}

	public reload(): void {

		console.log('Reloaded')

		// Any action that should be done on reload

	}
}

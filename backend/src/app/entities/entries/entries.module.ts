import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KeycloakConnectModule } from 'nest-keycloak-connect'

import { CoreModule } from '../../core/core.module'
import { KeycloakOptionsService } from '../../core/services/keycloak-options.service'

import { EntriesController } from './controllers/entries.controller'
import { EntriesService } from './services/entries.service'
import { EntriesCRUDService } from './services/entries-crud.service'
import { Entry } from './entities/entry.entity'

import { Broker } from '../brokers/entities/broker.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry, Broker]),
		KeycloakConnectModule.registerAsync({ imports: [CoreModule], useExisting: KeycloakOptionsService })
  ],
  controllers: [
    EntriesController
  ],
  providers: [
    EntriesService,
    EntriesCRUDService
  ],
  exports: [
    EntriesService,
    EntriesCRUDService
  ]
})
export class EntriesModule {
}

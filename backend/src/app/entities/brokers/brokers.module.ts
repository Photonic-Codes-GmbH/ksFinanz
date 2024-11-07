import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KeycloakConnectModule } from 'nest-keycloak-connect'

import { CoreModule } from '../../core/core.module'
import { KeycloakOptionsService } from '../../core/services/keycloak-options.service'

import { BrokersController } from './controllers/brokers.controller'
import { BrokersService } from './services/brokers.service'
import { BrokersCRUDService } from './services/brokers-crud.service'
import { Broker } from './entities/broker.entity'

import { Entry } from '../entries/entities/entry.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Broker, Entry]),
		KeycloakConnectModule.registerAsync({ imports: [CoreModule], useExisting: KeycloakOptionsService })
  ],
  controllers: [
    BrokersController
  ],
  providers: [
    BrokersService,
    BrokersCRUDService
  ],
  exports: [
    BrokersService,
    BrokersCRUDService
  ]
})
export class BrokersModule {
}

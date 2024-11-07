import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { KeycloakConnectModule } from 'nest-keycloak-connect'

import { CoreModule } from './core/core.module'
import { SharedModule } from './shared/shared.module'
import { EntriesModule } from './entities/entries/entries.module'
import { BrokersModule } from './entities/brokers/brokers.module'

import { TypeOrmOptionsService } from './core/services/typeorm-options.service'
import { KeycloakOptionsService } from './core/services/keycloak-options.service'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({ imports: [CoreModule], useExisting: TypeOrmOptionsService }),
		KeycloakConnectModule.registerAsync({ imports: [CoreModule], useExisting: KeycloakOptionsService }),
		CoreModule,
		SharedModule,
		EntriesModule,
		BrokersModule,
	],
	controllers: [
		AppController
	],
	providers: [
		AppService
	]
})
export class AppModule {
}

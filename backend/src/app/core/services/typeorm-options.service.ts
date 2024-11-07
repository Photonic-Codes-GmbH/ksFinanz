import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

import { ConfigService } from './config.service'
import { Entry } from '../../entities/entries/entities/entry.entity'
import { Broker } from '../../entities/brokers/entities/broker.entity'

@Injectable()
export class TypeOrmOptionsService {

	public constructor(private readonly configService: ConfigService) {
	}

	public createTypeOrmOptions(): TypeOrmModuleOptions {

		const options: TypeOrmModuleOptions = {
			type: 'mysql',
			host: this.configService.config.database.host,
			port: +this.configService.config.database.port,
			username: this.configService.config.database.username,
			password: this.configService.config.database.password,
			database: this.configService.config.database.name,
			entities: [Entry, Broker],
			synchronize: true,
		}

		return options
	}
}

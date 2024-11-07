import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { CreateBrokerDTO } from '../dto/create-broker.dto'
import { BrokerDTO } from '../dto/broker.dto'
import { UpdateBrokerDTO } from '../dto/update-broker.dto'
import { Broker } from '../entities/broker.entity'

import { Entry } from '../../entries/entities/entry.entity'

@Injectable()
export class BrokersCRUDService {

	public constructor(
		@InjectRepository(Broker) private readonly brokersRepository: Repository<Broker>,
		
		@InjectRepository(Entry) private readonly entriesRepository: Repository<Entry>,
	) {
	}

	public async findAll(): Promise<Broker[]> {

		return await this.brokersRepository.find({ relations: ['entries'] })
	}

	public async findOne(id: string): Promise<Broker> {

		const record = await this.brokersRepository.findOne({ where: { id: id }, relations: ['entries'] })

		if (!record) {

			throw new HttpException(`Broker ${id} was not found`, HttpStatus.NOT_FOUND)
		}

		return record
	}

	public async createOrUpdate(brokerDTO: BrokerDTO): Promise<Broker> {

		const record = await this.findOne(brokerDTO.id)

		if (!record) {

			return await this.create(brokerDTO as CreateBrokerDTO)
		}
		else {

			return await this.update(brokerDTO.id, brokerDTO as UpdateBrokerDTO)
		}
	}

	public async create(createBrokerDTO: CreateBrokerDTO): Promise<Broker> {
		
		let entries: Entry[] = []
		if (createBrokerDTO.entriesIds) {

			entries = await this.entriesRepository.findBy({ id: In(createBrokerDTO.entriesIds) })
			if (entries.length !== createBrokerDTO.entriesIds.length) {

				throw new HttpException('One or more entries were not found', HttpStatus.NOT_FOUND)
			}
		}

		const create: Partial<Broker> = {

			id: uuid(),
			
			name: createBrokerDTO.name,
			
			entries: entries,
		}

		const entity = this.brokersRepository.create(create)
		const record = await this.brokersRepository.save(entity)

		console.log('Created Broker', JSON.stringify(record))

		return await this.findOne(record.id)
	}

	public async update(id: string, updateBrokerDTO: UpdateBrokerDTO): Promise<Broker> {

		const record = await this.findOne(id)

		if (!record) {
			throw new HttpException(`Broker ${id} was not found`, HttpStatus.NOT_FOUND)
		}

		const update: Partial<Broker> = {

			id: record.id,
			
			name: record.name,
		}

		if (updateBrokerDTO.name) {

			update.name = updateBrokerDTO.name
		}

		if (updateBrokerDTO.entriesIds) {

			const entries = await this.entriesRepository.findBy({ id: In(updateBrokerDTO.entriesIds) })

			if (entries.length !== updateBrokerDTO.entriesIds.length) {
				throw new HttpException('One or more entries were not found', HttpStatus.NOT_FOUND)
			}

			record.entries = entries
			await this.brokersRepository.save(record)
		}

		await this.brokersRepository.update(id, update)

		console.log('Updated Broker', JSON.stringify(record))

		return await this.findOne(update.id)
	}

	public async delete(id: string): Promise<Broker> {

		const record = await this.findOne(id)

		// Optional stuff
		// await this.entriesRepository.delete({ entries: record })

		await this.brokersRepository.delete(id)

		console.log('Deleted Broker', JSON.stringify(record))

		return record
	}
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

import { CreateEntryDTO } from '../dto/create-entry.dto'
import { EntryDTO } from '../dto/entry.dto'
import { UpdateEntryDTO } from '../dto/update-entry.dto'
import { Entry } from '../entities/entry.entity'

import { Broker } from '../../brokers/entities/broker.entity'

@Injectable()
export class EntriesCRUDService {

	public constructor(
		@InjectRepository(Entry) private readonly entriesRepository: Repository<Entry>,
		
		@InjectRepository(Broker) private readonly brokersRepository: Repository<Broker>,
	) {
	}

	public async findAll(): Promise<Entry[]> {

		return await this.entriesRepository.find({ relations: ['broker'] })
	}

	public async findOne(id: string): Promise<Entry> {

		const record = await this.entriesRepository.findOne({ where: { id: id }, relations: ['broker'] })

		if (!record) {

			throw new HttpException(`Entry ${id} was not found`, HttpStatus.NOT_FOUND)
		}

		return record
	}

	public async createOrUpdate(entryDTO: EntryDTO): Promise<Entry> {

		const record = await this.findOne(entryDTO.id)

		if (!record) {

			return await this.create(entryDTO as CreateEntryDTO)
		}
		else {

			return await this.update(entryDTO.id, entryDTO as UpdateEntryDTO)
		}
	}

	public async create(createEntryDTO: CreateEntryDTO): Promise<Entry> {
		
		let broker: Broker | undefined = undefined
		if (createEntryDTO.brokerId) {

			broker = await this.brokersRepository.findOne({ where: { id: createEntryDTO.brokerId } })
			if (!broker) {

				throw new HttpException(`Broker ${createEntryDTO.brokerId} was not found`, HttpStatus.NOT_FOUND)
			}
		}

		const create: Partial<Entry> = {

			id: uuid(),
			
			kategorie: createEntryDTO.kategorie,
			wohnlage: createEntryDTO.wohnlage,
			ort: createEntryDTO.ort,
			von: createEntryDTO.von,
			bis: createEntryDTO.bis,
			mittelwert: createEntryDTO.mittelwert,
			makler: createEntryDTO.makler,
			
			broker: broker,
		}

		const entity = this.entriesRepository.create(create)
		const record = await this.entriesRepository.save(entity)

		console.log('Created Entry', JSON.stringify(record))

		return await this.findOne(record.id)
	}

	public async update(id: string, updateEntryDTO: UpdateEntryDTO): Promise<Entry> {

		const record = await this.findOne(id)

		if (!record) {
			throw new HttpException(`Entry ${id} was not found`, HttpStatus.NOT_FOUND)
		}

		const update: Partial<Entry> = {

			id: record.id,
			
			kategorie: record.kategorie,
			wohnlage: record.wohnlage,
			ort: record.ort,
			von: record.von,
			bis: record.bis,
			mittelwert: record.mittelwert,
			makler: record.makler,
		}

		if (updateEntryDTO.kategorie) {

			update.kategorie = updateEntryDTO.kategorie
		}

		if (updateEntryDTO.wohnlage) {

			update.wohnlage = updateEntryDTO.wohnlage
		}

		if (updateEntryDTO.ort) {

			update.ort = updateEntryDTO.ort
		}

		if (updateEntryDTO.von) {

			update.von = updateEntryDTO.von
		}

		if (updateEntryDTO.bis) {

			update.bis = updateEntryDTO.bis
		}

		if (updateEntryDTO.mittelwert) {

			update.mittelwert = updateEntryDTO.mittelwert
		}

		if (updateEntryDTO.makler) {

			update.makler = updateEntryDTO.makler
		}

		if (updateEntryDTO.brokerId) {

			const broker = await this.brokersRepository.findOne({ where: { id: updateEntryDTO.brokerId } })

			if (!broker) {
				throw new HttpException(`Broker ${updateEntryDTO.brokerId} was not found`, HttpStatus.NOT_FOUND)
			}

			update.broker = broker
		}

		await this.entriesRepository.update(id, update)

		console.log('Updated Entry', JSON.stringify(record))

		return await this.findOne(update.id)
	}

	public async delete(id: string): Promise<Entry> {

		const record = await this.findOne(id)

		// Optional stuff
		// await this.brokersRepository.delete(record.broker.id)

		await this.entriesRepository.delete(id)

		console.log('Deleted Entry', JSON.stringify(record))

		return record
	}
}

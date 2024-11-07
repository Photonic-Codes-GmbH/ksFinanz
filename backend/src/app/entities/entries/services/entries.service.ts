import { Injectable } from '@nestjs/common'
import { EntriesCRUDService } from './entries-crud.service'
import { CreateEntryDTO } from '../dto/create-entry.dto'
import { EntryDTO } from '../dto/entry.dto'
import { UpdateEntryDTO } from '../dto/update-entry.dto'
import { Entry } from '../entities/entry.entity'

@Injectable()
export class EntriesService {

  public constructor(
    private readonly entriesCRUDService: EntriesCRUDService
  ) {
  }

  public async findAll(): Promise<Entry[]> {

    return await this.entriesCRUDService.findAll()
  }

  public async findOne(id: string): Promise<Entry> {

    return await this.entriesCRUDService.findOne(id)
  }

	public async createOrUpdate(entryDTO: EntryDTO): Promise<Entry> {

		return await this.entriesCRUDService.createOrUpdate(entryDTO)
	}

  public async create(createEntryDTO: CreateEntryDTO): Promise<Entry> {

    return await this.entriesCRUDService.create(createEntryDTO)
  }

  public async update(id: string, updateEntryDTO: UpdateEntryDTO): Promise<Entry> {

    return await this.entriesCRUDService.update(id, updateEntryDTO)
  }

  public async delete(id: string): Promise<Entry> {

    return await this.entriesCRUDService.delete(id)
  }
}

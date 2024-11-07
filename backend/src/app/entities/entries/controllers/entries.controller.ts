import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'

import { EntriesService } from '../services/entries.service'
import { CreateEntryDTO } from '../dto/create-entry.dto'
import { EntryDTO } from '../dto/entry.dto'
import { UpdateEntryDTO } from '../dto/update-entry.dto'
import { Entry } from '../entities/entry.entity'

@Controller('entries')
export class EntriesController {
	public constructor(private readonly entriesService: EntriesService) {
	}

	@Get()
	public async findAll(): Promise<Entry[]> {

		return this.entriesService.findAll()
	}

	@Get(':id')
	public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Entry> {

		return this.entriesService.findOne(id)
	}

	@Post('actions/createOrUpdate')
	public async createOrUpdate(@Body() entriesDTO: EntryDTO): Promise<Entry> {

		// Die ID ist dann in dem DTO
		return this.entriesService.createOrUpdate(entriesDTO)
	}

	@Post()
	public async create(@Body() createEntryDTO: CreateEntryDTO): Promise<Entry> {

		return this.entriesService.create(createEntryDTO)
	}

	@Put(':id')
	public async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEntryDTO: UpdateEntryDTO): Promise<Entry> {

		return this.entriesService.update(id, updateEntryDTO)
	}

	@Delete(':id')
	public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<Entry> {

		return this.entriesService.delete(id)
	}
}
	
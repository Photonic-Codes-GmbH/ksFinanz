import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'

import { BrokersService } from '../services/brokers.service'
import { CreateBrokerDTO } from '../dto/create-broker.dto'
import { BrokerDTO } from '../dto/broker.dto'
import { UpdateBrokerDTO } from '../dto/update-broker.dto'
import { Broker } from '../entities/broker.entity'

@Controller('brokers')
export class BrokersController {
	public constructor(private readonly brokersService: BrokersService) {
	}

	@Get()
	public async findAll(): Promise<Broker[]> {

		return this.brokersService.findAll()
	}

	@Get(':id')
	public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Broker> {

		return this.brokersService.findOne(id)
	}

	@Post('actions/createOrUpdate')
	public async createOrUpdate(@Body() brokersDTO: BrokerDTO): Promise<Broker> {

		// Die ID ist dann in dem DTO
		return this.brokersService.createOrUpdate(brokersDTO)
	}

	@Post()
	public async create(@Body() createBrokerDTO: CreateBrokerDTO): Promise<Broker> {

		return this.brokersService.create(createBrokerDTO)
	}

	@Put(':id')
	public async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBrokerDTO: UpdateBrokerDTO): Promise<Broker> {

		return this.brokersService.update(id, updateBrokerDTO)
	}

	@Delete(':id')
	public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<Broker> {

		return this.brokersService.delete(id)
	}
}
	
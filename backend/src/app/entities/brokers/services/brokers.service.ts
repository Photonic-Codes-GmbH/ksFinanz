import { Injectable } from '@nestjs/common'
import { BrokersCRUDService } from './brokers-crud.service'
import { CreateBrokerDTO } from '../dto/create-broker.dto'
import { BrokerDTO } from '../dto/broker.dto'
import { UpdateBrokerDTO } from '../dto/update-broker.dto'
import { Broker } from '../entities/broker.entity'

@Injectable()
export class BrokersService {

  public constructor(
    private readonly brokersCRUDService: BrokersCRUDService
  ) {
  }

  public async findAll(): Promise<Broker[]> {

    return await this.brokersCRUDService.findAll()
  }

  public async findOne(id: string): Promise<Broker> {

    return await this.brokersCRUDService.findOne(id)
  }

	public async createOrUpdate(brokerDTO: BrokerDTO): Promise<Broker> {

		return await this.brokersCRUDService.createOrUpdate(brokerDTO)
	}

  public async create(createBrokerDTO: CreateBrokerDTO): Promise<Broker> {

    return await this.brokersCRUDService.create(createBrokerDTO)
  }

  public async update(id: string, updateBrokerDTO: UpdateBrokerDTO): Promise<Broker> {

    return await this.brokersCRUDService.update(id, updateBrokerDTO)
  }

  public async delete(id: string): Promise<Broker> {

    return await this.brokersCRUDService.delete(id)
  }
}

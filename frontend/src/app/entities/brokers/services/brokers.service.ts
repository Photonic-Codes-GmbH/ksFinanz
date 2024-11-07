import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { Broker } from '../models/broker.model'
import { BrokersHttpRequestService } from './brokers-http-request.service'
import { HttpRequest } from '../../../engine/models/http-request.model'
import { EngineService } from '../../../engine/services/engine.service'
import { BrokersCacheService } from './brokers-cache.service'

@Injectable({
  providedIn: 'root'
})
export class BrokersService {

  private readonly updatedManySubject: Subject<Broker[]> = new Subject<Broker[]>()
	private readonly updatedOneSubject: Subject<Broker> = new Subject<Broker>()

  public readonly updatedMany$: Observable<Broker[]> = this.updatedManySubject.asObservable()
	public readonly updatedOne$: Observable<Broker> = this.updatedOneSubject.asObservable()

  public constructor(
    private readonly brokersHttpRequestService: BrokersHttpRequestService,
    private readonly engineService: EngineService,
    private readonly brokersCacheService: BrokersCacheService
  ) {

    this.engineService.appendProcessorForMany('Broker', this.processMany.bind(this))
    this.engineService.appendProcessorForOne('Broker', this.processOne.bind(this))
    console.log('Appended response processors for Broker')
  }

  public findAll(): Observable<Broker[]> {

    const request = this.brokersHttpRequestService.findAll()
    this.engineService.execute(new HttpRequest('Broker', 'findAll', request))
    console.log('Requesting all Brokers')
		return this.updatedMany$
  }

  public findOne(id: string): Observable<Broker> {

    const request = this.brokersHttpRequestService.findOne(id)
    this.engineService.execute(new HttpRequest('Broker', 'findOne', request))
    console.log('Requesting a Broker')
		return this.updatedOne$
  }

	public createOrUpdate(broker: Broker){

		const request = this.brokersHttpRequestService.createOrUpdate(broker)
    this.engineService.execute(new HttpRequest('Broker', 'createOrUpdate', request))
    console.log('Requesting Creation or Update of a Broker')
		return this.updatedOne$
	}

  public create(broker: Broker): Observable<Broker> {

    const request = this.brokersHttpRequestService.create(broker)
    this.engineService.execute(new HttpRequest('Broker', 'create', request))
    console.log('Requesting Creation of a Broker')
		return this.updatedOne$
  }

  public update(broker: Broker): Observable<Broker> {

    const request = this.brokersHttpRequestService.update(broker)
    this.engineService.execute(new HttpRequest('Broker', 'update', request))
    console.log('Requesting an Update of a Broker')
		return this.updatedOne$
  }

  public delete(broker: Broker): Observable<Broker> {

    const request = this.brokersHttpRequestService.delete(broker)
    this.engineService.execute(new HttpRequest('Broker', 'delete', request))
    console.log('Requesting Deletion of a Broker')
		return this.updatedOne$
  }

  public processMany(action: string, brokers: Broker[]): void {

    switch (action) {
      case 'findAll':
        this.brokersCacheService.brokers = brokers;
        this.brokersCacheService.brokers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'findOne':
        console.error('Invalid action', action);
        break;
      case 'create':
        this.brokersCacheService.insertOrUpdateMany(brokers);
        break;
      case 'update':
        this.brokersCacheService.insertOrUpdateMany(brokers);
        break;
      case 'delete':
        this.brokersCacheService.deleteMany(brokers);
        break;
      default:
        console.error('Invalid action', action);
        break;
    }

    console.log('Processed Brokers', this.brokersCacheService.brokers)

		this.updatedManySubject.next(this.brokersCacheService.brokers)
  }

  public processOne(action: string, broker: Broker): void {

    switch (action) {
      case 'findAll':
        console.error('Invalid action', action);
        break;
      case 'findOne':
        this.brokersCacheService.insertOrUpdateOne(broker);
        break;
      case 'create':
        this.brokersCacheService.insertOrUpdateOne(broker);
        break;
      case 'update':
        this.brokersCacheService.insertOrUpdateOne(broker);
        break;
      case 'delete':
        this.brokersCacheService.deleteOne(broker);
        break;
      default:
        console.error('Invalid action', action);
        break;
    }

    console.log('Processed Broker', broker)

		this.updatedOneSubject.next(broker)
  }
}

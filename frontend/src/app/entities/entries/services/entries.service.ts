import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { Entry } from '../models/entry.model'
import { EntriesHttpRequestService } from './entries-http-request.service'
import { HttpRequest } from '../../../engine/models/http-request.model'
import { EngineService } from '../../../engine/services/engine.service'
import { EntriesCacheService } from './entries-cache.service'

@Injectable({
  providedIn: 'root'
})
export class EntriesService {

  private readonly updatedManySubject: Subject<Entry[]> = new Subject<Entry[]>()
	private readonly updatedOneSubject: Subject<Entry> = new Subject<Entry>()

  public readonly updatedMany$: Observable<Entry[]> = this.updatedManySubject.asObservable()
	public readonly updatedOne$: Observable<Entry> = this.updatedOneSubject.asObservable()

  public constructor(
    private readonly entriesHttpRequestService: EntriesHttpRequestService,
    private readonly engineService: EngineService,
    private readonly entriesCacheService: EntriesCacheService
  ) {

    this.engineService.appendProcessorForMany('Entry', this.processMany.bind(this))
    this.engineService.appendProcessorForOne('Entry', this.processOne.bind(this))
    console.log('Appended response processors for Entry')
  }

  public findAll(): Observable<Entry[]> {

    const request = this.entriesHttpRequestService.findAll()
    this.engineService.execute(new HttpRequest('Entry', 'findAll', request))
    console.log('Requesting all Entries')
		return this.updatedMany$
  }

  public findOne(id: string): Observable<Entry> {

    const request = this.entriesHttpRequestService.findOne(id)
    this.engineService.execute(new HttpRequest('Entry', 'findOne', request))
    console.log('Requesting an Entry')
		return this.updatedOne$
  }

	public createOrUpdate(entry: Entry){

		const request = this.entriesHttpRequestService.createOrUpdate(entry)
    this.engineService.execute(new HttpRequest('Entry', 'createOrUpdate', request))
    console.log('Requesting Creation or Update of a Entry')
		return this.updatedOne$
	}

  public create(entry: Entry): Observable<Entry> {

    const request = this.entriesHttpRequestService.create(entry)
    this.engineService.execute(new HttpRequest('Entry', 'create', request))
    console.log('Requesting Creation of an Entry')
		return this.updatedOne$
  }

  public update(entry: Entry): Observable<Entry> {

    const request = this.entriesHttpRequestService.update(entry)
    this.engineService.execute(new HttpRequest('Entry', 'update', request))
    console.log('Requesting an Update of an Entry')
		return this.updatedOne$
  }

  public delete(entry: Entry): Observable<Entry> {

    const request = this.entriesHttpRequestService.delete(entry)
    this.engineService.execute(new HttpRequest('Entry', 'delete', request))
    console.log('Requesting Deletion of an Entry')
		return this.updatedOne$
  }

  public processMany(action: string, entries: Entry[]): void {

    switch (action) {
      case 'findAll':
        this.entriesCacheService.entries = entries;
        break;
      case 'findOne':
        console.error('Invalid action', action);
        break;
      case 'create':
        this.entriesCacheService.insertOrUpdateMany(entries);
        break;
      case 'update':
        this.entriesCacheService.insertOrUpdateMany(entries);
        break;
      case 'delete':
        this.entriesCacheService.deleteMany(entries);
        break;
      default:
        console.error('Invalid action', action);
        break;
    }

    console.log('Processed Entries', this.entriesCacheService.entries)

		this.updatedManySubject.next(this.entriesCacheService.entries)
  }

  public processOne(action: string, entry: Entry): void {

    switch (action) {
      case 'findAll':
        console.error('Invalid action', action);
        break;
      case 'findOne':
        this.entriesCacheService.insertOrUpdateOne(entry);
        break;
      case 'create':
        this.entriesCacheService.insertOrUpdateOne(entry);
        break;
      case 'update':
        this.entriesCacheService.insertOrUpdateOne(entry);
        break;
      case 'delete':
        this.entriesCacheService.deleteOne(entry);
        break;
      default:
        console.error('Invalid action', action);
        break;
    }

    console.log('Processed Entry', entry)

		this.updatedOneSubject.next(entry)
  }
}

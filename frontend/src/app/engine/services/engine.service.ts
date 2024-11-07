import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, concatMap, map, of, tap, throwError } from 'rxjs';

import { HttpRequest } from '../models/http-request.model';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private readonly processingHttpRequests: HttpRequest[] = [];
  public isProcessingHttpRequests: boolean = false;

  private readonly queue: Subject<HttpRequest> = new Subject<HttpRequest>();

  private readonly errorSubject: Subject<any> = new Subject<any>();
  public readonly error$: Observable<any> = this.errorSubject.asObservable();

  private readonly processorsForMany: Map<string, (action: string, model: any[]) => void> = new Map<string, (action: string, model: any[]) => void>();
  private readonly processorsForOne: Map<string, (action: string, model: any) => void> = new Map<string, (action: string, model: any) => void>();

  private readonly loadedSubject: Subject<void> = new Subject<void>();
  public readonly loaded$: Observable<void> = this.loadedSubject.asObservable();

  public constructor() {

		this.initialize();
  }

  public appendProcessorForMany(type: string, handler: (action: string, model: any[]) => void): void {
    this.processorsForMany.set(type, handler);
  }

  public appendProcessorForOne(type: string, handler: (action: string, model: any) => void): void {
    this.processorsForOne.set(type, handler);
  }

  private initialize(): void {
    this.queue.pipe(
      concatMap((httpRequest: HttpRequest) => httpRequest.request.pipe(
        map((response: any) => {
          httpRequest.response = response;
          return httpRequest;
        }),
        catchError((error: any) => {
          console.error('Http Error:', error);
          this.errorSubject.next(error);
          return EMPTY;
        })
      )),
      concatMap((httpRequest: HttpRequest) => this.handleResponse(httpRequest))
    ).subscribe();
  }

  public execute(httpRequest: HttpRequest): void {
    this.processingHttpRequests.push(httpRequest);
    this.isProcessingHttpRequests = this.processingHttpRequests.length > 0;

    httpRequest.request = httpRequest.request.pipe(
      catchError((error: any) => {
        this.processingHttpRequests.splice(this.processingHttpRequests.indexOf(httpRequest), 1);
        this.isProcessingHttpRequests = this.processingHttpRequests.length > 0;
        return throwError(() => error);
      }),
      tap(() => {
        this.processingHttpRequests.splice(this.processingHttpRequests.indexOf(httpRequest), 1);
        this.isProcessingHttpRequests = this.processingHttpRequests.length > 0;
      })
    );

    this.queue.next(httpRequest);
  }

  public handleResponse(httpRequest: HttpRequest): Observable<HttpRequest> {
    const type: string = httpRequest.type;
    const action: string = httpRequest.action;
    const response: any = httpRequest.response;

    if (response === undefined) {
      return of(httpRequest);
    }

    if (response instanceof Function) {
      const fn = response;
      fn();
    } else if (response instanceof Array) {
      const processMany = this.processorsForMany.get(type)!;
      processMany(action, response);
    } else if (response instanceof Object) {
      const processOne = this.processorsForOne.get(type)!;
      processOne(action, response);
    } else {
      console.error('Invalid response:', response);
    }

    return of(httpRequest);
  }

  public emitLoaded(): void {
    const observable = of(() => this.loadedSubject.next());
    this.execute(new HttpRequest('Event', 'loaded', observable));
  }
}

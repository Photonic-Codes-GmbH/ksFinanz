import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.body) {
      const body = this.convertDatesToISOStrings(req.body);
      req = req.clone({ body });
    }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = this.convertISOStringsToDates(event.body);
          return event.clone({ body });
        }
        return event;
      })
    );
  }

  private convertDatesToISOStrings(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    for (let key of Object.keys(obj)) {
      if (obj[key] instanceof Date) {
        obj[key] = obj[key] ? obj[key].toISOString() : undefined;
      } else {
        this.convertDatesToISOStrings(obj[key]);
      }
    }

    return obj;
  }
  
  private convertISOStringsToDates(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return obj;
    }

    for (let key of Object.keys(obj)) {
      if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(obj[key])) {
        obj[key] = obj[key] ? new Date(obj[key]) : undefined;
      } else {
        this.convertISOStringsToDates(obj[key]);
      }
    }

    return obj;
  }
}

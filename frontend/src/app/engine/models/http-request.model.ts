import { Observable } from 'rxjs';

export class HttpRequest {
  public type: string;
  public action: string;
  public request: Observable<any>;
  public response?: any;

  public constructor(type: string, action: string, request: Observable<any>) {
    this.type = type;
    this.action = action;
    this.request = request;
  }
}

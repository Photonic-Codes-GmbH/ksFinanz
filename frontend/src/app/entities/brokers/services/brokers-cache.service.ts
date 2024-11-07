import { Injectable } from '@angular/core'

import { Broker } from '../models/broker.model'

@Injectable({
  providedIn: 'root'
})
export class BrokersCacheService {

  public brokers: Broker[] = []

  public insertOrUpdateMany(brokers: Broker[]): void {

    for (const broker of brokers) {

      this.insertOrUpdateOne(broker)
    }
  }

  public insertOrUpdateOne(broker: Broker): void {

    const index = this.brokers.findIndex(b => b.id === broker.id)

    if (index === -1) this.brokers.push(broker)
    else this.brokers[index] = broker
  }

  public deleteMany(brokers: Broker[]): void {

    for (const broker of brokers) {
      this.deleteOne(broker)
    }
  }

  public deleteOne(broker: Broker): void {

    const index = this.brokers.findIndex(b => b.id === broker.id)

    if (index === -1) return

    this.brokers.splice(index, 1)
  }
}

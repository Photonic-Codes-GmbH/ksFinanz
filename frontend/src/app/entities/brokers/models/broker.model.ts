import { v4 as uuid } from 'uuid'

import { Entry } from '../../entries/models/entry.model'

export class Broker {

	public id?: string

	public name: string

	public entries?: Entry[]

	public constructor(name: string) {
		
		this.name = name
	}
}

import { v4 as uuid } from 'uuid'

import { Broker } from '../../brokers/models/broker.model'

export class Entry {

	public id?: string

	public kategorie: string

	public wohnlage: string

	public ort: string

	public von: number

	public bis: number

	public mittelwert: number

	public makler: string

	public broker?: Broker

	public constructor(kategorie: string, wohnlage: string, ort: string, von: number, bis: number, mittelwert: number, makler: string) {
		
		this.kategorie = kategorie
		this.wohnlage = wohnlage
		this.ort = ort
		this.von = von
		this.bis = bis
		this.mittelwert = mittelwert
		this.makler = makler
	}
}

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'

import { Broker } from '../../brokers/entities/broker.entity'

@Entity('entry')
export class Entry {

	@PrimaryColumn('uuid')
	public id: string

	@Column('varchar')
	public kategorie: string

	@Column('varchar')
	public wohnlage: string

	@Column('varchar')
	public ort: string

	@Column('decimal')
	public von: number

	@Column('decimal')
	public bis: number

	@Column('decimal')
	public mittelwert: number

	@Column('varchar')
	public makler: string

	@ManyToOne(() => Broker, broker => broker.entries)
	public broker: Broker
}

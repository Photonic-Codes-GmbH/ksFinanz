import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

import { Entry } from '../../entries/entities/entry.entity'

@Entity('broker')
export class Broker {

	@PrimaryColumn('uuid')
	public id: string

	@Column('varchar')
	public name: string

	@OneToMany(() => Entry, entry => entry.broker)
	public entries: Entry[]
}

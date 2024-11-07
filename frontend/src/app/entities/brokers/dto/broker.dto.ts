import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator'

export class BrokerDTO {

	@IsOptional()
	@IsUUID(4)
	public id?: string

	@IsOptional()
	@IsString()
	public name?: string

	@IsOptional()
	@IsArray()
	@IsUUID(4, { each: true })
	public entriesIds?: (string | undefined)[]
}

import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateBrokerDTO {

	@IsString()
	public name: string

	@IsOptional()
	@IsArray()
	@IsUUID(4, { each: true })
	public entriesIds?: (string | undefined)[]
}

import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateEntryDTO {

	@IsOptional()
	@IsString()
	public kategorie?: string

	@IsOptional()
	@IsString()
	public wohnlage?: string

	@IsOptional()
	@IsString()
	public ort?: string

	@IsOptional()
	@IsNumber()
	public von?: number

	@IsOptional()
	@IsNumber()
	public bis?: number

	@IsOptional()
	@IsNumber()
	public mittelwert?: number

	@IsOptional()
	@IsString()
	public makler?: string

	@IsOptional()
	@IsUUID(4)
	public brokerId?: (string | undefined)
}

import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateEntryDTO {

	@IsString()
	public kategorie: string

	@IsString()
	public wohnlage: string

	@IsString()
	public ort: string

	@IsNumber()
	public von: number

	@IsNumber()
	public bis: number

	@IsNumber()
	public mittelwert: number

	@IsString()
	public makler: string

	@IsOptional()
	@IsUUID(4)
	public brokerId?: (string | undefined)
}

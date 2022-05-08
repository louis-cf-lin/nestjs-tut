import { IsString } from 'class-validator';

// data type object, pretty much like a type utility for some data object (message body in this case)
export class CreateMessageDto {
  @IsString()
  content: string;
}

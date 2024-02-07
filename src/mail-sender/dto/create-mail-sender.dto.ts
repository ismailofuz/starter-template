import { IsEmail, IsString } from 'class-validator';

export class CreateMailSenderDto {
    @IsEmail()
    email: string;

    @IsString()
    first_name: string;
}

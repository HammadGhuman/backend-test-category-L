import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateJobInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  job_name: string;
}

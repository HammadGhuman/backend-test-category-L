import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform((obj) => {
    if (obj.type == 0) {
      return bcrypt.hashSync(obj.value, 10);
    }
    return obj.value;
  })
  @Field(() => String)
  password: string;
}

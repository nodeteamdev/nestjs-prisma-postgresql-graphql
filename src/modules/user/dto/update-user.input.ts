import { InputType } from '@nestjs/graphql';
import SignUpInput from '@auth/dto/sign-up.input';

@InputType()
export default class UpdateUserInput extends SignUpInput {}

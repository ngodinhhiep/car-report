import { Expose } from 'class-transformer';

export class UserDto {
  // only list properties (not password) that you want to share publicly
  @Expose()
  id: number;

  @Expose()
  email: string;

  password: string;
}

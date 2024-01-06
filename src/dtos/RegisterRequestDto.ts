import { Expose, Transform } from 'class-transformer'

export class RegisterRequestDto {
  @Expose({ name: 'email' })
  public email: string

  @Expose({ name: 'name' })
  public name: string

  @Expose({ name: 'phone' })
  public phone: string

  @Expose({ name: 'password' })
  public password: string

  @Expose({ name: 'age' })
  @Transform(({ value }) => Number(value))
  public age: number

  @Expose({ name: 'photos' })
  public photos: string[]
}

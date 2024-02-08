import {IsBoolean, IsString} from 'class-validator';

export class UpdateHookDto {
  @IsString()
  description?: string

  // @IsBoolean()
  // regenToken?: boolean
  // The problem with this is that the auth token is generated off of the unique id to make it easily reproducible
  // I think the best course of action is just have a user delete the existing hook and make a new one
}
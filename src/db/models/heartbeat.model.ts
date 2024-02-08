import {Column, Model, Table} from 'sequelize-typescript';

@Table
export class Heartbeat extends Model {
  @Column
  timestamp: string

  @Column
  up: boolean

  @Column
  hookId: string
}
import {Column, Model, Table} from "sequelize-typescript";

@Table
export class Hook extends Model {
    @Column
    uniqueId: string;

    @Column
    description: string
}
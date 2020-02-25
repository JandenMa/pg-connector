import { DataType } from '../enums';

export interface ILibField {
  /** field name */
  name: string;
  /** field data type */
  type: DataType;
  /** field max length */
  length?: number;
  /** field default value */
  defaultValue?: number | string | boolean | null | JSON;
  /** tag if can be null value */
  notNull?: boolean;
}

export interface ILibTable {
  /** table name */
  name: string;
  /** table index */
  index: number;
  /** table fiedls (columns) */
  fields: ILibField[];
  /** primary keys (should concern about the order) */
  primaryKeys: string[];
  /** unique constraint */
  unique?: string[];
}

export interface ILibModelArgs {
  /** if true that it will create table when instantiating, default false */
  autoCreate?: boolean;
  /** data tables */
  tables: ILibTable[];
}

export interface ILibModel {
  readonly dataTables: ILibTable[];
}

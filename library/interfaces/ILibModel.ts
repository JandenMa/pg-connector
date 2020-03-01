import { DataTypes } from '../enums';

export interface ILibField {
  /** field name */
  name: string;
  /** field data type */
  type: DataTypes;
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
  /** data tables */
  tables: ILibTable[];
}

export interface ILibModelDeleteArgs {
  /** table index */
  tableIndex: number;
  /** primary key values */
  pkValues?: any[];
  /** where clause */
  whereClause?: string;
}

export interface ILibModelUpdateArgs {
  /** table index */
  tableIndex: number;
  /** data you want to set when update */
  data: any[];
  /** primary key values */
  pkValues?: any[];
  /** where clause */
  whereClause?: string;
}

export interface ILibModelLoadArgs {
  /** fields you want to select */
  selectFields: string[] | '*';
  /** table index */
  tableIndex?: number;
  /** primary key values */
  pkValues?: any[];
  /** where clause */
  whereClause?: string;
  /** sort by field */
  orderBy?: string;
  /** whether distinct */
  distinct?: boolean;
  /** query counts, for pagination */
  limit?: number;
  /** query offset, for pagination */
  offset?: number;
}

export interface ILibModel {
  readonly tables: ILibTable[];
}

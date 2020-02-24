import { DataType } from '../enums';

export type FieldType = {
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
};

export type TableType = {
  /** table name */
  name: string;
  /** table index */
  index: number;
  /** table fiedls (columns) */
  fields: FieldType[];
  /** primary keys (should concern about the order) */
  primaryKeys: string[];
  /** unique constraint */
  unique?: string[];
};

export type ModelConstructorArgsType = {
  /** if true that it will create table when instantiating, default false */
  autoCreate?: boolean;
  /** data tables */
  tables: TableType[];
};

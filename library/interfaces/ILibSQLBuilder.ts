import { ISqlParameterized } from './ILibDataAccess';
import { ILibTable } from './ILibModel';

export interface ILibSQLBuilder {
  /** build create table sql */
  buildCreateTableSQL(): string[];

  /**
   * build insert sql
   * @param index table index
   * @param fields fields you want to set when insert
   * @param values values you want to set when insert
   */
  buildInsertSQL(
    index: number,
    fields: string[],
    values: any[]
  ): ISqlParameterized | null;

  /**
   * build delete sql with primary key values
   * @param index table index
   * @param pkValues primary key values
   */
  buildDeleteSQLWithPks(
    index: number,
    pkValues: any[]
  ): ISqlParameterized | null;

  /**
   * build delete sql with where clause
   * @param index table index
   * @param whereClause
   */
  buildDeleteSQLWithWhereClause(
    index: number,
    whereClause?: string
  ): ISqlParameterized | null;

  /**
   * build update sql with primary key values
   * @param index table index
   * @param updateFields fields you want to set when update
   * @param updateValues values you want to set when update
   * @param pkValues primary key values
   */
  buildUpdateSQLWithPks(
    index: number,
    updateFields: string[],
    updateValues: any[],
    pkValues: any[]
  ): ISqlParameterized | null;

  /**
   * build update sql with where clause
   * @param index table index
   * @param updateFields fields you want to set when update
   * @param updateValues values you want to set when update
   * @param whereClause
   */
  buildUpdateSQLWithWhereClause(
    index: number,
    updateFields: string[],
    updateValues: any[],
    whereClause?: string
  ): ISqlParameterized | null;
}

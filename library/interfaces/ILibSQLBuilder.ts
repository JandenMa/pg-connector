import { ISqlParameterized } from './ILibDataAccess';

export interface ILibQuerySqlExtendArgs {
  orderBy?: string;
  distinct?: boolean;
  limit?: number;
  offset?: number;
}

export interface ILibSQLBuilder {
  /** build create table sql */
  buildCreateTableSql(): string[];

  /**
   * build insert sql
   * @param index table index
   * @param fields fields you want to set when insert
   * @param values values you want to set when insert
   */
  buildInsertSql(
    index: number,
    fields: string[],
    values: any[]
  ): ISqlParameterized | null;

  /**
   * build delete sql with primary key values
   * @param index table index
   * @param pkValues primary key values
   */
  buildDeleteSqlByPks(index: number, pkValues: any[]): ISqlParameterized | null;

  /**
   * build delete sql with where clause
   * @param index table index
   * @param whereClause where clause
   */
  buildDeleteSqlByWhereClause(
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
  buildUpdateSqlByPks(
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
   * @param whereClause where clause
   */
  buildUpdateSqlByWhereClause(
    index: number,
    updateFields: string[],
    updateValues: any[],
    whereClause?: string
  ): ISqlParameterized | null;

  /**
   * build single query sql for one table by primary keys
   * @param index table index
   * @param selectFields fields you want to select
   * @param pkValues primary keys value
   * @param options extend options
   */
  buildQuerySqlByPks(
    index: number,
    selectFields: string[] | '*',
    pkValues: any[],
    options?: ILibQuerySqlExtendArgs
  ): ISqlParameterized | null;

  /**
   * build single query sql for one table by where clause
   * @param index table index
   * @param selectFields fields you want to select
   * @param whereClause where clause
   * @param options extend options
   */
  buildQuerySqlByWhereClause(
    index: number,
    selectFields: string[] | '*',
    whereClause?: string,
    options?: ILibQuerySqlExtendArgs
  ): ISqlParameterized | null;

  /**
   * build single query sql for model by where clause
   * @param index table index
   * @param selectFields fields you want to select (should with letter like A.xxx)
   * @param whereClause  where clause
   * @param options extend options
   */
  buildModelQuerySqlByWhereClause(
    selectFields: string[] | '*',
    whereClause?: string,
    options?: ILibQuerySqlExtendArgs
  ): ISqlParameterized | null;
}

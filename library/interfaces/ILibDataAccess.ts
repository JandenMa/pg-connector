export interface ISqlParameterized {
  alias?: string;
  sql: string;
  replacements?: any[];
}

export interface ILibDataAccess {
  /** Begin a transaction */
  beginTransaction(): Promise<void>;

  /** execute transaction with single sql */
  executeTransactionWithSqlParameterized(
    args: ISqlParameterized
  ): Promise<any[]>;

  /** execute transaction with multi sql */
  executeTransactionWithSqlsParameterized(
    args: ISqlParameterized[]
  ): Promise<object>;

  /** Commit transaction */
  commitTransaction(): Promise<void>;

  /** Rollback transaction */
  rollbackTransaction(err: Error): Promise<void>;

  /** execute single sql return rows count */
  executeNonQueryWithSql(args: ISqlParameterized): Promise<number>;

  /** execute multi sql return rows count */
  executeNonQueryWithSqls(args: ISqlParameterized[]): Promise<number>;

  /** execute single sql return rows */
  executeRowsWithSql(args: ISqlParameterized): Promise<any[]>;

  /** execute multi sql return rows */
  executeRowsWithSqls(args: ISqlParameterized[]): Promise<any[]>;
}

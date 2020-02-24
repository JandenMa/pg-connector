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
  ): Promise<any[] | null>;

  /** execute transaction with multi sql */
  executeTransactionWithSqlsParameterized(
    args: ISqlParameterized[]
  ): Promise<any[] | null>;

  /** Commit transaction */
  commitTransaction(): Promise<void>;

  /** Rollback transaction */
  rollbackTransaction(err: Error): Promise<void>;

  /** execute single sql return rows count */
  executeNonQueryWithSql(args: ISqlParameterized): Promise<number | null>;

  /** execute multi sql return rows count */
  executeNonQueryWithSqls(args: ISqlParameterized[]): Promise<number | null>;

  /** execute single sql return rows */
  executeRowsWithSql(args: ISqlParameterized): Promise<any[] | null>;

  /** execute multi sql return rows */
  executeRowsWithSqls(args: ISqlParameterized[]): Promise<any[] | null>;
}

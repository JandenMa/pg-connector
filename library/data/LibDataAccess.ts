/******** Library Class Information **********
 *
 * Description: A class for executing sqls
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

import { Pool, PoolClient, QueryResult } from 'pg';
import LibConnection from './LibConnection';
import {
  ILibDataAccess,
  ISqlParameterized
} from '../interfaces/ILibDataAccess';

/** A class for executing sqls */
class LibDataAccess implements ILibDataAccess {
  // #region Private Properties
  private pool: Pool;
  private client: PoolClient | null = null;
  // #endregion

  constructor() {
    this.pool = LibConnection.getPool();
  }

  // #region Private Functions
  private async getClient(): Promise<PoolClient | null> {
    try {
      if (this.client) {
        return this.client;
      } else {
        this.client = await this.pool.connect();
        return this.client;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private releaseClient(): void {
    try {
      if (this.client) {
        this.client.release();
        this.client = null;
      }
    } catch (e) {
      console.error(e);
    }
  }
  // #endregion

  // #region Public Functions
  /** Begin a transaction */
  public async beginTransaction(): Promise<void> {
    const client = await this.getClient();
    if (client) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.info('Begin Transaction');
        }
        client.query('BEGIN');
      } catch (e) {
        console.error(e);
        throw e;
      }
    } else {
      console.error('No client connected!');
    }
  }

  /** execute transaction with single sql */
  public async executeTransactionWithSqlParameterized(
    args: ISqlParameterized
  ): Promise<any[]> {
    if (this.client) {
      try {
        const { sql, replacements = [] } = args;
        const result =
          replacements && replacements.length > 0
            ? await this.client.query(sql, replacements)
            : await this.client.query(sql);
        this.releaseClient();
        return result.rows;
      } catch (e) {
        this.rollbackTransaction(e);
        return [];
      }
    } else {
      console.error('No client connected!');
      return [];
    }
  }

  /** execute transaction with multi sql */
  public async executeTransactionWithSqlsParameterized(
    args: ISqlParameterized[]
  ): Promise<object> {
    try {
      const res: object = {};
      await Promise.all(
        args.map(async (arg, index) => {
          if (this.client) {
            const { sql, replacements = [], alias } = arg;
            const result =
              replacements && replacements.length > 0
                ? await this.client.query(sql, replacements)
                : await this.client.query(sql);
            this.releaseClient();
            alias ? (res[alias] = result.rows) : (res[index] = result.rows);
          } else {
            console.error('No client connected!');
          }
        })
      );
      this.releaseClient();
      return res;
    } catch (e) {
      this.rollbackTransaction(e);
      return {};
    }
  }

  /** Commit transaction */
  public async commitTransaction(): Promise<void> {
    if (this.client) {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.info('Commit Transaction');
        }
        await this.client.query('COMMIT');
        this.releaseClient();
      } catch (e) {
        this.rollbackTransaction(e);
      }
    } else {
      console.error('No client connected!');
    }
  }

  /** Rollback transaction */
  public async rollbackTransaction(err: Error): Promise<void> {
    if (this.client) {
      try {
        console.error('Rollback Transaction: ', err);
        await this.client.query('ROLLBACK');
        this.releaseClient();
      } catch (e) {
        console.error(e);
        throw e;
      }
    } else {
      console.error('No client connected!');
    }
  }

  /** execute single sql return rows count */
  public async executeNonQueryWithSql(
    args: ISqlParameterized
  ): Promise<number> {
    try {
      const { sql, replacements = [] } = args;
      const result: QueryResult =
        replacements && replacements.length > 0
          ? await this.pool.query(sql, replacements)
          : await this.pool.query(sql);
      return result.rowCount;
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  /** execute multi sql return rows count */
  public async executeNonQueryWithSqls(
    args: ISqlParameterized[]
  ): Promise<number> {
    try {
      let n: number = 0;
      await Promise.all(
        args.map(async arg => {
          const { sql, replacements = [] } = arg;
          const result: QueryResult =
            replacements && replacements.length > 0
              ? await this.pool.query(sql, replacements)
              : await this.pool.query(sql);
          n += result.rowCount;
        })
      );
      return n;
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  /** execute single sql return rows */
  public async executeRowsWithSql(args: ISqlParameterized): Promise<any[]> {
    try {
      const { sql, replacements = [] } = args;
      const result: QueryResult =
        replacements && replacements.length > 0
          ? await this.pool.query(sql, replacements)
          : await this.pool.query(sql);
      return result.rows;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /** execute multi sql return rows */
  public async executeRowsWithSqls(args: ISqlParameterized[]): Promise<any[]> {
    try {
      const arr: any[] = [];
      await Promise.all(
        args.map(async (arg, index) => {
          const { sql, replacements = [], alias } = arg;
          const result: QueryResult =
            replacements && replacements.length > 0
              ? await this.pool.query(sql, replacements)
              : await this.pool.query(sql);
          alias ? (arr[alias] = result.rows) : (arr[index] = result.rows);
        })
      );
      return arr;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  // #endregion
}

export default LibDataAccess;

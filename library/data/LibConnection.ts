/******** Library Class Information **********
 *
 * Description: A class for Connecting to Postgresql
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

import { Pool } from 'pg';
import { ConnectionArgsType } from '../types';

/** A class for connecting to Postgresql */
class LibConnection {
  private static pool: Pool;

  public static setPool(pool: Pool): void {
    this.pool = pool;
  }

  public static getPool(): Pool {
    return this.pool;
  }
}

export default LibConnection;

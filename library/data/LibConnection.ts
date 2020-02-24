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
  private connectionArgs: ConnectionArgsType;
  private declare pool: Pool;

  constructor(args: ConnectionArgsType) {
    const {
      database = 'postgres',
      host = 'localhost',
      port = 5432,
      userName = 'postgres',
      password = '',
      connectionMax = 20,
      connectionTimeoutMillis = 0,
      idleTimeoutMillis = 10000,
      ssl = false
    } = args;
    this.connectionArgs = args;
    this.pool = new Pool({
      max: connectionMax,
      user: userName,
      database,
      password,
      host,
      port,
      connectionTimeoutMillis,
      idleTimeoutMillis,
      ssl
    });
  }

  public getPool(): Pool {
    if (!this.pool) {
      const {
        database = 'postgres',
        host = 'localhost',
        port = 5432,
        userName = 'postgres',
        password = '',
        connectionMax = 20,
        connectionTimeoutMillis = 0,
        idleTimeoutMillis = 10000,
        ssl = false
      } = this.connectionArgs;
      this.pool = new Pool({
        max: connectionMax,
        user: userName,
        database,
        password,
        host,
        port,
        connectionTimeoutMillis,
        idleTimeoutMillis,
        ssl
      });
    }
    return this.pool;
  }
}

export default LibConnection;

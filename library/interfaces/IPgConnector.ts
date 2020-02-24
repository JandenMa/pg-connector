import { ILibDataAccess } from './ILibDataAccess';

export interface IConnection {
  /** Postgresql host, default localhost */
  host?: string;
  /** Postgresql port, default 5432 */
  port?: number;
  /** Postgresql user name, default postgres */
  userName?: string;
  /** Postgresql password, default empty */
  password?: string;
  /** Postgresql database, default postgres */
  database?: string;
  /** Postgresql max connection, default 20 */
  connectionMax?: number;
  /**
   * Number of milliseconds to wait before timing
   * out when connecting a new client, by default
   * this is 0 which means no timeout
   */
  connectionTimeoutMillis?: number;
  /**
   * Number of milliseconds a client must sit idle in the pool
   * and not be checked out, before it is disconnected from the backend and discarded,
   * default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
   */
  idleTimeoutMillis?: number;
  /** Connect using ssl connection, default false */
  ssl?: boolean;
}

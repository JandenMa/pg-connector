import { Pool } from 'pg';
import { DataTypes } from './library/enums';
import { IConnection } from './library/interfaces/IPgConnector';
import LibModel from './library/model/LibModel';
import LibConnection from './library/data/LibConnection';
import LibDataAccess from './library/data/LibDataAccess';
import LibSQLBuilder from './library/data/LibSQLBuilder';

class PgConnector {
  public readonly Model: typeof LibModel;
  public readonly SQLBuilder: typeof LibSQLBuilder;
  public readonly DataAccess: typeof LibDataAccess;
  public readonly DataTypes: typeof DataTypes;

  constructor(args?: IConnection) {
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
    } = args || {};
    const pool = new Pool({
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
    console.info(`Connected DB at ${host}:${port}/${database} successfully!👍`);
    LibConnection.setPool(pool);
    this.Model = LibModel;
    this.DataAccess = LibDataAccess;
    this.DataTypes = DataTypes;
    this.SQLBuilder = LibSQLBuilder;
  }
}

export default PgConnector;
export { PgConnector };

import { Pool } from 'pg';
import { DataType } from './library/enums';
import { IConnection } from './library/interfaces/IPgConnector';
import LibModel from './library/model/LibModel';
import LibConnection from './library/data/LibConnection';
import LibDataAccess from './library/data/LibDataAccess';
import LibSQLBuilder from './library/data/LibSQLBuilder';

class PgConnector {
  public Model: typeof LibModel;
  public SQLBuilder: typeof LibSQLBuilder;
  public DataAccess: typeof LibDataAccess;
  public DataType: typeof DataType;

  constructor(args: IConnection) {
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
    LibConnection.setPool(pool);
    this.Model = LibModel;
    this.DataAccess = LibDataAccess;
    this.DataType = DataType;
    this.SQLBuilder = LibSQLBuilder;
  }
}

module.exports = { PgConnector };
module.exports.default = PgConnector;
module.exports.PgConnector = PgConnector;

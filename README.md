# Pg-Connector

> Lib Version：0.1.0-beta2
>
> Document Version：0.1.0
>
> Author：Janden Ma
>
> LICENCE: MIT



## What is Pg-Connector?

Pg-Connector is an ORM library for Postgresql on NodeJS. 



## Installation

- npm 

  ```bash
  npm i pg-connector --save
  ```

- yarn

  ``` bash
  yarn add pg-connector --save
  ```



## Quick Example

- Instance (_core/pg.js_)

  ``` js
  // core/pg.js
  import PgConnector from 'pg-connector'
  
  const Pg = new PgConnector({
    host: 'http://192.168.1.100',
    port: 5432,
    userName: 'root',
    password: '123456',
    database: 'test',
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 60000,
    ssl: true
  })
  
  export default Pg
  ```

- Model (_models/users.js_)

  ```js
  import Pg from '../core/pg.js';
  
  class User extends Pg.Model{
    constructor(){
      super({
        autoCreate: true,
        tables: [
          {
            index: 0,
            name: 'users',
            primaryKeys: ['id'],
            fields: [
              {
                name: 'id',
                type: Pg.DataType.SERIAL
              },
              {
                name: 'name',
                type: Pg.DataType.VARCHAR,
                length: 100
              },
              {
                name: 'age',
                type: Pg.DataType.INT
              }
            ]
          }
        ]
      });
      
      // other functions you want
    }
  }
  
  export default User
  ```



## Usage

- import 

  ```js
  import PgConnector from 'pg-connector'
  // or
  const PgConnector = require('pg-connector'
  ```

- Instantiate

  ```js
  const Pg = new PgConnector({
    host: 'http://192.168.1.100',
    port: 5432,
    userName: 'root',
    password: '123456',
    database: 'test',
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 60000,
    ssl: true
  })
  ```

  | Key                     | Type      | Introduction                                                 | Default value |
  | ----------------------- | --------- | ------------------------------------------------------------ | ------------- |
  | host                    | `string`  | Postgresql server host                                       | "localhost"   |
  | port                    | `number`  | Postgresql server port                                       | 5432          |
  | userName                | `string`  | Postgresql server user name                                  | "postgres"    |
  | password                | `string`  | Postgresql server password                                   | ""_(empty)_   |
  | database                | `string`  | Postgresql database name                                     | "postgres"    |
  | connectionMax           | `number`  | Postgresql database max connection                           | 10            |
  | connectionTimeoutMillis | `number`  | Number of milliseconds to wait before timing out when connecting a new client, by default this is 0 which means no timeout | 0             |
  | idleTimeoutMillis       | `number`  | Number of milliseconds a client must sit idle in the pool and not be checked out, before it is disconnected from the backend and discarded, default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients | 10000         |
  | ssl                     | `boolean` | To connect to pg using ssl                                   | false         |



## Modules

- [LibDataAccess](https://github.com/JandenMa/pg-connector/blob/master/LibDataAccess.md)
- [LibSQLBuilder](https://github.com/JandenMa/pg-connector/blob/master/LibSQLBuilder.md)
- [LibModel](https://github.com/JandenMa/pg-connector/blob/master/LibModel.md)
- DataType
  - SERIAL: Serial Id
  - BIT
  - BOOLEAN
  - CHAR
  - VARCHAR
  - INT: Int 4
  - BIGINT: Int 8
  - SMALLINT: Int 2
  - FLOAT
  - DOUBLE
  - DECIMAL
  - NUMERIC
  - JSON
  - DATE
  - TIMESTAMP
  - TIMESTAMPTZ: Timestamp with time zone
  - TEXT
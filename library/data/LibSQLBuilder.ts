/******** Library Class Information **********
 *
 * Description: A class for building sql
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

import { TableType, SqlParameterizedType } from '../types';
import { ILibTable } from '../interfaces/ILibModel';
import { ISqlParameterized } from '../interfaces/ILibDataAccess';
import { DataType } from '../enums';
import LibSysUtils from '../utils/LibSysUtils';
import LibDataAccess from './LibDataAccess';

/** A class for building sql */
class LibSQLBuilder {
  private tbls: ILibTable[];

  constructor(tables: ILibTable[]) {
    this.tbls = tables;
  }

  // #region Private Functions
  /**
   * convert table index to letter (supports 26 tables right now)
   * @param i table index
   * @returns letter
   */
  private convertIndexToLetter(i: number): string {
    switch (i) {
      case 0:
        return ' A';
      case 1:
        return ' B';
      case 2:
        return ' C';
      case 3:
        return ' D';
      case 4:
        return ' E';
      case 5:
        return ' F';
      case 6:
        return ' G';
      case 7:
        return ' H';
      case 8:
        return ' I';
      case 9:
        return ' J';
      case 10:
        return ' K';
      case 11:
        return ' L';
      case 12:
        return ' M';
      case 13:
        return ' N';
      case 14:
        return ' O';
      case 15:
        return ' P';
      case 16:
        return ' Q';
      case 17:
        return ' R';
      case 18:
        return ' S';
      case 19:
        return ' T';
      case 20:
        return ' U';
      case 21:
        return ' V';
      case 22:
        return ' W';
      case 23:
        return ' X';
      case 24:
        return ' Y';
      case 25:
        return ' Z';
      default:
        return ' ';
    }
  }

  /**
   * get data table by table index
   * @param index table index (since 0)
   * @returns data table
   */
  private getTableByIndex(index: number): ILibTable | null {
    const tables = this.tbls.filter(tbl => tbl.index === index);
    if (tables && tables.length > 0) {
      return tables[0];
    }
    console.error(`Table[${index}] is not exist!`);
    return null;
  }

  /**
   * check validity of fields and values
   * @param fields
   * @param values
   */
  private validateFieldsAndValues(fields: string[], values: any[]): boolean {
    let validity = true;
    if (!fields) {
      console.error(`fields in LibSQLBuilder shouldn't be null or undefined`);
      validity = false;
    }
    if (!values) {
      console.error(`values in LibSQLBuilder shouldn't be null or undefined`);
      validity = false;
    }
    if (fields.length !== values.length) {
      console.error(`fields.length and values.length are not matched`);
      validity = false;
    }

    return validity;
  }

  /**
   * A helper function to check whether the column exists in the dbtable
   * @param tableName the name of dbtable
   * @param columnName the column name you will check
   * @returns exist or not
   */
  async checkTableColumnExist(
    tableName: string,
    columnName: string
  ): Promise<boolean> {
    const dataAccess = new LibDataAccess();
    try {
      const sql = `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}' AND column_name = '${columnName}' LIMIT 1`;
      const res = await dataAccess.executeNonQueryWithSql({ sql });
      return res ? res > 0 : false;
    } catch (e) {
      throw e;
    }
  }

  // #endregion

  /** build create table sql */
  public buildCreateTableSQL(): string[] {
    const sqls: string[] = [];
    this.tbls.forEach(tbl => {
      const { name: tblName, fields, primaryKeys, unique } = tbl;
      let sql = `CREATE TABLE IF NOT EXISTS ${tblName} ( `;
      fields.forEach((field, index) => {
        const { name: fieldName, defaultValue, length, type, notNull } = field;
        switch (type) {
          case DataType.CHAR:
          case DataType.VARCHAR:
            sql = sql.concat(
              `"${fieldName}" ${DataType[type]}(${length || 254})`
            );
            if (defaultValue) {
              sql = sql.concat(` DEFAULT ${defaultValue}`);
            }
            break;
          case DataType.DATE:
            sql = sql.concat(`"${fieldName}" ${DataType[type]})`);
            if (defaultValue) {
              if (defaultValue === 'now') {
                sql = sql.concat(` DEFAULT DATE(now())`);
              } else {
                sql = sql.concat(` DEFAULT ${defaultValue}`);
              }
            }
            break;
          case DataType.TIMESTAMP:
            sql = sql.concat(
              `"${fieldName}" ${DataType[type]} WITHOUT TIME ZONE)`
            );
            if (defaultValue) {
              if (defaultValue === 'now') {
                sql = sql.concat(` DEFAULT CURRENT_TIMESTAMP`);
              } else {
                sql = sql.concat(` DEFAULT ${defaultValue}`);
              }
            }
            break;
          case DataType.TIMESTAMPTZ:
            sql = sql.concat(
              `"${fieldName}" ${DataType[type]}) WITH TIME ZONE`
            );
            if (defaultValue) {
              if (defaultValue === 'now') {
                sql = sql.concat(` DEFAULT CURRENT_TIMESTAMP`);
              } else {
                sql = sql.concat(` DEFAULT ${defaultValue}`);
              }
            }
            break;
          default:
            sql = sql.concat(`"${fieldName}" ${DataType[type]})`);
            if (defaultValue) {
              sql = sql.concat(` DEFAULT ${defaultValue}`);
            }
            break;
        }
        if (notNull) {
          sql = sql.concat(' NOT NULL');
        }
        if (index !== fields.length - 1) {
          sql = sql.concat(',');
        }
      });
      sql = sql.concat(` PRIMARY KEY (${primaryKeys.join(',')}) `);
      if (unique) {
        sql = sql.concat(
          ` CONSTRAINT ${tblName}_unique_constraint UNIQUE (${unique.join(
            ','
          )}) `
        );
      }
      sql = sql.concat(' );');
      sqls.push(sql);
    });
    return sqls;
  }

  /**
   * build insert sql
   * @param index table index
   * @param fields fields you want to set when insert
   * @param values values you want to set when insert
   */
  public buildInsertSQL(
    index: number,
    fields: string[],
    values: any[]
  ): ISqlParameterized | null {
    if (this.validateFieldsAndValues(fields, values)) {
      const tbl = this.getTableByIndex(index);
      if (tbl) {
        let sql = '';
        let valsStr = '';
        const fieldsStr = LibSysUtils.mergeString(',', false, ...fields);
        for (let i: number = 0; i < values.length; i += 1) {
          valsStr = valsStr.concat(`$${i + 1}`);
          if (i !== values.length - 1) {
            valsStr = valsStr.concat(', ');
          }
        }
        sql = `INSERT INTO ${tbl.name} ( ${fieldsStr} ) VALUES ( ${valsStr} ) RETURNING *;`;
        return { sql, replacements: values };
      }
      return null;
    }
    return null;
  }

  /**
   * build delete sql with primary key values
   * @param index table index
   * @param pkValues primary key values
   */
  public buildDeleteSQLWithPks(
    index: number,
    pkValues: any[]
  ): ISqlParameterized | null {
    const tbl = this.getTableByIndex(index);
    if (tbl) {
      const pks = tbl.primaryKeys;
      if (this.validateFieldsAndValues(pks, pkValues)) {
        let sql = '';
        sql = sql.concat(`DELETE FROM ${tbl.name} WHERE `);
        pks.forEach((pk, i) => {
          sql = sql.concat(`${pk} = $${i + 1} `);
          if (i !== pks.length - 1) {
            sql = sql.concat(' AND ');
          }
        });
        sql = sql.concat(' RETURNING *;');
        return { sql, replacements: pkValues };
      }
      return null;
    }
    return null;
  }

  /**
   * build delete sql with where clause
   * @param index table index
   * @param whereClause
   */
  public buildDeleteSQLWithWhereClause(
    index: number,
    whereClause?: string
  ): ISqlParameterized | null {
    const tbl = this.getTableByIndex(index);
    if (tbl) {
      let sql = '';
      sql = sql.concat(`DELETE FROM ${tbl.name} `);
      if (whereClause) {
        sql = sql.concat(`WHERE ${whereClause}`);
      }
      sql = sql.concat(' RETURNING *;');
      return { sql };
    }
    return null;
  }

  /**
   * build update sql with primary key values
   * @param index table index
   * @param updateFields fields you want to set when update
   * @param updateValues values you want to set when update
   * @param pkValues primary key values
   */
  public buildUpdateSQLWithPks(
    index: number,
    updateFields: string[],
    updateValues: any[],
    pkValues: any[]
  ): ISqlParameterized | null {
    if (this.validateFieldsAndValues(updateFields, updateValues)) {
      const tbl = this.getTableByIndex(index);
      if (tbl) {
        const pks = tbl.primaryKeys;
        if (this.validateFieldsAndValues(pks, pkValues)) {
          let sql = '';
          let i = 1;
          sql = sql.concat(`UPDATE ${tbl.name} SET `);
          updateFields.forEach(f => {
            sql = sql.concat(`${f} = $${i} `);
            i += 1;
            if (i !== updateFields.length - 1) {
              sql = sql.concat(', ');
            }
          });
          sql = sql.concat(' WHERE ');
          pks.forEach(pk => {
            sql = sql.concat(`${pk} = $${i} `);
            i += 1;
            if (i !== pks.length - 1) {
              sql = sql.concat(' AND ');
            }
          });
          sql = sql.concat(' RETURNING *;');
          return { sql, replacements: [...updateValues, ...pkValues] };
        }
        return null;
      }
      return null;
    }
    return null;
  }

  /**
   * build update sql with where clause
   * @param index table index
   * @param updateFields fields you want to set when update
   * @param updateValues values you want to set when update
   * @param whereClause
   */
  public buildUpdateSQLWithWhereClause(
    index: number,
    updateFields: string[],
    updateValues: any[],
    whereClause?: string
  ): ISqlParameterized | null {
    if (this.validateFieldsAndValues(updateFields, updateValues)) {
      const tbl = this.getTableByIndex(index);
      if (tbl) {
        let sql = '';
        sql = sql.concat(`UPDATE ${tbl.name} SET `);
        updateFields.forEach((f, i) => {
          sql = sql.concat(`${f} = $${i + 1} `);
          if (i !== updateFields.length - 1) {
            sql = sql.concat(', ');
          }
        });
        if (whereClause) {
          sql = sql.concat(` WHERE ${whereClause}`);
        }
        sql = sql.concat(' RETURNING *;');
        return { sql, replacements: updateValues };
      }
      return null;
    }
    return null;
  }

  // public buildQuerySQL(): ISqlParameterized | null {}
}

export default LibSQLBuilder;

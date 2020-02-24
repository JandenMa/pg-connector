/******** Library Class Information **********
 *
 * Description: A class for building sql
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

import { TableType } from '../types';
import { DataType } from '../enums';
import LibSysUtils from '../utils/LibSysUtils';

/** A class for building sql */
class LibSQLBuilder {
  private tbls: TableType[];

  constructor(tables: TableType[]) {
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
  private getTableByIndex(index: number): TableType | null {
    const tables = this.tbls.filter(tbl => tbl.index === index);
    if (tables && tables.length > 0) {
      return tables[0];
    }
    console.error(`Table[${index}] is not exist!`);
    return null;
  }

  private validateFieldsAndValues(fields: string[], values: any[]) {
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

  private generateParameterizedString(length: number): string {
    let str = '';
    for (let i: number = 0; i < length; i += 1) {
      str = str.concat(`$${i + 1}`);
      if (i !== length - 1) {
        str = str.concat(', ');
      }
    }
    return str;
  }

  // #endregion

  public getCreateTableSQL(): string[] {
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

  public getInsertSQL(
    index: number,
    fields: string[],
    values: any[]
  ): string | null {
    if (this.validateFieldsAndValues(fields, values)) {
      let sql = '';
      const tbl = this.getTableByIndex(index);
      if (tbl) {
        const fieldsStr = LibSysUtils.mergeString(',', false, ...fields);
        let valsStr = this.generateParameterizedString(values.length);
        sql = `INSERT INTO ${tbl.name} ( ${fieldsStr} ) VALUES ( ${valsStr} ) RETURNING *;`;
      }
      return sql;
    }
    return null;
  }
}

export default LibSQLBuilder;

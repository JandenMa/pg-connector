/******** Library Class Information **********
 *
 * Description: A class for base model
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

import { ILibModelArgs, ILibTable, ILibModel } from '../interfaces/ILibModel';
import LibDataAccess from '../data/LibDataAccess';
import LibSQLBuilder from '../data/LibSQLBuilder';

/**
 * Model base
 */
class LibModel implements ILibModel {
  // #region Properties
  private tbls: ILibTable[];
  // #endregion

  // #region Accessors
  public get tables(): ILibTable[] {
    return this.tbls;
  }
  // #endregion

  constructor(args: ILibModelArgs) {
    const { autoCreate = false, tables } = args;
    if (!tables) {
      throw new Error(`Tables in the model couldn't be null or undefined!`);
    }
    if (tables.length === 0) {
      throw new Error(`Tables in the model couldn't be an empty array!`);
    }
    this.tbls = tables;
    if (autoCreate) {
      const builder = new LibSQLBuilder(tables);
      const dataAccess = new LibDataAccess();
      const createSqls = builder.buildCreateTableSql();
      dataAccess.executeNonQueryWithSqls(createSqls.map(sql => ({ sql })));
    }
  }

  private verfifyTblData(tableIndex: number, data: object): boolean {
    if (!tableIndex || !data) {
      throw new Error('Missing parameter!');
    }
    const tables = this.tbls.filter(tbl => tbl.index === tableIndex);
    if (tables && tables.length > 0) {
      const tbl = tables[0];
      const notNullList = tbl.primaryKeys;
      tbl.fields.forEach(f => {
        if (f.notNull && !notNullList.includes(f.name)) {
          notNullList.push(f.name);
        }
      });
      notNullList.forEach(f => {
        if (!data[f]) {
          throw new Error(`${f} is a not null field but no value provided!`);
        }
      });
      return true;
    } else {
      throw new Error(`DataTable[${tableIndex}] is not exist!`);
    }
  }

  // #region Protected Functions

  // #region add new
  protected beforeAddNew(tableIndex: number, data: object) {
    if (!tableIndex || !data) {
      throw new Error('Missing parameter!');
    }
    this.verfifyTblData(tableIndex, data);
  }

  protected async addNew(tableIndex: number, data: object): Promise<object> {
    this.beforeAddNew(tableIndex, data);
    const builder = new LibSQLBuilder(this.tbls);
    const fields: string[] = [];
    const values: any[] = [];
    Object.keys(data).forEach(field => {
      fields.push(field);
      values.push(data[field]);
    });
    const sql = builder.buildInsertSql(tableIndex, fields, values);
    if (!sql) {
      throw new Error('some error thrown when building insert sql');
    } else {
      const dataAccess = new LibDataAccess();
      const res = await dataAccess.executeRowsWithSql(sql);
      if (!res || res.length === 0) {
        throw new Error('some error thrown when executing insert sql');
      }
      this.afterAddNew(res[0]);
      return res[0];
    }
  }

  protected afterAddNew(res: object) {}
  // #endregion

  // #region delete
  protected beforeDelete() {}

  protected async delete() {}

  protected afterDelete() {}
  // #endregion

  // #region update
  protected beforeUpdate() {}

  protected async update() {}

  protected afterUpdate() {}
  // #endregion

  // #region load
  protected beforeLoad() {}

  protected async load() {}

  protected afterLoad() {}
  // #endregion

  // #endregion
}

export default LibModel;

/******** Library Class Information **********
 *
 * Description: A class for base model
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

import {
  ILibModelArgs,
  ILibTable,
  ILibModel,
  ILibModelAddNewArgs,
  ILibModelDeleteArgs
} from '../interfaces/ILibModel';
import { ISqlParameterized } from '../interfaces/ILibDataAccess';
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

  // #region Private Functions
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

  /**
   * handle insert into single table
   * @param tableIndex table index
   * @param data inserting data
   */
  private async handleAddNewIntoTable(tableIndex: number, data: object) {
    if (!tableIndex || !data) {
      throw new Error('Missing parameter!');
    }
    this.verfifyTblData(tableIndex, data);
    await this.beforeAddNew();
    const builder = new LibSQLBuilder(this.tbls);
    const fields: string[] = [];
    const values: any[] = [];
    Object.keys(data).forEach(field => {
      fields.push(field);
      values.push(data[field]);
    });
    const sql = builder.buildInsertSql(tableIndex, fields, values);
    if (!sql) {
      throw new Error('Some error thrown when building insert sql');
    } else {
      const dataAccess = new LibDataAccess();
      const res = await dataAccess.executeRowsWithSql(sql);
      if (!res || res.length === 0) {
        throw new Error('Some error thrown when executing insert sql');
      }
      await this.afterAddNew(res[0]);
      return res[0];
    }
  }

  /**
   * handle insert into multiple tables
   * @param data inserting data
   */
  private async handleAddNewIntoTables(data: any[]) {
    const sqls: ISqlParameterized[] = [];
    data.forEach((table, index) => {
      this.verfifyTblData(index, table);
      const builder = new LibSQLBuilder(this.tbls);
      const fields: string[] = [];
      const values: any[] = [];
      Object.keys(data).forEach(field => {
        fields.push(field);
        values.push(data[field]);
      });
      const sql = builder.buildInsertSql(index, fields, values);
      if (!sql) {
        throw new Error('Some error thrown when building insert sql');
      } else {
        sqls.push(sql);
      }
    });
    if (sqls.length > 0) {
      await this.beforeAddNew();
      const dataAccess = new LibDataAccess();
      await dataAccess.beginTransaction();
      try {
        const res = await dataAccess.executeTransactionWithSqlsParameterized(
          sqls
        );
        if (!res) {
          throw new Error('Some error thrown when executing insert sql');
        }
        await dataAccess.commitTransaction();
        await this.afterAddNew(res);
        return res;
      } catch (e) {
        console.error(e);
        await dataAccess.rollbackTransaction(e);
        return [];
      }
    } else {
      throw new Error('No insert sql created!');
    }
  }

  private async handleDeleteFromTable(
    tableIndex: number,
    pkValues?: any[],
    whereClause?: string
  ) {
    await this.beforeDelete();
    const builder = new LibSQLBuilder(this.tbls);
    const sql = pkValues
      ? builder.buildDeleteSqlByPks(tableIndex, pkValues)
      : builder.buildDeleteSqlByWhereClause(tableIndex, whereClause);
    if (!sql) {
      throw new Error('Some error thrown when building deleting sql');
    } else {
      const dataAccess = new LibDataAccess();
      const res = await dataAccess.executeRowsWithSql(sql);
      if (!res || res.length === 0) {
        throw new Error('Some error thrown when executing deleting sql');
      }
      await this.afterDelete(res[0]);
      return res[0];
    }
  }
  // #endregion

  // #region Protected Functions

  // #region add new
  /**
   * do something you want before adding new
   */
  protected async beforeAddNew() {
    // noop
  }

  protected async addNew(args: ILibModelAddNewArgs) {
    if (args) {
      const { data, tableIndex } = args;
      if (data instanceof Object && tableIndex !== undefined) {
        return this.handleAddNewIntoTable(tableIndex, data);
      } else if (data instanceof Array && data.length > 0) {
        return this.handleAddNewIntoTables(data);
      } else {
        throw new Error('Invalid parameter!');
      }
    } else {
      throw new Error('Invalid argument!');
    }
  }

  /**
   * do something you want after adding new
   * @param res
   */
  protected async afterAddNew(res: any[] | object) {
    // noop
  }
  // #endregion

  // #region delete
  /**
   * do something you want before deleting
   */
  protected beforeDelete() {
    // noop
  }

  protected async delete(args: ILibModelDeleteArgs): Promise<any[]> {
    if (args) {
      const { pkValues, whereClause, tableIndex } = args;
      if (!pkValues && !whereClause) {
        throw new Error('Missing parameters');
      }
      return this.handleDeleteFromTable(tableIndex, pkValues, whereClause);
    } else {
      throw new Error('Invalid argument!');
    }
  }

  /**
   * do something you want after deleting
   */
  protected afterDelete(res: any[] | object) {
    // noop
  }
  // #endregion

  // #region update
  /**
   * do something you want before updating
   */
  protected beforeUpdate() {
    // noop
  }

  protected async update() {}

  /**
   * do something you want after updating
   */
  protected afterUpdate() {
    // noop
  }
  // #endregion

  // #region load
  /**
   * do something you want before loading
   */
  protected beforeLoad() {
    // noop
  }

  protected async load() {}

  /**
   * do something you want after loading
   */
  protected afterLoad() {
    // noop
  }
  // #endregion

  // #endregion
}

export default LibModel;

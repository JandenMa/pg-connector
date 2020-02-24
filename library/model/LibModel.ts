/******** Library Class Information **********
 *
 * Description: A class for base model
 *
 * Creator: Janden Ma
 *
 * CreatedAt: Feb 23,2020
 *
 * ******************************************/

import { TableType, ModelConstructorArgsType } from '../types';
import { ILibModelArgs, ILibTable } from '../interfaces/ILibModel';
import LibDataAccess from '../data/LibDataAccess';
import LibSQLBuilder from '../data/LibSQLBuilder';

/**
 * Model base
 */
class LibModel {
  // #region Protected Properties
  protected tbls: ILibTable[];
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
      const createSqls = builder.buildCreateTableSQL();
      dataAccess.executeNonQueryWithSqls(createSqls.map(sql => ({ sql })));
    }
  }

  // #region Protected Functions
  protected a() {}
  // #endregion
}

export default LibModel;

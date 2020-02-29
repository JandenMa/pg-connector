# LibDataAccess

> A class to handle executing sqls
>
> All functions below are promise functions
>
> Parameter with `?` means optional



## API

### Single Query

- executeNonQueryWithSql
  - execute single sql return rows count
  - parameter: 
    - args: `object`
      - alias?: `string`
      - sql: `string`
      - replacements?: `any[]`
  - return
    - `Promise<number>`
- executeNonQueryWithSqls
  - execute multiple sql return rows count
  - parameter: 
    - args: `object[]`
      - alias?: `string`
      - sql: `string`
      - replacements?: `any[]`
  - return
    - `Promise<number>`
- executeRowsWithSql
  - execute single sql return rows
  - parameter: 
    - args: `object`
      - alias?: `string`
      - sql: `string`
      - replacements?: `any[]`
  - return
    - `Promise<any[]>`
- executeRowsWithSqls
  - execute multiple sql return rows
  - parameter: 
    - args: `object[]`
      - alias?: `string`
      - sql: `string`
      - replacements?: `any[]`
  - return
    - `Promise<any[]>`

### Transaction

- beginTransaction
  - Begin a transaction
  - parameter: 
    - null
  - return
    - `Promise<void>`
- commitTransaction
  - Commit a transaction
  - parameter: 
    - null
  - return
    - `Promise<void>`
- rollbackTransaction
  - Rollback a transaction
  - parameter: 
    - err: `Error`
  - return
    - `Promise<void>`
- executeTransactionWithSqlParameterized
  - execute transaction with single sql
  - parameter: 
    - args: `object[]`
      - alias?: `string`
      - sql: `string`
      - replacements?: `any[]`
  - return
    - `Promise<any[]>`
- executeTransactionWithSqlsParameterized
  - execute transaction with multi sql
  - parameter: 
    - args: `object[]`
      - alias?: `string`
      - sql: `string`
      - replacements?: `any[]`
  - return
    - `Promise<object>`


# LibModel

> A class for base model
>
> Parameter with `?` means optional



## Constructor

- tables: `object[]`
  - index: `number`, table index, from 0
  - name: `string`, table name, same as data table in database
  - primaryKeys: `string[]`, primary keys (should concern about the order)
  - unique: `string[]`, unique constraint
  - fields: `object[]`
    - name: `string`, field name
    - type: `DataType`, field data type
    - length?: `number`, field max length (only effective for char and varchar)
    - defaultValue?: `number` | `string` | `boolean` | `null` | `JSON`, field default value, if you need set currect date / time as default value, please set 'now'.
    - notNull?: `boolean`, tag if can be null value



## Static Functions

- init
  - will create data table if not exists



## Properties

- tables
  - readonly 
  - Same as tables in Constrcutor



## API

- beforeAddNew
  - do something you want before adding new
  - abstract async function, you should override it in the inherited model
  - will be called automatically before executing `addNew`
- addNew
  - insert into table, async
  - parameters:
    - data: `object` | `any[]`, inserting data. (Object for single table, array for multiple tables)
    - tableIndex: `number`, table index
  - return 
    - `Promise<object>`
- afterAddNew
  - do something you want after adding new
  - abstract async function, you should override it in the inherited model
  - will be called automatically after executing `addNew`
- beforeDelete
  - do something you want before deleting
  - abstract async function, you should override it in the inherited model
  - will be called automatically before executing `delete`
- delete
  - delete from table, async
  - parameter:
    - args: `object`
      - tableIndex: `number`, table index
      - pkValues?: `any[]`, primary key values
      - whereClause?: `string`, where clause
  - return 
    - `Promise<object>`
- afterDelete
  - do something you want after deleting
  - abstract async function, you should override it in the inherited model
  - will be called automatically after executing `delete`
- beforeUpdate
  - do something you want before updating
  - abstract async function, you should override it in the inherited model
  - will be called automatically before executing `update`
- update
  - update table data, async
  - parameter:
    - args: `object`
      - tableIndex: `number`, table index
      - data: data you want to set when update
      - pkValues?: `any[]`, primary key values
      - whereClause?: `string`, where clause
  - return 
    - `Promise<any[]>`
- afterUpdate
  - do something you want after updating
  - abstract async function, you should override it in the inherited model
  - will be called automatically after executing `update`
- beforeLoad
  - do something you want before loading
  - abstract async function, you should override it in the inherited model
  - will be called automatically before executing` load`
- load
  - query table/model data, async
  - parameter:
    - args: `object`
      - selectFields: `string[]` | `'*'`, fields you want to select
      - tableIndex?: `number`, table index, if null or undefined then will query model data
      - pkValues?: `any[]`, primary key values
      - whereClause?: `string`, where clause
      - orderBy? `string`, sort by fields. (Eg: 'id asc, name desc')
      - distinct?: `boolean`, whether distinct, if true will leave 1 row with same data
      - limit?: `number`, query counts. (for pagination, same as rows per page)
      - offset?: `number`, query offset. (for pagination, same as current page) 
  - return 
    - `Promise<any[]>`
- afterLoad
  - do something you want after loading
  - abstract async function, you should override it in the inherited model
  - will be called automatically after executing `load`




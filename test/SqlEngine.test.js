// Unit tests for SqlEngine.js
var SqlEngine = require('../SqlEngine.js');

////////////////////
// Static methods //
////////////////////
test('generateModelDrop', () => {
    expect(SqlEngine.generateModelDrop('example')).
    toBe('DROP TABLE IF EXISTS example;');
});
test('generateJunctionDrop', () => {
    expect(SqlEngine.generateJunctionDrop('parent', 'child')).
    toBe('DROP TABLE IF EXISTS parent_child;');
});

test('single model test', () => {
    let mySqlEngine = new SqlEngine(singleModelData);
    expect(mySqlEngine.generateSqlSchemaDropTables()).
        toEqual(singleModelResult);
});

var singleModelData = {
    "databaseProperties": {
        "idName": "id",
        "idType": "string",
        "varcharLength": 255
    },
    "modelList": [
        {
            "nameSingular": "employee",
            "fields": {
                "name": "string",
                "department": "string",
                "salary": "number"
            }
        }
    ]
};
var singleModelResult = "DROP TABLE IF EXISTS employee;"

// 2 tables, 1 join
var twoModelData = {
    "databaseProperties": {
        "idName": "id",
        "idType": "string",
        "varcharLength": 255
    },
    "modelList": [
        {
            "nameSingular": "kid",
            "fields": {
                "name": "string",
                "grade": "number"
            }
        },
        {
            "nameSingular": "bus",
            "fields": {
                "driverName": "string",
                "captain": "kid",
                "kids": "[kid]"
            }
        }
    ]
};
var twoModelResult = "DROP TABLE IF EXISTS kid;"
    + "\n" + "DROP TABLE IF EXISTS bus;"
    + "\n" + "DROP TABLE IF EXISTS bus_captain;"
    + "\n" + "DROP TABLE IF EXISTS bus_kids;"
;
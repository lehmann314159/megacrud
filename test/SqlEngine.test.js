// Unit tests for SqlEngine.js

var SqlEngine = require('../SqlEngine.js');



test('single model test', () => {
    let mySqlEngine = new SqlEngine();
    expect(mySqlEngine.generateSqlSchemaDropTables(singleModelData)).
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
                "kidList": "[kid]"
            }
        }
    ]
};
var twoModelResult = "DROP TABLE IF EXISTS employee;"


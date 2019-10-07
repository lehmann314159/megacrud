/* The SqlEngine class manages many aspects of using an RDBMS in the system.
 */
var Megacrud = require('./Megacrud.js');

module.exports = class SqlEngine {
    // constructor
	constructor(inData) {
		this.data = inData;
    }

    static generateModelDrop(inTableName) {
        return `DROP TABLE IF EXISTS ${inTableName};`;
    }

    static generateJunctionDrop(inPrefix, inSuffix) {
        return `DROP TABLE IF EXISTS ${inPrefix}_${inSuffix};`;
    }

    ///////////////////////////////
    // Top Level Schema Creation //
    ///////////////////////////////
    generateSchema(inData) {
        if (!inData) { inData = this.data; }
        return this.generateSchemaDrop(inData)
            + this.generateSchemaCreate(inData);
    }

    ///////////////////////////////////////
    // Generates "DROP TABLE" statements //
    ///////////////////////////////////////
    generateSqlSchemaDropTables(inData) {
        if (!inData) { inData = this.data; }

        let sql = "";
        for (var aModel of this.data.modelList) {
            aModel['Xpath'] = aModel.nameSingular;
            sql += SqlEngine.generateModelDrop(aModel.nameSingular);
            Object.keys(aModel.fields).forEach( (aChild) => {
                if (!Megacrud.isJsonPrimitive(aModel.fields[aChild])) {
                    //sql += SqlEngine.generateSqlSchemaDropTables(aModel.fields[aChild]()
                }
            });
        }

        return sql;
    }
}
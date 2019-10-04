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
    generateSqlSchema() {
        return this.generateSqlSchemaDropTables()
            + this.generateSqlSchemaCreateTables();
    }

    ///////////////////////////////////////
    // Generates "DROP TABLE" statements //
    ///////////////////////////////////////
    generateSqlSchemaDropTables() {
        let sql = "";
        for (var aModel of this.data.modelList) {
                aModel['Xpath'] = (inPath) ? `${inPath}_${aModel.nameSingular}`
                    : aModel.nameSingular;
            sql += SqlEngine.generateModelDrop(aModel.nameSingular);
            Object.keys(aModel.fields).forEach( (aChild) => {
                if (!Megacrud.isJsonPrimitive(aModel.fields[aChild])) {
                    sql += SqlEngine.generateJunctionDrop()
                }
            });
        }

        return sql;
    }
}
/* The SqlEngine class manages many aspects of using an RDBMS in the system.
 */

module.exports = class SqlEngine {
    ///////////////////////////////////////////////////////
	// Determines if the passed type is a json primitive //
	///////////////////////////////////////////////////////
	isPrimitive(inType) {
		let type = inType.toLowerCase();
		if ((type == 'boolean')
			|| (type == 'integer')
			|| (type == 'number')
			|| (type == 'string')
		) {
			return true;
		}
		return false;	
    }

    ///////////////////////////////
    // Top Level Schema Creation //
    ///////////////////////////////
    generateSqlSchema(inData) {
        return this.generateSqlSchemaDropTables(inData)
            + this.generateSqlSchemaCreateTables(inData);
    }

    ///////////////////////////////////////
    // Generates "DROP TABLE" statements //
    ///////////////////////////////////////
    generateSqlSchemaDropTables(inData) {
        let sql = "";
        for(const aModel of inData.modelList) {
            sql += `DROP TABLE IF EXISTS ${aModel.nameSingular};`;
        }

        return sql;
    }
}
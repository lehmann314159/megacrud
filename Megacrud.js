module.exports = class Megacrud {
    ////////////////////////////////////////////////////////
    // Determines if the passed type (string) is an array //
    ////////////////////////////////////////////////////////
    static isArrayType(inType) {
        let regex = /^\[*\]$/;
        return regex.test(inType);
    }

    ///////////////////////////////////////////////////////
	// Determines if the passed type is a json primitive //
	///////////////////////////////////////////////////////
    static isJsonPrimitive(inType) {
		let type = inType.toLowerCase();
		if ((type == 'boolean')
			|| (type == 'number')
			|| (type == 'string')
		) {
			return true;
		}
		return false;
    }
};
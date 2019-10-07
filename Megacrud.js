module.exports = class Megacrud {
    ////////////////////////////////////////////////////////
    // Determines if the passed type (string) is an array //
    ////////////////////////////////////////////////////////
    static isArrayType(inType) {
        let regex = /^\[\w*\]$/;
        return regex.test(inType);
    }

    //////////////////////////////////////////////////////
    // Determines if the passed type is an object array //
    //////////////////////////////////////////////////////
    static isObjectArrayType(inType) {
        let regex = /^\[*\]$/;
        if (!Megacrud.isArrayType(inType)) {
            return false;
        }
        let payload = inType.replace('[', '').replace(']', '');
        return !Megacrud.isJsonPrimitive(payload);
    }

    ////////////////////////////////////////////////////////
    // Determines if the passed type is a primitive array //
    ////////////////////////////////////////////////////////
    static isPrimitiveArrayType(inType) {
        let regex = /^\[*\]$/;
        if (!Megacrud.isArrayType(inType)) {
            return false;
        }
        let payload = inType.replace('[', '').replace(']', '');
        return Megacrud.isJsonPrimitive(payload);
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
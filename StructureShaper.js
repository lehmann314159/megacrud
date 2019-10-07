import { isModuleSpecifier } from "@babel/types";

/* The StructureShaper class, well... shapes the original vision of the user's
 * structure and adds a couple of time savers for the internal components that
 * will make use of it.
 */

 module.exports = class StructureShaper {
    // constructor
    constructor(inData) {
        this.data = inData;
        this.setDatabaseDefaults();
        for (let i = 0; i < this.dataModelList.length; i++) {
            this.data.ModelList[i] =
                this.shapeModel(this.dataModelList[i], "");
        }
    }

    // standard getter
    getData() {
        return this.data;
    }

    /////////////////////////////////////////////////////////
    // Grabs the database defaults for later model shaping //
    /////////////////////////////////////////////////////////
    setDatabaseDefaults() {
        let defaults = {
            "softDelete": false,
            "idName": "id",
            "idType": "INT",
            "varCharLength": 255
        };

        for (const aKey in defaults) {
            // Let's be super careful about property propagation
            if (!this.data.databaseProperties.hasOwnProperty(aKey)) {
                this.data.databaseProperties[aKey] = defaults[aKey];
            }
            this[aKey] = this.data.databaseProperties[aKey];
        }
    }

    ///////////////////////////////////////////////////////////
    // Prepares the structure file for easier SQL generation //
    ///////////////////////////////////////////////////////////
    shapeModel(me, inPath) {
        // Establish pathing to current model
        // if inPath is empty, then I'm a model (and an endpoint)
        // Otherwise, I'm an embedded model and need an upward junction
        me.Xpath = (inPath) ? `${inPath}_${me.nameSingular}` : me.nameSingular;

        // Set up underlying junctions
        me.Xjunctions = new Array();

        // For my properties, add junctions
        for (const aKey in me) {
            me.Xjunctions.push(`${me.Xpath}_${aKey.nameSingular}`);
            
            // For properties that are objects or arrays of objects, recurse
            if (Megacrud.isJsonPrimitive(me[aKey])) { continue; }
            if (Megacrud.isPrimitiveArray(me[aKey])) { continue; }

        }
    }
 };
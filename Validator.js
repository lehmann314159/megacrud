// The Validator Class ensures that the structure.json file is well-formed
// and acts as a container for it.  Even though we'll be generating this file
// we want to make sure it's going to have a chance of being successful.

module.exports = class Validator {
	// constructor
	constructor(inputFile) {
		this.inputFile = inputFile;
		if (this.inputFile) {
			this.ingest();
		}
	}

	/////////////////////////////////
	// ingest                      //
	// Side effect: sets this.data //
	/////////////////////////////////
	ingest() {
		let fs = require("fs");

		// check that inputFile is defined
		if (!this.inputFile) {
			return false;
		}

		// check that inputFile exists
		if (!fs.existsSync(this.inputFile)) {
			return false;
		}

		// read inputFile
		this.data = JSON.parse(fs.readFileSync(this.inputFile));
		return true;
	}

	//////////////////////////////
	// Gives access to the data //
	//////////////////////////////
	getData() {
		// checks that data is well formed
		if (!this.isWellFormed()) {
			throw "data is not well formed...";
		}

		return this.data;
	}


	///////////////////////////////////
	// Sees if the data is ok to use //
	///////////////////////////////////
	isWellFormed() {
		let data = this.data;

		// Check OpenAPI Properties
		if (!data.hasOwnProperty('openApiProperties')
			|| !data.openApiProperties.hasOwnProperty('version')
			|| !data.openApiProperties.hasOwnProperty('info')
			|| !data.openApiProperties.info.hasOwnProperty('title')
			|| !data.openApiProperties.info.hasOwnProperty('description')
			|| !data.openApiProperties.info.hasOwnProperty('version')
			|| !data.openApiProperties.info.hasOwnProperty('contact')
			|| !data.openApiProperties.info.contact.hasOwnProperty('email')
			|| !data.hasOwnProperty('mongoProperties')
			|| !data.mongoProperties.hasOwnProperty('serverName')
			|| !data.mongoProperties.hasOwnProperty('collectionName')
			|| !data.hasOwnProperty('nodeProperties')
			|| !data.nodeProperties.hasOwnProperty('serverPort')
		) {
			throw "missing header...\n";
			return false;
		}

		// Check models
		if (!data.hasOwnProperty('modelList')
			|| (!Array.isArray(data.modelList))
		) {
			throw "missing model list...\n";
			return false;
		}

		let modelFieldList = [
			'name', 'modelName', 'refName', 'endpoint', 'idName',
			'idDescription', 'idType', 'fields', 'example'
		];

		for (const model of data.modelList) {
			for (const modelField of modelFieldList) {
				// Check for required properties of the model
				if (!model.hasOwnProperty(modelField))
				{
					throw "missing model property " + modelField + "...\n";
					return false;
				}
			}
		}

		// Everything seems to be ok
		return true;
	}
};

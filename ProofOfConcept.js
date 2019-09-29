// megaCRUD proof of concept

/* Background:

I want to start with well-specified models, and then generate the following:
* OpenAPI specification
* node REST server, tied to...
* SQL database and
* mongo database

*/


/* Long note to remind me of what I came up with
Mongo lets you just map things willy nilly.  SQL is a bit more... stodgy.

So for SQL purposes I'll add ids to everything, figure out to what table each
label refers, and store it.  Here's an example, which leverages the example
objects below...

webRequest is the request object.  This is what the client would send.  It's
tied to the properties of the endpoint, which makes sense.

augmentedRequest holds the pre-processing that we'd do in order to safely
traverse the layered save.

In order for us to save this stuff in SQL, we need table names (which are tied
to the model name) and ids.

So what are these tables?  Let's start with the endpoints themselves.

family
====
id	nickname
101	"Dem Folx"


spouse1, spouse2, and children are non-primitive children, so we'll store them
in different tables.
* I'm adding ordinal to all junction tables, even if they're 1 to 1.  Easier
  to code that way.

family_spouse1
====
id	id1	id2 ordinal
901	101	201	0

person
====
id	name
201	Bob


spouse1 has children, so we will do something similar for them
* children could be girl or boy, so we have to breadcrumb it.
* I'm using full path for the table name and id naming structure, but only
  storing the needed join data (otherwise edits are a nightmare).

family_spouse1_children
====
id	id2	id3	ordinal	tableName3
901	201	301	0		boy


children get a pet, so I'll add one here.

family_spouse1_children_pet
====
id	id3	id4	ordinal
901	301	501	0

cat
====
id	name	volume
501	Ganks	5


The mechanics for spouse2 and children are left as an exercise to the reader.
Afterwards, the tables should look like this:

family
====
id	nickname
101	Dem Folks

family_spouse1
====
id	id1	id2	ordinal
1	101	201	0

family_spouse1_children
====
id	id2	id3	ordinal	tableName3
1	201	301	0		boy

family_spouse1_children_pet
====
id	id3	id4	ordinal
1	301	501	0

family_spouse2
====
id	id1	id2	ordinal
1	101	202	0

family_spouse2_children
====
id	id2	id3	ordinal	tableName3
1	202	401	0		girl

family_spouse2_children_pet
====
id	id3	id4	ordinal
1	401	601	0

family_children
====
id	id1	id2	ordinal	tableName2
1	101	302	0		boy
2	101	402	1		girl

family_children_pet
====
id	id2	id3	ordinal tableName2	tableName3
1	302	502	0		boy			cat
2	402	602	1		girl		dog

person
====
id	name
201	Bob
202	Samantha

boy
====
id	name	dwoob
301	Todd	high
302	Chuckie	low

cat
====
id	name	volume
501	Ganks	5
502	Lucky	3

girl
====
id	name	flurb
401	Tina	medium
402	Stevie	high

dog
====
id	name	volume
601	Nix		7
602	Chewy	8

NOTES:
====
1. In doing this exercise it occurs to me that there is a performance benefit
   to denormalizing 1:1 relationships.  I might look at that in a future
   iteration, but for now it breaks the recursive aspects of what I'm doing.
   It's kind of a depth-first way of looking at things.

2. family_children_pet is kind of a problem.  children is an array of boy|girl.
   boy has cat, girl has dog.  Neither is ambiguous by designation, but are
   effectively ambiguous because of the upstream ambiguity.  I could solve this
   generally by listing the tablename for each part of the join, but I don't
   know if there are any distros of mysql that will let you use column names to
   set joins without a second query.

   That said, this is less of a problem for straight writes than it is for
   analysis.  Standard reads will be handled by the mongo datastore.

3. Right now I don't try to distinguish between a POST and a PUT.  I assume that
   the thing to do is to nuke everything in orbit, and then re-populate.  One
   clear and (maybe?) easy optimization is to avoid some of the empty deletes
   when we know that the top level is an insert.  But speed is less important
   than correctness at this stage.

*/

/* Recursive base function
 * =======================
 * 1. Save local primitive fields
 * 2. Clear any joins (and the linked children)
 * 3. Save (and add a junction for) all object fields
 * 4. Iterate through all list fields.  For each:
 *    a) If a primitive, save in the lookup table
 *    b) If an object, save as such
 */

 // Top-level recursive save function
function save(inObject) {
	// save primitive properties
	saveMyself(inObject);

	// clear out links to complex properties (and child rows)
	clearChildrenAndLinks(inObject);

    // recurse to children objects
    for (var key in inObject) {
        if (typeof(inObject[key]) != "object") { continue; }

        // Only arrays and objects get to this point
        // So let's check for arrayness
        if (Array.isArray(inObject[key])) {
            for (let i = 0; i < inObject[key].length; i++) {
			    if (typeof(inObject[key][i]) == 'object') {
                    // Strictly speaking this could be an array or an object, but we
                    // don't support arrays of array
				    inObject[key][i].id =
                        saveChildObject(inObject[key][i], i, inObject.id);
			    } else {
                    // Primitives don't have anywhere to store their path, so we will
                    // construct it and pass it
                    let newEndpoint = inObject.Xpath + "_" + key;
				    saveChildPrimitive(inObject[key][i], i, newEndpoint, inObject.id);
			    }
	        }
        } else { // object, not array
		    saveChildObject(inObject[key], 0, inObject.id);
        }
    }
}

function saveChildObject(inChild, inOrdinal, inParentId) {
    // recurse the object qua object
    save(inChild);

    // Save links to parent
    insertSql(inChild.Xpath, "pid, cid, ordinal",
		`${inParentId}, ${inChild.id}, ${inOrdinal}`);
}

function saveChildPrimitive(inValue, inOrdinal, inTableName, inParentId) {
    // Save to the weighted junction table
	insertSql(inTableName, "pid, ordinal, value",
		`${inParentId}, ${inOrdinal}, ${inValue}`);
}

function saveMyself(inObject) {
    let keyList = new Array();
    let valueList = new Array();
	// Iterate over the object's properties, looking for primitives
    for (var key in inObject) {
        if (
            (typeof(inObject[key]) == "function")
            || (typeof(inObject[key]) == "object")
            || (typeof(inObject[key]) == "symbol")
			|| (typeof(inObject[key]) == "undefined")
			// We want to exclude primitive metas that we've added
			|| (key == "XmodelName")
			|| (key == "Xpath")
        ) { continue; }
        keyList.push(key);
        valueList.push(`'${inObject[key]}'`);
    }
    inObject.id = insertSql(inObject.XmodelName, keyList.join(), valueList.join());
}

function clearChildrenAndLinks(inParent) {
    Object.keys(inParent).forEach( (aChild) => {
        // Only object and array properties will have junction tables
        if (typeof(inParent[aChild]) == "object") {
			// Look for arrays first [array items could be primitives or objects
    	    // Then handle single objects
			if (Array.isArray(inParent[aChild])) {
            	// Array
	            inParent[aChild].forEach( (item) => {
    	            // If the child is an object, remove from the model table
        	        if (typeof(item) == 'object') {
						clearChildModelByParentId(item.XmodelName, item.Xpath, inParent.id);
						deleteSql(item.Xpath, {"pid": inParent.id});
					} else { // primitive
						let tempPath = inParent.Xpath + "_" + aChild;
						deleteSql(tempPath, {"pid": inParent.id, "value": item});
					}
            	});
        	} else {
        	    // Object
				clearChildModelByParentId(inParent[aChild].XmodelName,
					inParent[aChild].Xpath, inParent.id);
				deleteSql(inParent[aChild].Xpath, {"pid": inParent.id});
        	}
		}
	});
}

function clearChildModelByParentId(inModelName, inPath, inParentId) {
	let subquery = `SELECT cid FROM ${inPath} WHERE pid = ${inParentId}`;
	let query = `DELETE FROM ${inModelName} WHERE id IN (${subquery});`;
	console.log(query);
}

function insertSql(inTableName, inKeyString, inValueString) {
    let query = `INSERT INTO ${inTableName} (${inKeyString}) VALUES (${inValueString});`;
    console.log(query);
    return Math.round(Math.random() * 10000);
}

function deleteSql(inTableName, inCriteria) {
	let clause = Object.keys(inCriteria)
		.map(key => `${key} = '${inCriteria[key]}'`).join(" AND ");
	let query = `DELETE FROM ${inTableName} WHERE ${clause};`;
	console.log(query);
}

var structure = {
	"dbProps": {
		"idName": "id"
	},
	"models": {
		"cat": {
			"name": "string",
			"volume": "number"
		},
		"dog": {
			"name": "string",
			"volume": "number"
		},
		"boy": {
			"name": "string",
			"dwoob": "string",
			"pet": "cat"
		},
		"girl": {
			"name": "string",
			"flurb": "string",
			"pet": "dog"
		},
		"person": {
			"name": "string",
			"children": "[boy|girl]"
		},
		"family": {
			"nickname": "string",
			"luckyNumbers": "[number]",
			"spouse1": "person",
			"spouse2": "person",
			"children": "[boy|girl]"
		}
	}
};

var webRequest = {
	"family": {
		"nickname": "Dem Folx",
        "luckyNumbers": [1, 2, 3, 5, 7, 11, 13],
		"spouse1": {
			"name": "Bob",
			"children": [
				{
					"XmodelName": "boy",
					"name": "Todd",
					"dwoob": "high",
					"pet": {
						"XmodelName": "cat",
						"name": "Ganks",
						"volume": 5
					}
				}
			]
		},
		"spouse2": {
			"name": "Samantha",
			"children": [
				{
					"XmodelName": "girl",
					"name": "Tina",
					"flurb": "medium",
					"pet": {
						"XmodelName": "dog",
						"name": "Nix",
						"volume": 7
					}
				}
			]
		},
		"children": [
			{
				"XmodelName": "boy",
				"name": "Chuckie",
				"dwoob": "low",
				"pet": {
					"XmodelName": "cat",
					"name": "Lucky",
					"volume": 3
				}
			},
			{
				"XmodelName": "girl",
				"name": "Stevie",
				"flurb": "string",
				"pet": {
					"XmodelName": "dog",
					"name": "Chewy",
					"volume": 8
				}
			}
		]
	}
};

var augmentedRequest = {
	"family": {
		"id": 101,
		"XmodelName": "family",
        "Xpath": "family",
		"nickname": "Dem Folx",
        "luckyNumbers": [1, 2, 3, 5, 7, 11, 13],
		"spouse1": {
			"id": 201,
			"XmodelName": "person",
            "Xpath": "family_spouse1",
			"name": "Bob",
			"children": [
				{
					"id": 301,
					"XmodelName": "boy",
					"Xpath": "family_spouse1_children",
					"name": "Todd",
					"dwoob": "high",
					"pet": {
						"id": 501,
						"XmodelName": "cat",
						"Xpath": "family_spouse1_children_pet",
						"name": "Ganks",
						"volume": 5
					}
				}
			]
		},
		"spouse2": {
			"id": 202,
			"XmodelName": "person",
			"Xpath": "family_spouse2",
			"name": "Samantha",
			"children": [
				{
					"id": 401,
					"XmodelName": "girl",
					"Xpath": "family_spouse2_children",
					"name": "Tina",
					"flurb": "medium",
					"pet": {
						"id": 601,
						"XmodelName": "dog",
						"Xpath": "family_spouse1_children_pet",
						"name": "Nix",
						"volume": 7
					}
				}
			]
		},
		"children": [
			{
				"id": 302,
				"XmodelName": "boy",
				"Xpath": "family_children",
				"name": "Chuckie",
				"dwoob": "low",
				"pet": {
					"id": 502,
					"XmodelName": "cat",
					"Xpath": "family_children_pet",
					"name": "Lucky",
					"volume": 3
				}
			},
			{
				"id": 402,
				"XmodelName": "girl",
				"Xpath": "family_children",
				"name": "Stevie",
				"flurb": "high",
				"pet": {
					"id": 602,
					"XmodelName": "dog",
					"Xpath": "family_children_pet",
					"name": "Chewy",
					"volume": 8
				}
			}
		]
	}
};

save(augmentedRequest['family']);

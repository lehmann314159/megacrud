/* Unit Tests for StructureValidator.js
 * Yes, I know that by using special structure files that I'm doing integrative
 * tests rather than strict unit tests.  But for real... fs is a pretty stout
 * library.
 */

var StructureValidator = require('../StructureValidator.js');

test('good.json should work', () => {
    let goodVal = new StructureValidator('good.json');
    expect(goodVal.isWellFormed()).toBe(true);
});

test('badOpenApi.json should throw', () => {
    let badVal = new StructureValidator('badOpenApi.json');
    expect(() => {badVal.isWellFormed(); }).toThrow(Error);
});

test('badMongo.json should throw', () => {
    let badVal = new StructureValidator('badMongo.json');
    expect(() => {badVal.isWellFormed(); }).toThrow(Error);
});

test('badNode.json should throw', () => {
    let badVal = new StructureValidator('badNode.json');
    expect(() => {badVal.isWellFormed(); }).toThrow(Error);
});

test('badDatabase.json should throw', () => {
    let badVal = new StructureValidator('badDatabase.json');
    expect(() => {badVal.isWellFormed(); }).toThrow(Error);
});

test('badModel.json should throw', () => {
    let badVal = new StructureValidator('badModel.json');
    expect(() => {badVal.isWellFormed(); }).toThrow(Error);
});

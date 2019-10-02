/* Unit Tests for Validator.js
 * Yes, I know that by using special structure files that I'm doing integrative
 * tests rather than strict unit tests.  But for real... fs is a pretty stout
 * library.
 */

var Validator = require('../Validator.js');

test('good.json should work', () => {
    let goodVal = new Validator('good.json');
    expect(goodVal.isWellFormed()).toBe(true);
});

test('badOpenApi.json should throw', () => {
    let badVal = new Validator('badOpenApi.json');
    expect(() => {badVal.isWellFormed(); }).toThrow(Error);
});
/*
test('badMongo.json should throw', () => {
    let badVal = new Validator('badMongo.json');
    expect(badVal.isWellFormed()).toThrow(Error);
});

test('badNode.json should throw', () => {
    let badVal = new Validator('badNode.json');
    expect(badVal.isWellFormed()).toThrow(Error);
});

test('badDatabase.json should throw', () => {
    let badVal = new Validator('badDatabase.json');
    expect(badVal.isWellFormed()).toThrow(Error);
});

test('badModel.json should throw', () => {
    let badVal = new Validator('badModel.json');
    expect(badVal.isWellFormed()).toThrow(Error);
});
*/

// Unit tests for Megacrud.js (Utility class)
var Megacrud = require('../Megacrud.js');

/////////////////
// isArrayType //
/////////////////
test('isArrayTest for primitive', () => {
    expect(Megacrud.isArrayType('type')).toBe(false);
});
test('isArrayTest for array', () => {
    expect(Megacrud.isArrayType('[type]')).toBe(false);
});

/////////////////////
// isJsonPrimitive //
/////////////////////
test('isJsonPrimitive for boolean', () => {
    expect(Megacrud.isJsonPrimitive('boolean')).toBe(true);
});
test('isJsonPrimitive for number', () => {
    expect(Megacrud.isJsonPrimitive('number')).toBe(true);
});
test('isJsonPrimitive for string', () => {
    expect(Megacrud.isJsonPrimitive('string')).toBe(true);
});
test('isJsonPrimitive for customClass', () => {
    expect(Megacrud.isJsonPrimitive('customClass')).toBe(false);
});
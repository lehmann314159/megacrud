// Unit tests for Megacrud.js (Utility class)
var Megacrud = require('../Megacrud.js');

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

/////////////////
// isArrayType //
/////////////////
test('isArrayType for primitive', () => {
    expect(Megacrud.isArrayType('type')).toBe(false);
});
test('isArrayType for array', () => {
    expect(Megacrud.isArrayType('[type]')).toBe(true);
});

///////////////////////
// isObjectArrayType //
///////////////////////
test('isObjectArrayType for primitive', () => {
    expect(Megacrud.isObjectArrayType('string')).toBe(false);
});
test('isObjectArrayType for object', () => {
    expect(Megacrud.isObjectArrayType('toyota')).toBe(false);
});
test('isObjectArrayType for array of primitive', () => {
    expect(Megacrud.isObjectArrayType('[string]')).toBe(false);
});
test('isObjectArrayType for array of object', () => {
    expect(Megacrud.isObjectArrayType('[toyota]')).toBe(true);
});

/////////////////////////
// isPrimitveArrayType //
/////////////////////////
test('isPrimitiveArrayType for primitive', () => {
    expect(Megacrud.isPrimitiveArrayType('string')).toBe(false);
});
test('isPrimitiveArrayType for object', () => {
    expect(Megacrud.isPrimitiveArrayType('toyota')).toBe(false);
});
test('isPrimitiveArrayType for array of primitive', () => {
    expect(Megacrud.isPrimitiveArrayType('[string]')).toBe(true);
});
test('isPrimitiveArrayType for array of object', () => {
    expect(Megacrud.isPrimitiveArrayType('[toyota]')).toBe(false);
});
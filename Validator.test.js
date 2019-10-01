/* Unit Tests for Validator.js
 * Yes, I know that by using special structure files that I'm doing integrative
 * tests rather than strict unit tests.  But for real... fs is a pretty stout
 * library.
 */

test('good.json should work', () => {
    let Validator = require('./Validator.js');
    let goodVal = new Validator('good.json');
    expect(goodVal.isWellFormed()).toBe(true);
});

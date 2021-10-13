/* eslint-disable no-undef */
import MyQRCode from '../src/myQRCode';

// const myQRCode = new MyQRCode();

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });
});

describe('"MyQRCode" Class methods Test', () => {
  describe('CreateInt method Test', () => {
    it('Should convert to binary', () => {
      expect(MyQRCode.createInt(1)).toBe('0001');
      expect(MyQRCode.createInt(12345678)).toBe('000111101101110010001001110');
    });
  });

  describe('CreateStr method Test', () => {
    it('Should convert to binary', () => {
      expect(MyQRCode.createStr('HELLO')).toBe('0110000101101111000110011000');
      // expect(MyQRCode.createStr('hello world')).toBe('0110000101101111000110100010111001011011100010011010100001101');
    });
  });

  describe('GenerateServiceFields method Test', () => {
    it('Data type "number", user data 800, correction level "M"', () => {
      expect(MyQRCode.generateServiceFields('number', 800, 'M')).toEqual({
        dataTypeBinary: '0001',
        userDataSizeBinary: '0000000011',
      });
    });
    it('Data type "number", user data size 1234567887, correction level "L"', () => {
      expect(MyQRCode.generateServiceFields('number', 1234567887, 'L')).toEqual({
        dataTypeBinary: '0001',
        userDataSizeBinary: '0000001010',
      });
    });
    it('Data type "alphanum", user data size "HELLO WORLD TEST STRING 1223321", correction level "H"', () => {
      expect(MyQRCode.generateServiceFields('alphanum', 'HELLO WORLD TEST STRING 1223321', 'H')).toEqual({
        dataTypeBinary: '0010',
        userDataSizeBinary: '000011111',
      });
    });
  });
});

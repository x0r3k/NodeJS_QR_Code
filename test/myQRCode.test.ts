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
      expect(MyQRCode.createStr('HELLO')).toBe('00100000001010110000101101111000110011000000000011101100000100011110110000010001111011000001000111101100000100011110110000010001');
    });
  });

  describe('GenerateServiceFields method Test', () => {
    it('Data type "number", user data 800, correction level "M"', () => {
      expect(MyQRCode.generateServiceFields('number', 3, 10, 'M')).toEqual({
        dataTypeBinary: '0001',
        pickedVersion: 1,
        userDataSizeBinary: '0000000011',
      });
    });
    it('Data type "number", user data 1234567887, correction level "L"', () => {
      expect(MyQRCode.generateServiceFields('number', 10, 34, 'L')).toEqual({
        dataTypeBinary: '0001',
        pickedVersion: 1,
        userDataSizeBinary: '0000001010',
      });
    });
    it('Data type "alphanum", user data "HELLO WORLD TEST STRING 1223321", correction level "H"', () => {
      expect(MyQRCode.generateServiceFields('alphanum', 31, 171, 'H')).toEqual({
        dataTypeBinary: '0010',
        pickedVersion: 3,
        userDataSizeBinary: '000011111',
      });
    });
  });
});

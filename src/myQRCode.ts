import MyQRCodeUtils from './myQRCodeUtils';
import MyUtils from './myUtils';

import {
  TDataTypeValues, TCorrectionLevel, TUserDataTypes, TQRCodeOptions,
} from './interfaces/interfaces';

export default class MyQRCode {
  /**
   * Converts number data to proper view.
   *
   * Splits data to array of triplets
   * (triplet - integer with max three symbols, could be less if it is last characters of parameter).
   * Each triplet converted to Binary (Binary - integer in binary code represented as string).
   * Length of binary string determined by triplet length:

   * Triplet has 3 characters (full triplet) - binary length would be 10 characters
   *
   * Triplet has 2 characters - 7 characters
   *
   * Triplet has 1 character - 4 characters
   *
   * @param data data in number format
   * @returns If array of triplets is empty - return null. Else return data as binary string
   */
  public static codeNumber(data: number): string | null {
    const paramChunks = data.toString().match(/.{1,3}/g);
    if (paramChunks) {
      return paramChunks.map((item) => {
        let processedItem: number|string = Number(item);
        let totalBinaryLength = 0;
        switch (item.length) {
          case 1:
            totalBinaryLength = 4;
            break;
          case 2:
            totalBinaryLength = 7;
            break;
          case 3:
          default:
            totalBinaryLength = 10;
        }
        processedItem = MyUtils.convertIntToBinary(processedItem);
        processedItem = MyUtils.fillBinaryString(processedItem, totalBinaryLength);
        return processedItem;
      }).join('');
    }
    return null;
  }

  /**
   * Converts alphanum data to binary view.
   *
   * Splits data to array of duplets
   * (duplet - string with max two symbols, could be less if it is last character of data).
   * Each duplet converted to Binary (Binary - integer in binary code represented as string).
   * Length of binary string determined by triplet length:
   *
   * Duplet has 2 characters - 11 characters
   *
   * Duplet has 1 character - 6 characters
   *
   * @param data data in alphanum format
   * @returns If array of duplets is empty - return null. Else return data as binary string
   */
  public static codeString(data: string): string | null {
    if (typeof data !== 'string') throw new Error('Data should be string');

    if (!data.length) throw new Error('Data is empty'); // maybe it can be empty??

    // eslint-disable-next-line no-useless-escape
    if (!/^[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-.\/:]*$/g.test(data)) throw new Error('Data has non allowed characters');

    const paramChunks = data.toString().match(/.{1,2}/g);
    if (paramChunks) {
      return paramChunks.map((item) => {
        let processedItem: string|number = '';
        if (item.length === 2) {
          const totalBinaryLength = 11;
          const itemChars = item.split('');
          processedItem = MyQRCodeUtils.symbolCodeDictionary[itemChars[0]] * 45 + MyQRCodeUtils.symbolCodeDictionary[itemChars[1]];
          processedItem = MyUtils.convertIntToBinary(processedItem);
          processedItem = MyUtils.fillBinaryString(processedItem, totalBinaryLength);
        } else {
          const totalBinaryLength = 6;
          processedItem = MyUtils.convertIntToBinary(MyQRCodeUtils.symbolCodeDictionary[item]);
          processedItem = MyUtils.fillBinaryString(processedItem, totalBinaryLength);
        }
        return processedItem;
      }).join('');
    }
    return null;
  }

  // FIXME: write more tests for this function
  /**
   * Generate bits of service data: data type bits and user data size bits
   * @param dataType Type of data for QR Code
   * @param userDataSize Size of user data in bytes. For 'number' and 'alphanum' its amount of characters,
   * for 'bytes' its number of bytes
   * @param userBinaryDataSize Size (length) of user data converted to binary string
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @returns object with data type bits and user data size bits
   */
  public static generateServiceFields(dataType: TDataTypeValues, userDataSize: number, userBinaryDataSize: number, correctionLevel: TCorrectionLevel) {
    const result = {
      dataTypeBinary: '',
      userDataSizeBinary: '',
    };

    // Calc dataTypeBinary
    switch (dataType) {
      case 'number':
        result.dataTypeBinary = '0001';
        break;
      case 'alphanum':
        result.dataTypeBinary = '0010';
        break;
      case 'bytes':
        result.dataTypeBinary = '0100';
        break;
      default:
        result.dataTypeBinary = '';
    }

    // Calc userDataSizeBinary:
    // #1 get version for user + service data
    const { [correctionLevel]: version } = MyQRCodeUtils.getVersionForDataSize(userBinaryDataSize, correctionLevel, dataType);
    // #2 check if suitable version was found
    if (typeof version === 'undefined' || version === -1) throw new Error('Suitable version not found');
    // #3 calc binary length for service user data
    const serviceUserDataSize = MyQRCodeUtils.getServiceUserDataSize(version!, dataType);
    // #4 generate binary string for service user data size
    result.userDataSizeBinary = MyUtils.convertIntToBinary(userDataSize);
    result.userDataSizeBinary = MyUtils.fillBinaryString(result.userDataSizeBinary, serviceUserDataSize);
    return result;
  }

  public static createInt(data: number, options?: TQRCodeOptions): string | null {
    const intChunks = MyQRCode.codeNumber(data);
    return intChunks;
  }

  public static createStr(data: string, options?: TQRCodeOptions): string | null {
    const userDataBinary = this.codeString(data);
    if (!userDataBinary) return 'Empty string does not supports yet';
    const correctionLevel = options?.correctionLevel || 'M';
    const userDataSize = MyQRCodeUtils.getUserDataSize('alphanum', data);

    const serviceData = this.generateServiceFields('alphanum', userDataSize, userDataBinary.length, correctionLevel);
    return `${serviceData.dataTypeBinary}${serviceData.userDataSizeBinary}${userDataBinary}`;
  }
}

import MyQRCodeUtils from './myQRCodeUtils';
import MyUtils from './myUtils';

import {
  TDataTypeValues, TCorrectionLevel, TUserDataTypes,
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
   * @returns If array of triplets is empty - return null. Else return array of triplets
   */
  private static codeNumber(data: number): string | null {
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

  private static codeString(data: string): string | null {
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

  // FIXME: function too difficult, many duplicated lines of code
  // FIXME: write more tests for this function
  /**
   * Generate bits of service data: data type bits and user data size bits
   * @param dataType Type of data for QR Code
   * @param userData User data that should be stored in QR Code
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @returns object with data type bits and user data size bits
   */
  public static generateServiceFields(dataType: TDataTypeValues, userData: TUserDataTypes, correctionLevel: TCorrectionLevel) {
    const result = {
      dataTypeBinary: '',
      userDataSizeBinary: '',
    };

    let userDataSize = 0;

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

    if (typeof userData === 'string') userDataSize = userData.length;
    else if (typeof userData === 'number') userDataSize = userData.toString().length;

    // #1 - estimate version for correctionLevel + userDataSize
    let { [correctionLevel]: estimatedVersion } = MyQRCodeUtils.getVersionForDataSize(userDataSize, correctionLevel);
    if (typeof estimatedVersion === 'undefined') throw new Error('Something went wrong'); // remove 'undefined' datatype of version
    if (estimatedVersion === -1) throw new Error('User data size too big');
    // #2 - get serviceUserDataSize by estimated version and dataType
    let serviceUserDataSize = MyQRCodeUtils.getServiceUserDataSize(estimatedVersion, dataType);
    // #3 calc dataSize = userDataSize + serviceDataSize
    let estimateDataSize = userDataSize + serviceUserDataSize + 4; // 4 for constant-sized of service data type
    // #4 check if totalDataSize fits in chosen category

    // #4.1 if fits then leave this version and return versionDataSize
    // #4.2 else get next version and update versionDataSize
    if (estimateDataSize <= MyQRCodeUtils.getNumberOfBits(correctionLevel, estimatedVersion)) {
      result.userDataSizeBinary = MyUtils.convertIntToBinary(userDataSize);
      result.userDataSizeBinary = MyUtils.fillBinaryString(result.userDataSizeBinary, serviceUserDataSize);
    } else {
      // increment version
      estimatedVersion += 1;
      // check if this version exists
      if (MyQRCodeUtils.versionRange.max < estimatedVersion) throw new Error('QR Code version is out of range');
      // update info about serviceUserDataSize
      serviceUserDataSize = MyQRCodeUtils.getServiceUserDataSize(estimatedVersion, dataType);
      estimateDataSize = userDataSize + serviceUserDataSize + 4;
      // update result
      result.userDataSizeBinary = MyUtils.convertIntToBinary(userDataSize);
      result.userDataSizeBinary = MyUtils.fillBinaryString(result.userDataSizeBinary, serviceUserDataSize);
    }

    return result;
  }

  public static createInt(data: number): string | null {
    const intChunks = MyQRCode.codeNumber(data);
    return intChunks;
  }

  public static createStr(data: string): string | null {
    const strChunks = MyQRCode.codeString(data);
    return strChunks;
  }
}

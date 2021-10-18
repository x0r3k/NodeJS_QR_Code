import MyQRCodeUtils from './myQRCodeUtils';
import MyQRCodeConstants from './QRConstants';
import MyUtils from './myUtils';

import {
  TDataTypeValues, TCorrectionLevel, TQRCodeOptions,
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
  public static codeAlphanum(data: string): string | null {
    const { symbolCodeDictionary } = MyQRCodeConstants;

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
          processedItem = symbolCodeDictionary[itemChars[0]] * 45 + symbolCodeDictionary[itemChars[1]];
          processedItem = MyUtils.convertIntToBinary(processedItem);
          processedItem = MyUtils.fillBinaryString(processedItem, totalBinaryLength);
        } else {
          const totalBinaryLength = 6;
          processedItem = MyUtils.convertIntToBinary(symbolCodeDictionary[item]);
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
   * @returns object with data type bits, user data size bits and chosen QR Code version
   */
  public static generateServiceFields(dataType: TDataTypeValues, userDataSize: number, userBinaryDataSize: number, correctionLevel: TCorrectionLevel) {
    const result = {
      dataTypeBinary: '',
      userDataSizeBinary: '',
      pickedVersion: 0,
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
    result.pickedVersion = version;
    // #3 calc binary length for service user data
    const serviceUserDataSize = MyQRCodeUtils.getServiceUserDataSize(version!, dataType);
    // #4 generate binary string for service user data size
    result.userDataSizeBinary = MyUtils.convertIntToBinary(userDataSize);
    result.userDataSizeBinary = MyUtils.fillBinaryString(result.userDataSizeBinary, serviceUserDataSize);
    return result;
  }

  /**
   * Fills last byte of binary data string with zeros if it needed
   * (if last byte is not full, e.g 01011 -> 01011 000).
   * After filling last byte, function fills binary data string with mock bytes until
   * length of binary data string will be equal to chosen "Version-CorrectionLevel" max capacity
   * @param binaryData All data (user + service) as binary string
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param version Version of QR Code. Range 1-40
   * @returns
   */
  public static fillBinaryData(binaryData: string, correctionLevel: TCorrectionLevel, version: number) {
    const mockBytes = {
      1: '11101100',
      2: '00010001',
    };
    if (binaryData.length === 0) throw new Error('No binary data');
    const byteRemainder = 8 - (binaryData.length % 8);
    if (byteRemainder !== 0) binaryData += '0'.repeat(byteRemainder); // fill last byte with zeros
    const qrCodeDataCapacity = MyQRCodeUtils.getNumberOfBits(correctionLevel, version);

    let fillIndex = 0;
    while (binaryData.length < qrCodeDataCapacity) {
      if (fillIndex === 0) {
        binaryData += mockBytes[1];
        fillIndex = 1;
      } else {
        binaryData += mockBytes[2];
        fillIndex = 0;
      }
    }
    return binaryData;
  }

  /**
   * Splits all prepared data (user + service) to data blocks.
   *
   * Amount of blocks calculates with correction level and version.
   * All blocks contain equal amount of data bytes. If data cannot be divided equeally
   * then some last blocks store extra byte of data.
   * @param data Data as binary string
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param version Version of QR Code. Range 1-40
   * @returns Array with data blocks
   */
  public static divideDataToBlocks(data: string, correctionLevel: TCorrectionLevel, version: number) {
    const { NumberOfBlocks } = MyQRCodeConstants;
    // get number of bytes in data
    const dataBytesNumber = data.length / 8;
    // get number of blocks by which to divide the data
    const blocksAmount = NumberOfBlocks[correctionLevel][version];
    // calculate number of data blocks that will be overfilled
    // (it means that dataBytes will not be divided equally among blocks)
    const overfilledBlocksAmount = dataBytesNumber % blocksAmount;
    // get minimal amount of data bytes in block
    const bytesInBlock = Math.floor(dataBytesNumber / blocksAmount);
    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < blocksAmount; i++) {
      // check if block should get extra byte of data
      const isOverfilledBlock = i + 1 + overfilledBlocksAmount > blocksAmount;
      // calc index in data string to slice part of data for block
      const endOfBlockData = isOverfilledBlock ? (bytesInBlock + 8) * 8 : bytesInBlock * 8;
      const blockData = data.slice(0, endOfBlockData);
      // update data by removing sliced data
      data = data.slice(endOfBlockData);
      result.push(blockData);
    }
    return result;
  }

  public static createCorrectionBytes(dataBlocks: Array<string>) {
    return [];
  }

  public static createInt(data: number): string | null {
    const intChunks = MyQRCode.codeNumber(data);
    return intChunks;
  }

  public static createStr(data: string, options?: TQRCodeOptions): string | null {
    const { defaultCorrectionLevel } = MyQRCodeConstants;
    const correctionLevel = options?.correctionLevel || defaultCorrectionLevel;

    const userBinaryData = this.codeAlphanum(data);
    if (!userBinaryData) return 'Empty string does not supports yet';

    const userDataSize = MyQRCodeUtils.getUserDataSize('alphanum', data);

    const { dataTypeBinary, userDataSizeBinary, pickedVersion } = this.generateServiceFields('alphanum', userDataSize, userBinaryData.length, correctionLevel);
    const binaryData = `${dataTypeBinary}${userDataSizeBinary}${userBinaryData}`;
    const filledBinaryData = this.fillBinaryData(binaryData, correctionLevel, pickedVersion);
    // console.dir({
    //   correctionLevel,
    //   data,
    //   userBinaryData,
    //   userBDL: userBinaryData.length,
    //   binaryData,
    //   BDL: binaryData.length,
    //   version: pickedVersion,
    // });
    const dataBlocks = this.divideDataToBlocks(filledBinaryData, correctionLevel, pickedVersion);
    return filledBinaryData;
  }
}

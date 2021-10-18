import {
  TCorrectionLevel,
  TMaxDataValue,
  TDataTypeValues,
  TVersionGroupIds,
  TVersionGroups,
  TUserDataTypes,
} from './interfaces/interfaces';

import MyQRCodeConstants from './QRConstants';

// Common utils that relateto QR Code generation flow only
export default class MyQRCodeUtils {
  /**
   * Get data capacity by values of correction level and version of QR Code
   *
   * If params are out of range or value method throws error.
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param version Version of QR Code. Range 1-40
   * @returns Data capacity for chosen Correction-Version pair
   */
  public static getNumberOfBits(correctionLevel: TCorrectionLevel, version: number): number {
    const { correctionLevel: correctionLevelConst, versionRange, maxDataMatrix } = MyQRCodeConstants;

    if (!correctionLevelConst.includes(correctionLevel)) throw new Error('Wrong correction level value');
    if (version < versionRange.min || version > versionRange.max) throw new Error('Wrong version value');
    version -= 1; // transform version value to index in array;
    if (!maxDataMatrix[correctionLevel][version]) throw new Error('Something went wrong');
    return maxDataMatrix[correctionLevel][version];
  }

  /**
   * Simple method to transform QR Code version in required format: 'index' ('i') format
   * or 'value' ('v').
   *
   * Format param defines format of first parameter - version. If format === 'i'
   * then version passed as array index and will be transformed to QR Code version value.
   * If format === 'v' then version passed as QR Code version value and will be transformed
   * to index of array
   * @param version Value of version
   * @param format Initial format of 'version' param
   * @returns version in new format
   */
  public static convertVersion(version: number, format: string = 'i'): number {
    switch (format) {
      case 'i':
        return version - 1;
      case 'v':
        return version + 1;
      default:
        return -1;
    }
  }

  /**
   * Returns the value of minimal required QR Code version to store the data.
   *
   * If correcton level param passed then returns version only for passed correction level,
   * otherwise returns version to all existing levels.
   *
   * If a varsion that fits the size of data not found then it returns -1.
   * @param dataSize Size of data in bits
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param dataType Type of user data. Its should be passed only
   * if 'dataSize' param defines size of userData and needed to calculate serviceData size
   * @returns
   */
  public static getVersionForDataSize(dataSize: number, correctionLevel?: TCorrectionLevel, dataType?: TDataTypeValues): TMaxDataValue {
    const { correctionLevel: correctionLevelConst, maxDataMatrix, versionRange } = MyQRCodeConstants;

    const result: TMaxDataValue = {};
    if (correctionLevel) {
      result[correctionLevel] = maxDataMatrix[correctionLevel].findIndex((item) => item >= dataSize);
    } else {
      correctionLevelConst.forEach((level) => {
        result[level] = maxDataMatrix[level].findIndex((item) => item >= dataSize);
      });
    }

    const resultKeys = Object.keys(result) as Array<keyof TMaxDataValue>;
    resultKeys.forEach((level) => {
      // if version not found then skip
      if (typeof result[level] === 'undefined' || result[level] === -1) return;
      // if datasize includes only user data then get service data size
      if (typeof dataType !== 'undefined') {
        // get service data for chosen version
        const serviceData = this.getServiceUserDataSize(this.convertVersion(result[level]!, 'v'), dataType);
        dataSize = dataSize + serviceData + 4; // recalc total datasize for storing
        // if version cannot store this size of data then increment version
        if (!this.canDataBeStored(dataSize, level, this.convertVersion(result[level]!, 'v'))) result[level]! += 1;
      }
      // transform version array index to normal value of version
      result[level] = this.convertVersion(result[level]!, 'v');
      // if result version is bigger than max version value - reset to -1
      if (result[level]! > versionRange.max) result[level] = -1;
    });
    return result;
  }

  /**
   * Checks if dataSize can be fully stored in QR Code without any loses.
   *
   * It checks either with passed parameters correctionLevel and version or for all suitable level-version pairs.
   * @param dataSize Size of data in bits
   * @param correctionLevel Correction level. Values: ['L', 'M', 'Q', 'H'];
   * @param version Version of QR Code. Range 1-40
   * @returns
   */
  public static canDataBeStored(dataSize: number, correctionLevel?: TCorrectionLevel, version?: number): boolean {
    const { correctionLevel: correctionLevelConst, versionRange } = MyQRCodeConstants;

    if (correctionLevel && !correctionLevelConst.includes(correctionLevel)) throw new Error('Wrong correction level value');

    if (version && (version < versionRange.min || version > versionRange.max)) throw new Error('Wrong version value');

    const suitableVersions = this.getVersionForDataSize(dataSize);
    const resultKeys = Object.keys(suitableVersions) as Array<keyof TMaxDataValue>;

    // if passed only correction level then check if this level can store this size of data
    if (correctionLevel && !version) return suitableVersions[correctionLevel] !== -1;

    // if passed only version check existence of atleast one correction level with this level
    if (!correctionLevel && version) {
      const versionCheck = resultKeys.map((level) => suitableVersions[level]! <= version);
      return versionCheck.some((item) => item === true);
    }

    // if passed both - check that correction level with passed version can store this size of data
    if (correctionLevel && version) return suitableVersions[correctionLevel]! <= version;

    // if both were not passed - check if there atleast one correction level that can store this size of data
    if (!correctionLevel && !version) {
      const versionCheck = resultKeys.map((level) => suitableVersions[level] !== -1);
      return versionCheck.some((item) => item === true);
    }

    return false;
  }

  /**
   * Returns Id of version group
   * @param version Version of QR Code. Range 1-40
   * @returns number of version group as string or null if group was not found
   */
  public static getVersionGroup(version: number): TVersionGroupIds | null {
    const { versionGroups } = MyQRCodeConstants;

    const groups = Object.keys(versionGroups) as Array<keyof TVersionGroups>;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < groups.length; i++) {
      if (versionGroups[groups[i]].max >= version && versionGroups[groups[i]].min <= version) return groups[i];
    }
    return null;
  }

  /**
   * Get size of service data which responds for user data size
   * @param version Version of QR Code. Range 1-40
   * @param dataType Type of data for QR Code
   * @returns Size of "user's data size" service data in bytes
   */
  public static getServiceUserDataSize(version: number, dataType: TDataTypeValues): number {
    const { serviceUserDataSize } = MyQRCodeConstants;

    const versionGroup = this.getVersionGroup(version);
    if (!versionGroup) throw new Error('Version group not found');
    const result = serviceUserDataSize[dataType][versionGroup];
    if (!result) throw new Error('Service data for user data size not found');
    return result;
  }

  /**
   * Method essence is to calculate user data size in bytes
   * (DO NOT CONFUSE IT WITH BINARY USER DATA SIZE)
   *
   * If dataType 'number' or 'alphanum' then userDataSize would be amount of characters in data
   * If dataType 'bytes' then it would be number of passed bytes
   * @param dataType Type of data for QR Code
   * @param userData User data that should be stored in QR Code
   * @returns Size of user data in bytes
   */
  public static getUserDataSize(dataType: TDataTypeValues, userData: TUserDataTypes) {
    switch (dataType) {
      case 'number':
        return userData.toString(10).length;
      case 'alphanum':
        return userData.toString().length;
      case 'bytes': // will be implemented later
      default:
        return -1;
    }
  }
}

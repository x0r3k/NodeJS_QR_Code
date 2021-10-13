// Common utils that dont relate to QR code generation flow only
export default class MyUtils {
  /**
   * Takes integer number as argument and converts it to binary.
   * @param int integer that should be converted to Binary
   * @returns integer converted to binary
   */
  public static convertIntToBinary(int: number) {
    return Number(int).toString(2);
  }

  /**
   * Fills binary string with leading zeros to reach passed length.
   * If string longer than result length PART OF STRING WILL BE SLICED!
   * @param str binary number in string representation
   * @param length resulted length of binary
   * @returns updated binary string
   */
  public static fillBinaryString(str: string, length: number): string {
    if (str.length > length) console.error('String longer than result length. You will lose data');
    return (Array(length).fill(0).join('') + str).slice(-length);
  }
}

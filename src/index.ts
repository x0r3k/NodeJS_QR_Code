import MyQRCode from './myQRCode';
import MyQRCodeUtils from './myQRCodeUtils';

const data = 'HELLO';
const userBinaryData = MyQRCode.codeAlphanum(data);
// console.log(MyQRCode.createStr(data));
// console.log(MyQRCode.generateServiceFields('alphanum', 4, binarySize!.length, 'H'));

// console.log(MyQRCodeUtils.getVersionForDataSize(1074, 'L', 'number'));

console.log(MyQRCode.divideDataToBlocks('0010000000101011000010110111100011001100000000001110110000010001'
+ '111011000001000111101100000100011110110000010001111011000001000111101100', 'M', 6));

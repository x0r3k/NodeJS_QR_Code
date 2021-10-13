# Pure NodeJS QR Code generation module 

This module generate QR Code from user data. User data can be in next formats:
- number
- alphanum
- binary (v.2) 

## Project Wiki

#### Definitions
1. Data - all scope of information that will be coded in QR Code
2. User data - information that user passed to QR Code generation method.
3. Service data - information about service fields: datatype of user data (number, alphanum or binary) and size of user data.
4. Data binary - any data presented as string binary.
5. User data size - size of user data in bytes. If datatype is 'number' or 'alphanum' then size of data will be 
amount of characters in it. If datatype is 'binary' then size of data will be number of bytes.
6. User binary data size - length of binary string received after user data converting

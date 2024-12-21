// testCases.ts
import { credConfig } from '../../src/cred/credConfig';

export const testCases = {
  0: {
    title: credConfig[0].title,
    addresses: {
      valid: '0xf999b2cFD09DEd399A8Eba8f769C2f383Ac50065',
      invalid: '0xb7Caa0ed757bbFaA208342752C9B1c541e36a4b9',
    },
    expectedDataCheck: (data: string) => parseInt(data) > 0,
  },
  1: {
    title: credConfig[1].title,
    addresses: {
      valid: '0x81a8887980DAcb896F0b5ECe068101014a417C1e',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  2: {
    title: credConfig[2].title,
    addresses: {
      valid: '0xEAd0575234bdf2fC4F86B6E4f11b4d92587964B0',
      invalid: '0xb7Caa0ed757bbFaA208342752C9B1c541e36a4b9',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  3: {
    title: credConfig[3].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  4: {
    title: credConfig[4].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  5: {
    title: credConfig[5].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  6: {
    title: credConfig[6].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x9B10310Ec0c61651Dca0009Ccad0f43f62D88533',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  7: {
    title: credConfig[7].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  8: {
    title: credConfig[8].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  9: {
    title: credConfig[9].title,
    addresses: {
      valid: '0xf999b2cFD09DEd399A8Eba8f769C2f383Ac50065',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  10: {
    title: credConfig[10].title,
    addresses: {
      valid: '0x623d931AF4aC74CA4ED98B73f0c6b1eADE9E02e9',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  11: {
    title: credConfig[11].title,
    addresses: {
      // valid: '0xcD227395F0D85c6A7E25C4CAA6607acd6D119c63',
      valid: '0x2D0557F9E557052924B15abB3D0153769504b8DE',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  12: {
    title: credConfig[12].title,
    addresses: {
      valid: '0x956fD5BA28076f78dA4C590D7E48AAf8b738Fb8a',
      invalid: '0x9B10310Ec0c61651Dca0009Ccad0f43f62D88533',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  13: {
    title: credConfig[13].title,
    addresses: {
      valid: '0x82D1791073BbC08792F8e4f7764d58A1fC6eE8B2',
      invalid: '0x6D83cac25CfaCdC7035Bed947B92b64e6a8B8090',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  14: {
    title: credConfig[14].title,
    addresses: {
      valid: '0xa3581B3C54c8C181A7f35AA1bC7d2dB3560039E9',
      invalid: '0x6D83cac25CfaCdC7035Bed947B92b64e6a8B8090',
    },
    expectedDataCheck: (data: string) => data === '26000000000000000000000000',
  },
  15: {
    title: credConfig[15].title,
    addresses: {
      valid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 1,
  },
  16: {
    title: credConfig[16].title,
    addresses: {
      valid: '0xEab804590011d0650FcB6c4Da1870C6e9ca062D1',
      invalid: '0x6D83cac25CfaCdC7035Bed947B92b64e6a8B8090',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  17: {
    title: credConfig[17].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x6D83cac25CfaCdC7035Bed947B92b64e6a8B8090',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  18: {
    title: credConfig[18].title,
    addresses: {
      // valid: '0xa903C06BF35286f6d1cDAD25396748353979a44C',
      valid: '0xE9d94A59799e3faAf115021b53a11398C91e1b41',
      invalid: '0x6D83cac25CfaCdC7035Bed947B92b64e6a8B8090',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  19: {
    title: credConfig[19].title,
    addresses: {
      valid: '0x83bbe9CFCc205bb8E53cBa0b51d6db9386CE58B5',
      invalid: '0x9B10310Ec0c61651Dca0009Ccad0f43f62D88533',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  20: {
    title: credConfig[20].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  21: {
    title: credConfig[21].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  22: {
    title: credConfig[22].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  23: {
    title: credConfig[23].title,
    addresses: {
      valid: '0x5589fD6856534a3AdfE16173AA308D2DC0E8Fb5B',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => Number(data) > 1,
  },
  24: {
    title: credConfig[24].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  25: {
    title: credConfig[25].title,
    addresses: {
      valid: '0x5Bea2b2835e359A2DE3A65F4a68fc10f2bE271EA',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  26: {
    title: credConfig[26].title,
    addresses: {
      valid: '0xEfEf4558802bF373Ce3307189C79a9cAb0a4Cb9C',
      invalid: '0x6D83cac25CfaCdC7035Bed947B92b64e6a8B8090',
    },
    expectedDataCheck: (data: string) => data >= '463178461776059131347474252',
  },
  27: {
    title: credConfig[27].title,
    addresses: {
      valid: '0xf999b2cFD09DEd399A8Eba8f769C2f383Ac50065',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  28: {
    title: credConfig[28].title,
    addresses: {
      valid: '0xEB9D176232D537B7Ed67832d8ee4aF44A6B53FEa',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  29: {
    title: credConfig[29].title,
    addresses: {
      valid: '0xbA8484d1bc98938A03f09aeBd97E9bF7b424c78D',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => Number(data) > 1,
  },
  30: {
    title: credConfig[30].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  31: {
    title: credConfig[31].title,
    addresses: {
      valid: '0x26C9551FD65bC227fe7f1368DB091965a7E515C2',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  32: {
    title: credConfig[32].title,
    addresses: {
      valid: '0x0712FDd4b888B1b3Fa684b3acc13f032cD881d01',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  33: {
    title: credConfig[33].title,
    addresses: {
      valid: '0x32ad053c13699253A95ABAea54b8708905f154Bc',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  34: {
    title: credConfig[34].title,
    addresses: {
      valid: '0x01d0F373812E603931a62aEC1EFD6b48cDb2BE13',
      invalid: '0x0987654321098765432109876543210987654321',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  35: {
    title: credConfig[35].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  36: {
    title: credConfig[36].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  37: {
    title: credConfig[37].title,
    addresses: {
      valid: '0xF877ACaFA28c19b96727966690b2f44d35aD5976',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  38: {
    title: credConfig[38].title,
    addresses: {
      valid: '0x3367A005c2bEf54f2836a616ce3E4Fa2d35910da',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  39: {
    title: credConfig[39].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  40: {
    title: credConfig[40].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  41: {
    title: credConfig[41].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  42: {
    title: credConfig[42].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  43: {
    title: credConfig[43].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  44: {
    title: credConfig[44].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  45: {
    title: credConfig[45].title,
    addresses: {
      valid: '0xF3708859C178709d5319ad5405Bc81511B72b9e9',
      invalid: '0x32B8E1AE0af3F8f335F59A191617aB7A0885f6a0',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  46: {
    title: credConfig[46].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => Number(data) > 0,
  },
  47: {
    title: credConfig[47].title,
    addresses: {
      valid: '0xba86AF6BDDC1e251cF473BB9A335eb07c65b0c1C',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => Number(data) > 1,
  },
  48: {
    title: credConfig[48].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x6D83cac25CfaCdC7035Bed947B92b64e6a8B8090',
    },
    expectedDataCheck: (data: string) => Number(data) > 72,
  },
  49: {
    title: credConfig[49].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => Number(data) > 1,
  },
  50: {
    title: credConfig[50].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
  51: {
    title: credConfig[51].title,
    addresses: {
      valid: '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce',
      invalid: '0x0B3CF56E7dF3BB3Fb7201fFcD96d279b05DDd2E3',
    },
    expectedDataCheck: (data: string) => data === '',
  },
};

export type TestCase = {
  title: string;
  addresses: {
    valid: string;
    invalid?: string;
  };
  expectedDataCheck: (data: string) => boolean;
};

import { check_cred } from '../src/verifier/check';
import { TestCase, testCases } from './case/testCases';
import { credConfig } from '../src/cred/credConfig';
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env') });

describe('check_cred', () => {
  const runTest = (id: string, testCase: TestCase) => {
    describe(`for id ${id}: ${testCase.title}`, () => {
      beforeEach((done) => {
        setTimeout(() => {
          done();
        }, 1000);
      });

      it('should return true and correct data for valid address', async () => {
        const [result, data] = await check_cred(testCase.addresses.valid, parseInt(id));
        expect(result).toBe(true);
        expect(testCase.expectedDataCheck(data)).toBe(true);
      });

      if ('invalid' in testCase.addresses) {
        it('should return false and empty data for invalid address', async () => {
          if (credConfig[parseInt(id)].credType === 'ADVANCED') {
            const [result, data] = await check_cred(testCase.addresses.invalid!, parseInt(id));
            expect(result).toBe(false);
            expect(data).toBe('0');
          } else {
            const [result, data] = await check_cred(testCase.addresses.invalid!, parseInt(id));
            expect(result).toBe(false);
            expect(data).toBe('');
          }
        });
      }
    });
  };

  // TEST_CONFIG_ID=16 bun run test/eligible.test.ts
  const testSpecificId = process.env.TEST_CONFIG_ID;

  if (testSpecificId) {
    const id = testSpecificId;
    const testCase = testCases[id];
    if (testCase && credConfig[parseInt(id)].verificationType !== 'MERKLE') {
      runTest(id, testCase);
    }
  } else {
    Object.entries(testCases).forEach(([id, testCase]: [string, TestCase]) => {
      if (credConfig[parseInt(id)].verificationType !== 'MERKLE') {
        runTest(id, testCase);
      }
    });
  }
});

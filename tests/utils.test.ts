import { UPLOAD_URL } from '../src/consts';
import { getFileName } from '../src/utils';

describe('Test utils', () => {
  describe('Test getFileName', () => {
    test('Should return file name with value', () => {
      const fileId = 'testId';
      const fileExt = 'mp3'

      const fileName = getFileName({ fileId, fileExt });

      expect(fileName).toBe(`${UPLOAD_URL}/${fileId}.${fileExt}`);
    })
  })
})

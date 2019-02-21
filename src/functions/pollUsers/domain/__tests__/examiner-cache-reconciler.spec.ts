/* tslint:disable:max-line-length */
import { reconcileActiveAndCachedExaminers } from '../examiner-cache-reconciler';
import { Mock, It, Times } from 'typemoq';
import * as cachedExaminerRepository from '../../framework/repo/dynamodb/cached-examiner-repository';

describe('examiner cache reconciler', () => {
  const moqUpdateStaffNumberCache = Mock.ofInstance(cachedExaminerRepository.updateStaffNumberCache);

  beforeEach(() => {
    moqUpdateStaffNumberCache.reset();

    spyOn(cachedExaminerRepository, 'updateStaffNumberCache').and.callFake(moqUpdateStaffNumberCache.object);
  });

  describe('reconcileActiveAndCachedExaminers', () => {
    it('should issue writes to the cache for every active examiner not already cached', async () => {
      const activeStaffNumbers = ['1', '2', '3'];
      const cachedStaffNumbers: string[] = [];
      await reconcileActiveAndCachedExaminers(activeStaffNumbers, cachedStaffNumbers);

      moqUpdateStaffNumberCache.verify(x => x(It.isValue(activeStaffNumbers), It.isValue(cachedStaffNumbers)), Times.once());
    });

    it('should cache active examiners not already in the cache and uncache those that are cached but not active', async () => {
      const activeStaffNumbers = ['1'];
      const cachedStaffNumbers = ['1', '2', '3'];
      await reconcileActiveAndCachedExaminers(activeStaffNumbers, cachedStaffNumbers);

      moqUpdateStaffNumberCache.verify(x => x(It.isValue([]), It.isValue(['2', '3'])), Times.once());
    });
  });
});

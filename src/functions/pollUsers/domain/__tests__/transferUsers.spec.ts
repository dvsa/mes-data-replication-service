import { Mock, It, Times } from 'typemoq';
import * as examinerRepository from '../../framework/repo/mysql/examinerRepository';
import { transferUsers } from '../transferUsers';
import * as cachedExaminerRepository from '../../framework/repo/dynamodb/cachedExaminerRepository';
import * as examinerCacheReconciler from '../examinerCacheReconciler';

/* tslint:disable:max-line-length */
describe('transferUsers module', () => {
  const moqExaminerRepo = Mock.ofInstance(examinerRepository.getActiveExaminers);
  const moqCachedExaminerRepo = Mock.ofInstance(cachedExaminerRepository.getCachedExaminers);
  const moqReconciler = Mock.ofInstance(examinerCacheReconciler.reconcileActiveAndCachedExaminers);

  beforeEach(() => {
    moqExaminerRepo.reset();
    moqCachedExaminerRepo.reset();
    moqReconciler.reset();

    spyOn(examinerRepository, 'getActiveExaminers').and.callFake(moqExaminerRepo.object);
    spyOn(cachedExaminerRepository, 'getCachedExaminers').and.callFake(moqCachedExaminerRepo.object);
    spyOn(examinerCacheReconciler, 'reconcileActiveAndCachedExaminers').and.callFake(moqReconciler.object);
  });
  describe('transferUsers', () => {
    it('should retrieve all the active examiners in the replica, all the IDs in the cache and pass them to the reconciler', async () => {
      const activeStaffNumbers = ['1', '2', '3'];
      const cachedStaffNumbers = ['1', '2', '5'];
      moqExaminerRepo.setup(x => x()).returns(() => Promise.resolve(activeStaffNumbers));
      moqCachedExaminerRepo.setup(x => x()).returns(() => Promise.resolve(cachedStaffNumbers));

      await transferUsers();

      moqReconciler.verify(x => x(It.isValue(activeStaffNumbers), It.isValue(cachedStaffNumbers)), Times.once());
    });
  });
});

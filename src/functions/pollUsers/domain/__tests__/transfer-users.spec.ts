import { Mock, It, Times } from 'typemoq';
import * as examinerRepository from '../../framework/repo/mysql/examiner-repository';
import { transferUsers } from '../transfer-users';
import * as cachedExaminerRepository from '../../framework/repo/dynamodb/cached-examiner-repository';
import * as examinerCacheReconciler from '../examiner-cache-reconciler';
import { StaffDetail } from '../../../../common/application/models/staff-details';

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
      const activeStaffDetails = [new StaffDetail('1', 'LDTM'), new StaffDetail('2', 'DE')];
      const cachedStaffNumbers = ['1', '2', '5'];
      moqExaminerRepo.setup(x => x()).returns(() => Promise.resolve(activeStaffDetails));
      moqCachedExaminerRepo.setup(x => x()).returns(() => Promise.resolve(cachedStaffNumbers));

      await transferUsers();

      moqReconciler.verify(x => x(It.isValue(activeStaffDetails), It.isValue(cachedStaffNumbers)), Times.once());
    });
  });
});

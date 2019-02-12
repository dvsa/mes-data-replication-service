import { Deployment } from '../../../common/domain/Schema';

export interface ExaminerDeployment {
  examinerId: number;
  deployment: Deployment;
}

import { buildJournals } from '../journal-builder';
import { AllDatasets } from '../../domain/all-datasets';

const examiners = [
  {
    individual_id: '111',
    staff_number: '222',
  },
  {
    individual_id: '333',
    staff_number: '444',
  },
];

describe('buildJournals', () => {
  it('should include a journal for every examiner', () => {
    const datasets = {
      testSlots: [],
      personalCommitments: [],
      nonTestActivities: [],
      advanceTestSlots: [],
      deployments: [],
    };
    const result = buildJournals(examiners, datasets);

    expect(result.length).toBe(2);
    expect(result[0].staffNumber).toBe('222');
    expect(result[1].staffNumber).toBe('444');
  });

  it('should merge datasets for an examiner into a single journal', () => {
    const datasets: AllDatasets = {
      testSlots: [{ examinerId: 111, testSlot: { slotDetail: { slotId: 999 } } }],
      nonTestActivities: [{ examinerId: 111, nonTestActivity: { slotDetail: { slotId: 888 } } }],
      personalCommitments: [{ examinerId: 111, personalCommitment: { commitmentId: 777 } }],
      advanceTestSlots: [{ examinerId: 111, advanceTestSlot: { slotDetail: { slotId: 666 } } }],
      deployments: [{ examinerId: 111, deployment: { deploymentId: 555 } }],
    };

    const result = buildJournals(examiners, datasets);

    expect(result.length).toBe(2);
    expect(result[0].journal).toEqual(
      {
        examiner: { staffNumber: '222' },
        testSlots: [{ slotDetail: { slotId: 999 } }],
        nonTestActivities: [{ slotDetail: { slotId: 888 } }],
        personalCommitments: [{ commitmentId: 777 }],
        advanceTestSlots: [{ slotDetail: { slotId: 666 } }],
        deployments: [{ deploymentId: 555 }],
      },
    );
  });

  it('should merge datasets including multiple examiners into the journal for each', () => {
    const datasets: AllDatasets = {
      testSlots: [
        { examinerId: 111, testSlot: { slotDetail: { slotId: 991 } } },
        { examinerId: 333, testSlot: { slotDetail: { slotId: 992 } } },
      ],
      nonTestActivities: [
        { examinerId: 111, nonTestActivity: { slotDetail: { slotId: 881 } } },
        { examinerId: 333, nonTestActivity: { slotDetail: { slotId: 882 } } },
      ],
      personalCommitments: [
        { examinerId: 111, personalCommitment: { commitmentId: 771 } },
        { examinerId: 333, personalCommitment: { commitmentId: 772 } },
      ],
      advanceTestSlots: [
        { examinerId: 111, advanceTestSlot: { slotDetail: { slotId: 661 } } },
        { examinerId: 333, advanceTestSlot: { slotDetail: { slotId: 662 } } },
      ],
      deployments: [
        { examinerId: 111, deployment: { deploymentId: 551 } },
        { examinerId: 333, deployment: { deploymentId: 552 } },
      ],
    };

    const result = buildJournals(examiners, datasets);

    expect(result.length).toBe(2);
    expect(result[0].journal).toEqual(
      {
        examiner: { staffNumber: '222' },
        testSlots: [{ slotDetail: { slotId: 991 } }],
        nonTestActivities: [{ slotDetail: { slotId: 881 } }],
        personalCommitments: [{ commitmentId: 771 }],
        advanceTestSlots: [{ slotDetail: { slotId: 661 } }],
        deployments: [{ deploymentId: 551 }],
      },
    );
    expect(result[1].journal).toEqual(
      {
        examiner: { staffNumber: '444' },
        testSlots: [{ slotDetail: { slotId: 992 } }],
        nonTestActivities: [{ slotDetail: { slotId: 882 } }],
        personalCommitments: [{ commitmentId: 772 }],
        advanceTestSlots: [{ slotDetail: { slotId: 662 } }],
        deployments: [{ deploymentId: 552 }],
      },
    );
  });
});

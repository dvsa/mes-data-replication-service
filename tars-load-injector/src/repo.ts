import { IConnectionPool } from 'oracledb';
import { query } from './database';

export const changeSpecialNeedsText = async (connPool: IConnectionPool, applicationId: number, specialNeedsText: string) => {
  return query(
    connPool,
    `
    UPDATE APPLICATION
    SET SPECIAL_NEEDS_TEXT = :specialNeedsText
    WHERE APP_ID = :applicationId
    `,
    {
      specialNeedsText,
      applicationId,
    },
  );
};

export const changePersonalCommitmentActivityCode = async (
  connPool: IConnectionPool,
  examinerId: number,
  startDate: Date,
  activityCode: string
) => {
  return query(
    connPool,
    `
    UPDATE
      PERSONAL_COMMITMENT
    SET
      NON_TEST_ACTIVITY_CODE = :activityCode
    WHERE
      COMMITMENT_ID = 
        (
          SELECT
            COMMITMENT_ID
          FROM PERSONAL_COMMITMENT
          WHERE
            INDIVIDUAL_ID = :examinerId
            AND START_DATE_TIME > :startDate
          ORDER BY START_DATE_TIME 
          OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY
        )
    `,
    {
      activityCode,
      examinerId,
      startDate,
    }
  )
};

export const changeSlotNonTestActivityCode = async (connPool: IConnectionPool, slotId: number, nonTestActivityCode: number) => {
  return query(
    connPool,
    `
    UPDATE PROGRAMME_SLOT
    SET NON_TEST_ACTIVITY_CODE = :nonTestActivityCode
    WHERE SLOT_ID = :slotId
    `,
    {
      nonTestActivityCode,
      slotId,
    },
  );
};

export const changeTelephoneNumber = async (connPool: IConnectionPool, individualId: number, telephoneNumber: string) => {
  return query(
    connPool,
    `
    UPDATE CONTACT_DETAILS
    SET MOBILE_TEL_NUMBER = :telephoneNumber
    WHERE INDIVIDUAL_ID = :individualId
    `,
    {
      telephoneNumber,
      individualId,
    }
  );
};

export const getActiveExaminers = async (connPool: IConnectionPool, activeDate: Date): Promise<Object[]> => {
  return query(
    connPool,
    `
    SELECT
      E.INDIVIDUAL_ID,
      E.STAFF_NUMBER,
      ACTIVE_POSTING.TC_ID,
      E.GRADE_CODE
    FROM
      EXAMINER E,
      INDIVIDUAL I,
      (
        SELECT P.INDIVIDUAL_ID AS POSTING_INDV_ID, P.TC_ID AS TC_ID
        FROM POSTING P
        WHERE :activeDate BETWEEN TRUNC(P.START_DATE) AND TRUNC(P.END_DATE)
      ) ACTIVE_POSTING
    WHERE
      E.INDIVIDUAL_ID = I.INDIVIDUAL_ID
      AND E.INDIVIDUAL_ID = ACTIVE_POSTING.POSTING_INDV_ID(+)
      AND NVL(E.GRADE_CODE, 'ZZZ') != 'DELE'
      AND EXISTS
        (
          SELECT END_DATE
          FROM EXAMINER_STATUS ES
          WHERE ES.INDIVIDUAL_ID = E.INDIVIDUAL_ID
          AND NVL(ES.END_DATE, TO_DATE('01/01/4000', 'DD/MM/YYYY')) > :activeDate
        )
    `,
    {
      activeDate,
    }
  );
}

export const getBookings = (connPool: IConnectionPool, activeDate: Date, individualIds: number[]): Promise<Object[]> => {
  return query(
    connPool,
    `
    SELECT
      PS.SLOT_ID,
      A.APP_ID,
      I.INDIVIDUAL_ID,
      I.DRIVER_NUMBER,
      I.FIRST_FORENAME,
      I.FAMILY_NAME
    FROM
      PROGRAMME P,
      PROGRAMME_SLOT PS,
      BOOKING B,
      APPLICATION A,
      INDIVIDUAL I
    WHERE
      TRUNC(P.PROGRAMME_DATE) = :active_date
      AND P.INDIVIDUAL_ID IN (${generateInClause(individualIds)})
      AND 
        (
          P.STATE_CODE NOT IN (2, 3)
          OR EXISTS
            (
              SELECT
                BOOK.BOOKING_ID
              FROM
                BOOKING BOOK,
                PROGRAMME_SLOT SLOT
              WHERE
                SLOT.SLOT_ID = BOOK.SLOT_ID
                AND TRUNC(SLOT.PROGRAMME_DATE) = TRUNC(P.PROGRAMME_DATE)
                AND SLOT.INDIVIDUAL_ID = P.INDIVIDUAL_ID
                AND SLOT.TC_ID = P.TC_ID
                AND BOOK.STATE_CODE = 1
            )
        )
      AND TRUNC(PS.PROGRAMME_DATE) = TRUNC(P.PROGRAMME_DATE)
      AND PS.INDIVIDUAL_ID = P.INDIVIDUAL_ID
      AND PS.TC_ID = P.TC_ID
      AND PS.TC_CLOSED_IND != 1
      AND NVL(PS.DEPLOYED_TO_FROM_CODE, 0) != 1
      AND B.SLOT_ID = PS.SLOT_ID
      AND B.STATE_CODE != 2
      AND A.APP_ID = B.APP_ID
      AND I.INDIVIDUAL_ID = A.INDIVIDUAL_ID
    `,
    ([ activeDate ] as any[]).concat(individualIds)
  );
}

const generateInClause = (objects: Object[]): string => {
  const length = (objects == null) ? 0 : objects.length;
  let clause = "";
  for (let i = 0; i < length; i += 1) {
    clause += ((i > 0) ? ", " : "") + ":" + i;
  }
  return clause;
};

export const getExaminerSubset = (results: Object[], count: number): number[] => {
  let subset = [];

  if (results != null) {
      results.slice(0, Math.min(count, results.length)).forEach((result) => {
          if ('INDIVIDUAL_ID' in result) {
              subset = subset.concat(result['INDIVIDUAL_ID']);
          }
      });
  }
  return subset;
}

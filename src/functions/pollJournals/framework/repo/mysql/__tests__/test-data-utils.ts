export const loadTestFile = (importer: any, pathRelativeToTestData: string) => {
  return importer.import(`src/functions/pollJournals/framework/repo/mysql/__tests__/data/${pathRelativeToTestData}`);
};

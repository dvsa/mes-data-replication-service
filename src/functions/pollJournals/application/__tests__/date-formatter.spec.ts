import { formatDateToStartTime } from '../formatters/date-formatter';

describe('dateFormatter', () => {
  describe('formatDateToStartTime', () => {
    it('Output the correct format on a valid date', () => {
      const result = formatDateToStartTime(new Date('2019-02-19 09:30:01'));
      expect(result).toBe('2019-02-19T09:30:01+00:00');
    });

    it('should handle nulls at runtime', () => {
      const result = formatDateToStartTime(<Date>(<unknown>null));
      expect(result).toBe('');
    });
  });
});

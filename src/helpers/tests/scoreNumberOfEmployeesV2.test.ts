import { scoreNumberOfEmployeesV2 } from '../allOther';

describe('scoreNumberOfEmployeesV2', () => {
    test('should return 0 for employees below minimum', () => {
        expect(scoreNumberOfEmployeesV2(100)).toBe(0);
        expect(scoreNumberOfEmployeesV2(0)).toBe(0);
        expect(scoreNumberOfEmployeesV2(500)).toBe(0);
    });

    test('should return 10 for employees above maximum', () => {
        expect(scoreNumberOfEmployeesV2(50000)).toBe(10);
        expect(scoreNumberOfEmployeesV2(60000)).toBe(10);
    });

    test('should calculate a score between 0 and 10 for intermediate values', () => {
        expect(scoreNumberOfEmployeesV2(5000)).toBeCloseTo(0.909, 2); // ~0.91
        expect(scoreNumberOfEmployeesV2(25000)).toBeCloseTo(4.949, 2); // ~4.95
        expect(scoreNumberOfEmployeesV2(49999)).toBeCloseTo(9.998, 2);
    });

    test('should handle edge cases correctly', () => {
        expect(scoreNumberOfEmployeesV2(501)).toBeCloseTo((501-500)/(50000-500)*10, 5);
        expect(scoreNumberOfEmployeesV2(49999)).toBeCloseTo((49999-500)/(50000-500)*10, 5);
    });
});

import { scoreNumberOfEmployeesV2 } from '../allOther';

describe('scoreNumberOfEmployeesV2', () => {
    test('returns 0 for employees below or equal to minimum', () => {
        expect(scoreNumberOfEmployeesV2(0)).toBe(0);
        expect(scoreNumberOfEmployeesV2(100)).toBe(0);
        expect(scoreNumberOfEmployeesV2(500)).toBe(0);
    });

    test('returns 10 for employees above or equal to maximum', () => {
        expect(scoreNumberOfEmployeesV2(10000)).toBe(10);
        expect(scoreNumberOfEmployeesV2(20000)).toBe(10);
    });

    test('returns a value between 0 and 10 for intermediate values', () => {
        // halfway between 500 and 10000 → about 5
        expect(scoreNumberOfEmployeesV2(5250)).toBe(5);

        // close to the low end → small value
        expect(scoreNumberOfEmployeesV2(1000)).toBeCloseTo(0.53, 2);

        // close to the high end → large value
        expect(scoreNumberOfEmployeesV2(9500)).toBeCloseTo(9.47, 2);
    });

    test('calculates exact proportional values correctly', () => {
        const min = 500;
        const max = 10000;

        const calc = (n: number) => ((n - min) / (max - min)) * 10;

        expect(scoreNumberOfEmployeesV2(501)).toBeCloseTo(calc(501), 5);
        expect(scoreNumberOfEmployeesV2(9999)).toBeCloseTo(calc(9999), 5);
        expect(scoreNumberOfEmployeesV2(7500)).toBeCloseTo(calc(7500), 5);
    });
});


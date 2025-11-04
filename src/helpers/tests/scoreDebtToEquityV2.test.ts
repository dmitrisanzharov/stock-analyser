import { scoreDebtToEquityV2 } from '../allOther';

describe('scoreDebtToEquityV2', () => {
    // Edge cases for non-positive ratios
    test('returns 0 if debtToEquityRatio is 0', () => {
        expect(scoreDebtToEquityV2(0, 1)).toBe(0);
    });

    test('returns 0 if debtToEquityRatio is negative', () => {
        expect(scoreDebtToEquityV2(-5, 1)).toBe(0);
    });

    test('returns 0 if debtToEquityRatioIndustry is 0', () => {
        expect(scoreDebtToEquityV2(1, 0)).toBe(0);
    });

    test('returns 0 if debtToEquityRatioIndustry is negative', () => {
        expect(scoreDebtToEquityV2(1, -2)).toBe(0);
    });

    // Test all scoring brackets
    test('returns 10 for ratio <= 0.7', () => {
        expect(scoreDebtToEquityV2(0.7, 1)).toBe(10);
        expect(scoreDebtToEquityV2(0.35, 0.5)).toBe(10);
    });

    test('returns 9 for ratio <= 0.8', () => {
        expect(scoreDebtToEquityV2(0.8, 1)).toBe(9);
    });

    test('returns 8 for ratio <= 0.9', () => {
        expect(scoreDebtToEquityV2(0.9, 1)).toBe(8);
    });

    test('returns 7 for ratio <= 1.0', () => {
        expect(scoreDebtToEquityV2(1.0, 1)).toBe(7);
    });

    test('returns 6 for ratio <= 1.1', () => {
        expect(scoreDebtToEquityV2(1.1, 1)).toBe(6);
    });

    test('returns 5 for ratio <= 1.2', () => {
        expect(scoreDebtToEquityV2(1.2, 1)).toBe(5);
    });

    test('returns 4 for ratio <= 1.3', () => {
        expect(scoreDebtToEquityV2(1.3, 1)).toBe(4);
    });

    test('returns 3 for ratio <= 1.4', () => {
        expect(scoreDebtToEquityV2(1.4, 1)).toBe(3);
    });

    test('returns 2 for ratio <= 1.6', () => {
        expect(scoreDebtToEquityV2(1.5, 1)).toBe(2);
        expect(scoreDebtToEquityV2(1.6, 1)).toBe(2);
    });

    test('returns 1 for ratio <= 1.7', () => {
        expect(scoreDebtToEquityV2(1.7, 1)).toBe(1);
    });

    test('returns 0 for ratio > 1.7', () => {
        expect(scoreDebtToEquityV2(2, 1)).toBe(0);
        expect(scoreDebtToEquityV2(5, 2)).toBe(0);
    });

    // Test with floating point precision
    test('handles floating point ratios correctly', () => {
        expect(scoreDebtToEquityV2(0.77, 1)).toBe(9);
        expect(scoreDebtToEquityV2(1.15, 1)).toBe(5);
    });
});

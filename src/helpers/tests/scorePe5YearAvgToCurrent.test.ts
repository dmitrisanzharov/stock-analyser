import { scorePe5YearAvgToCurrent } from '../allOther';

describe('scorePe5YearAvgToCurrent', () => {

    test("Dmitri's cases", () => {
        expect(scorePe5YearAvgToCurrent(10, 20)).toBe(10);     // diff = 0.5
        expect(scorePe5YearAvgToCurrent(30, 20)).toBe(0);      // diff = 1.5
        expect(scorePe5YearAvgToCurrent(20, 20)).toBe(5);      // diff = 1
        expect(scorePe5YearAvgToCurrent(27.5, 20)).toBeCloseTo(1.25, 2); // diff = 1.375
        expect(scorePe5YearAvgToCurrent(12.5, 20)).toBeCloseTo(8.75, 2); // diff = 0.625
    });

    test('Interpolation validation', () => {
        const cases = [
            { diff: 0.5, expected: 10 },
            { diff: 0.75, expected: 7.5 },
            { diff: 1.0, expected: 5 },
            { diff: 1.25, expected: 2.5 },
            { diff: 1.5, expected: 0 },
        ];

        for (const { diff, expected } of cases) {
            const current = diff * 100;
            const avg = 100;
            const result = scorePe5YearAvgToCurrent(current, avg);
            expect(result).toBeCloseTo(expected, 2);
        }
    });
});

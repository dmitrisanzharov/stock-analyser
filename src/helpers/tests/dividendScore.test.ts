import { dividendScore } from '../allOther';

describe('dividendScore', () => {
    it('should return 0 for 0% or negative yield', () => {
        expect(dividendScore(0)).toBe(0);
        expect(dividendScore(-5)).toBe(0);
    });

    it('should return the yield itself for 1% to 9%', () => {
        for (let i = 1; i <= 9; i++) {
            expect(dividendScore(i)).toBe(i);
        }
    });

    it('should cap at 10 for yields >= 10%', () => {
        expect(dividendScore(10)).toBe(10);
        expect(dividendScore(12)).toBe(10);
    });
});
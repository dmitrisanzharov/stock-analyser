export function scorePe5YearAvgToCurrent(currentPe: number, fiveYearAvgPe: number): number {
    const diff = currentPe / fiveYearAvgPe;
    console.log('diff: ', diff);

    if (diff <= 0.5) {
        return 10;
    }

    if (diff >= 1.5) {
        return 0;
    }

    if (diff === 1) {
        return 5;
    }

    // Linear interpolation between 0.5 → 10 and 1.5 → 0
    const score = 10 * (1.5 - diff); // each +0.1 diff reduces score by 1
    return score;
}

let aaa = scorePe5YearAvgToCurrent(10, 20);
console.log('aaa: ', aaa);

let aaa1 = scorePe5YearAvgToCurrent(30, 20);
console.log('aaa1: ', aaa1);

let aaa2 = scorePe5YearAvgToCurrent(20, 20);
console.log('aaa2: ', aaa2);

let aaa3 = scorePe5YearAvgToCurrent(27.5, 20);
console.log("aaa3: ", aaa3);

let aaa4 = scorePe5YearAvgToCurrent(12.5, 20);
console.log("aaa4: ", aaa4);

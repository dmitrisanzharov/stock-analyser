export function scorePaymentFrequency(frequency: number): number {
    if (frequency === 1) {
        return 1; // annually
    }

    if (frequency === 2) {
        return 2; // semi-annually
    }

    if (frequency === 3) {
        return 3; // 3 times per year
    }

    if (frequency === 4) {
        return 4; // quarterly
    }

    if (frequency === 12) {
        return 6; // monthly
    }

    throw new Error(`scorePaymentFrequency error: unsupported frequency ${frequency}`);
}

export function scoreDegiroCategory(category: string): number {
    const cat = category.toUpperCase();

    if (cat === 'A') {
        return 11;
    }

    if (cat === 'B') {
        return 8;
    }

    if (cat === 'C') {
        return 4;
    }

    if (cat === 'D') {
        return 1;
    }

    throw new Error(`scoreDegiroCategory error: unsupported category ${category}`);
}

export function scorePeRatio(peRatio: number, industryPeRatio: number): number {
    if (industryPeRatio <= 0) {
        throw new Error('scorePeRatio error: industryPeRatio must be > 0');
    }

    const ratio = peRatio / industryPeRatio;

    if (ratio <= 0.3) return 10; // Excellent
    if (ratio <= 0.5) return 9; // Very good
    if (ratio <= 0.7) return 8; // Good
    if (ratio <= 0.85) return 7; // Slightly undervalued
    if (ratio <= 0.99) return 6; // Almost at parity
    if (ratio === 1) return 5; // Equal to industry
    if (ratio <= 1.2) return 4; // Slightly overvalued
    if (ratio <= 1.5) return 3; // Moderately overvalued
    if (ratio <= 2.0) return 2; // Expensive
    return 1; // Very expensive
}

export function scoreFitchAndSpRating(rating: string | 0): number {
    if (!rating) {
        return 0;
    }

    const r = rating.toUpperCase().trim();

    if (r === 'AAA') return 11;
    if (r === 'AA+') return 10;
    if (r === 'AA') return 9;
    if (r === 'AA-') return 8;
    if (r === 'A+') return 7;
    if (r === 'A') return 6;
    if (r === 'A-') return 5;
    if (r === 'BBB+') return 4;
    if (r === 'BBB') return 3;
    if (r === 'BBB-') return 2;
    if (r === 'BB+') return 1;

    throw new Error(`scoreFitchRating error: rating "${rating}" not recognized`);
}

export function scoreMoodyRating(rating: string): number {
    if (!rating) {
        return 0;
    }

    const r = rating.toUpperCase().trim();

    if (r === 'AAA') return 11;
    if (r === 'AA1') return 10;
    if (r === 'AA2') return 9;
    if (r === 'AA3') return 8;
    if (r === 'A1') return 7;
    if (r === 'A2') return 6;
    if (r === 'A3') return 5;
    if (r === 'BAA1') return 4;
    if (r === 'BAA2') return 3;
    if (r === 'BAA3') return 2;
    if (r === 'BA1') return 1;

    throw new Error(`scoreMoodyRating error: rating "${rating}" not recognized`);
}

export function scoreDegiroIncomeStatement(
    profitableYears: number,
    numberOfTimesAssetsBiggerThanLiabilities: number
): number {
    return profitableYears + numberOfTimesAssetsBiggerThanLiabilities;
}

export function scoreYearStarted(yearStarted: number, alreadyKnown?: number): number {
    if (alreadyKnown) {
        return alreadyKnown;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - yearStarted;

    if (age >= 50) return 10;
    if (age >= 40) return 9;
    if (age >= 35) return 8;
    if (age >= 30) return 7;
    if (age >= 25) return 6;
    if (age >= 20) return 5;
    if (age >= 15) return 4;
    if (age >= 10) return 3;
    if (age >= 5) return 2;
    if (age >= 0) return 1;

    throw new Error(`scoreYearStarted error: invalid yearStarted ${yearStarted}`);
}

export function scoreNumberOfEmployees(numEmployees: number): number {
    if (numEmployees >= 10000) return 10;
    if (numEmployees >= 5000) return 9;
    if (numEmployees >= 2500) return 8;
    if (numEmployees >= 1000) return 7;
    if (numEmployees >= 500) return 6;
    if (numEmployees >= 250) return 5;
    if (numEmployees >= 100) return 4;
    if (numEmployees >= 50) return 3;
    if (numEmployees >= 10) return 2;
    if (numEmployees >= 1) return 1;

    throw new Error(`scoreNumberOfEmployees error: invalid number of employees ${numEmployees}`);
}

export function scoreIntegrity(integrity: number): number {
    return 10 - integrity;
}

export function scoreTradeVolume(sharePriceInEuro: number, volumeInMillions: number): number {
    const turnover = sharePriceInEuro * volumeInMillions * 1_000_000; // daily € turnover

    if (turnover >= 100_000_000) return 10;
    if (turnover >= 50_000_000) return 9;
    if (turnover >= 20_000_000) return 8;
    if (turnover >= 10_000_000) return 7;
    if (turnover >= 5_000_000) return 6;
    if (turnover >= 2_000_000) return 5;
    if (turnover >= 1_000_000) return 4;
    if (turnover >= 500_000) return 3;
    if (turnover >= 100_000) return 2;
    if (turnover > 0) return 1;
    return 0;
}

export function yearsForEarningsMatchPrice(sharePriceInEuro: number, avgEpsIn10Years: number): number {
    const peRatio = sharePriceInEuro / avgEpsIn10Years;

    if (peRatio <= 2) return 10;
    if (peRatio <= 4) return 9;
    if (peRatio <= 6) return 8;
    if (peRatio <= 8) return 7;
    if (peRatio <= 10) return 6;
    if (peRatio <= 13) return 5;
    if (peRatio <= 17) return 4;
    if (peRatio <= 25) return 3;
    if (peRatio <= 40) return 2;
    return 1; // >40
}

export function scoreShareBookValue(sharePriceInEuro: number, bookValuePerShare: number): number {
    const pbRatio = sharePriceInEuro / bookValuePerShare; // P/B ratio as a decimal
    const pbPercent = pbRatio * 100; // convert to percent for easier comparison

    if (pbPercent <= 50) return 10;
    if (pbPercent <= 75) return 9;
    if (pbPercent <= 100) return 8;
    if (pbPercent <= 110) return 7;
    if (pbPercent <= 120) return 6;
    if (pbPercent <= 135) return 5;
    if (pbPercent <= 150) return 4;
    if (pbPercent <= 175) return 3;
    if (pbPercent <= 200) return 2;
    return 1; // >200%
}

export function scoreDebtToEquity(debtToEquityRatio: number, zeroTrue?: boolean): number {
    if (debtToEquityRatio <= 40) return 10;
    if (debtToEquityRatio <= 50) return 9;
    if (debtToEquityRatio <= 60) return 8;
    if (debtToEquityRatio <= 70) return 7;
    if (debtToEquityRatio <= 80) return 6;
    if (debtToEquityRatio <= 90) return 5;
    if (debtToEquityRatio <= 100) return 4;
    if (debtToEquityRatio <= 120) return 3;
    if (debtToEquityRatio <= 140) return 2;
    return 1; // >140%
}

export function scoreReturnOnEquity(roePercent: number): number {
    if (roePercent >= 10) return 10;
    return roePercent;
}

export function scoreMarketCap(marketCapInBillions: number): number {
    if (marketCapInBillions >= 1.0) return 10;
    if (marketCapInBillions >= 0.9) return 9;
    if (marketCapInBillions >= 0.8) return 8;
    if (marketCapInBillions >= 0.7) return 7;
    if (marketCapInBillions >= 0.6) return 6;
    if (marketCapInBillions >= 0.5) return 5;
    if (marketCapInBillions >= 0.4) return 4;
    if (marketCapInBillions >= 0.3) return 3;
    if (marketCapInBillions >= 0.2) return 2;
    return 1; // <0.2
}

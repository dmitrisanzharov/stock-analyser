import { FitchRatingType, RatingsOutlookType, MoodyRatingType, CreditreformRatingType } from '../types';

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

    if (frequency === 6) {
        return 5; // every 2 months
    }

    if (frequency === 12) {
        return 6; // monthly
    }

    throw new Error(`scorePaymentFrequency error: unsupported frequency ${frequency}`);
}

export const DEGIRO_CATEGORIES_ARRAY = ['A', 'B', 'C', 'D'];
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

export function growthScore5Years(finalGrowth: number): number {
    if (finalGrowth <= 1) return 0;
    if (finalGrowth >= 2) return 10;
    // Linear interpolation between 1 and 2
    return (finalGrowth - 1) * 10;
}

export function growthScore5YearsDividends(itemTotalGrowth5yaDividends: number): number {
    if (itemTotalGrowth5yaDividends <= 0) return 0;
    if (itemTotalGrowth5yaDividends >= 0.25) return 10;
    // Spread 0 → 10 linearly between 0 → 0.25
    return (itemTotalGrowth5yaDividends / 0.25) * 10;
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

export function degiroAnalystRatingToScore(rating: number): number {
    if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }
    return 10 - 2.5 * (rating - 1); // 1 → 10, 2 → 7.5, 3 → 5, 4 → 2.5, 5 → 0
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

export function scoreNetProfitMargin(companyMargin: number, industryMargin: number): number {
    if (companyMargin === industryMargin) {
        return 5;
    }

    if (companyMargin > industryMargin) {
        // Above industry
        if (companyMargin >= industryMargin * 1.2) return 10; // 20% higher or more
        if (companyMargin >= industryMargin * 1.16) return 9;
        if (companyMargin >= industryMargin * 1.12) return 8;
        if (companyMargin >= industryMargin * 1.08) return 7;
        if (companyMargin >= industryMargin * 1.04) return 6;
        return 6; // slightly above
    } else {
        // Below industry
        if (companyMargin <= industryMargin * 0.8) return 0; // 20% lower or more
        if (companyMargin <= industryMargin * 0.84) return 1;
        if (companyMargin <= industryMargin * 0.88) return 2;
        if (companyMargin <= industryMargin * 0.92) return 3;
        if (companyMargin < industryMargin) return 4; // slightly below
    }

    return 5; // exact match or fallback
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

export function scoreEquityAverage(equityInMillions: number): number {
    if (equityInMillions >= 10000) return 10; // €10B+ : blue-chip safe
    if (equityInMillions >= 5000) return 9; // €5B+
    if (equityInMillions >= 2000) return 8; // €2B+
    if (equityInMillions >= 1000) return 7; // €1B+ : safe threshold
    if (equityInMillions >= 750) return 6; // upper mid-cap
    if (equityInMillions >= 500) return 5; // mid-cap borderline
    if (equityInMillions >= 300) return 4; // small-mid cap
    if (equityInMillions >= 200) return 3; // small cap
    if (equityInMillions >= 100) return 2; // micro cap
    if (equityInMillions >= 50) return 1; // micro cap
    return 0; // €1–50m: very risky
}

export function scoreEBITDAAverage(ebitdaInMillions: number): number {
    if (ebitdaInMillions <= 0) return 0; // zero or negative EBITDA: very risky
    if (ebitdaInMillions <= 50) return 1; // €1–50m: very small, risky
    if (ebitdaInMillions >= 5000) return 10; // €5B+ : extremely robust
    if (ebitdaInMillions >= 2000) return 9; // €2B+
    if (ebitdaInMillions >= 1000) return 8; // €1B+
    if (ebitdaInMillions >= 500) return 7; // €500m+
    if (ebitdaInMillions >= 250) return 6; // €250m+
    if (ebitdaInMillions >= 100) return 5; // €100m+
    if (ebitdaInMillions >= 75) return 4; // €75m+
    if (ebitdaInMillions >= 51) return 3; // €51–74m
    return 2; // fallback (should rarely occur)
}

export function scoreNetProfitAverage(netProfitInMillions: number): number {
    if (netProfitInMillions <= 0) return 0; // zero or negative net profit: very risky
    if (netProfitInMillions <= 10) return 1; // €1–10m: very small, risky
    if (netProfitInMillions >= 2000) return 10; // €2B+ : extremely safe
    if (netProfitInMillions >= 1000) return 9; // €1B+
    if (netProfitInMillions >= 500) return 8; // €500m+
    if (netProfitInMillions >= 250) return 7; // €250m+
    if (netProfitInMillions >= 100) return 6; // €100m+
    if (netProfitInMillions >= 50) return 5; // €50m+
    if (netProfitInMillions >= 25) return 4; // €25m+
    if (netProfitInMillions >= 11) return 3; // €11–24m
    return 2; // fallback (€11m not reached, still positive)
}

export function scoreDebtToEquity(debtToEquityRatio: number): number {
    if (typeof debtToEquityRatio !== 'number') {
        return 'na' as any;
    }

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

export function scoreCurrentRatioCompany(currentRatio: number | null, industryRatio: number | null): number {
    if (
        currentRatio == null ||
        industryRatio == null ||
        isNaN(currentRatio) ||
        isNaN(industryRatio) ||
        industryRatio <= 0
    ) {
        return 0;
    }

    const ratio = currentRatio / industryRatio;

    if (ratio < 0.4) return 0; // critically low liquidity
    if (ratio < 0.7) return 3; // weak
    if (ratio < 0.9) return 5; // below average
    if (ratio < 1.3) return 10; // healthy (optimal zone)
    if (ratio < 1.8) return 7; // slightly too liquid
    if (ratio < 3.0) return 4; // overly conservative
    return 2; // excessive, inefficient liquidity
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

export function gradeAgainstEuStem(num: number): number {
    const euStemAsPopulation = 7;

    if (num >= euStemAsPopulation) return 10;

    // scale linearly from 0 → 10 between 0 and 7
    const score = (num / euStemAsPopulation) * 10;

    return score;
}

export const FITCH_RATING_MAP: Record<FitchRatingType, number> = {
    AAA: 11,
    'AA+': 10,
    AA: 9,
    'AA-': 8,
    'A+': 7,
    A: 6,
    'A-': 5,
    'BBB+': 4,
    BBB: 3,
    'BBB-': 2,
    'BB+': 1,
    BB: 0,
    'BB-': 0,
    'B+': 0,
    B: 0,
    'B-': 0,
    'CCC+': 0,
    CCC: 0,
    'CCC-': 0,
    CC: 0,
    C: 0,
    D: 0
};
export function scoreFitchRating(rating: FitchRatingType, creditRatingProvider: string): number {
    if (FITCH_RATING_MAP.hasOwnProperty(rating)) {
        return FITCH_RATING_MAP[rating];
    } else {
        throw new Error('error in ' + creditRatingProvider);
    }
}

export const OUTLOOK_MAX_SCORE = 2;
export const outlookMap: Record<RatingsOutlookType, number> = {
    positive: OUTLOOK_MAX_SCORE, // Best outlook
    stable: 1, // Neutral / normal
    negative: 0, // Weak outlook (but still non-negative)
    developing: 0 // Midpoint / uncertain, same weight as Stable
};

export function ratingOutlook(outlook: RatingsOutlookType): number {
    if (outlookMap.hasOwnProperty(outlook)) {
        return outlookMap[outlook];
    } else {
        throw new Error('error in RatingOutlook');
    }
}

export const MOODY_RATING_MAP: Record<MoodyRatingType, number> = {
    Aaa: 11,
    Aa1: 10,
    Aa2: 9,
    Aa3: 8,
    A1: 7,
    A2: 6,
    A3: 5,
    Baa1: 4,
    Baa2: 3,
    Baa3: 2,
    Ba1: 1,
    Ba2: 0,
    Ba3: 0,
    B1: 0,
    B2: 0,
    B3: 0,
    Caa1: 0,
    Caa2: 0,
    Caa3: 0,
    Ca: 0,
    C: 0
};

export function scoreMoodyRatingV2(rating: MoodyRatingType): number {
    if (MOODY_RATING_MAP.hasOwnProperty(rating)) {
        return MOODY_RATING_MAP[rating];
    } else {
        throw new Error('error in MoodyRating');
    }
}

// Creditreform Long-Term Issuer Ratings
// Map Creditreform Ratings to numeric scores
export const CREDITREFORM_RATING_MAP: Record<CreditreformRatingType, number> = {
    AAA: 11, // Highest credit quality
    AA: 10,
    A: 9,
    BBB: 8,
    BB: 6,
    B: 4,
    C: 2,
    SD: 0, // Selective Default
    D: 0 // Default
};

// Function to score Creditreform Ratings
export function scoreCreditreformRating(rating: CreditreformRatingType): number {
    if (CREDITREFORM_RATING_MAP.hasOwnProperty(rating)) {
        return CREDITREFORM_RATING_MAP[rating];
    } else {
        throw new Error('Invalid Creditreform Rating');
    }
}

export function athValuationScore(currentPrice: number, allTimeHigh: number): number {
    if (allTimeHigh <= 0) return 0; // safety check
    const ratio = currentPrice / allTimeHigh;

    // If price is higher than ATH, score is 0
    if (ratio >= 1) return 0;

    // If price is 40% or more below ATH (≤ 0.6), score is 10
    if (ratio <= 0.6) return 10;

    // Linear interpolation between 0.6 → 1.0
    const score = ((1 - ratio) / (1 - 0.6)) * 10;

    return Math.max(0, Math.min(10, score));
}

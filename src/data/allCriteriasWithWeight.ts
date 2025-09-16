import { CRITERIA } from './globalVars';

const allCriteriasWithWeightArr = [
    { criteriaId: CRITERIA.DIVIDENDS_INTEREST, weight: 4, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.PAYMENT_FREQUENCY, weight: 1, maxPossibleScore: 6 },
    { criteriaId: CRITERIA.COUNTRY_CORRUPTION, weight: 10, maxPossibleScore: 100 },
    { criteriaId: CRITERIA.DEGIRO_CATEGORY, weight: 5, maxPossibleScore: 11 },
    { criteriaId: CRITERIA.PE_RATIO, weight: 9, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.STOCK_GRAPH, weight: 1, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.AUDITOR, weight: 10, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.FITCH_RATING, weight: 5, maxPossibleScore: 11 },
    { criteriaId: CRITERIA.MOODY_RATING, weight: 5, maxPossibleScore: 11 },
    { criteriaId: CRITERIA.SP_RATING, weight: 5, maxPossibleScore: 11 },
    { criteriaId: CRITERIA.DEGIRO_INCOME_STATEMENT, weight: 6, maxPossibleScore: 12 },
    { criteriaId: CRITERIA.YEAR_STARTED, weight: 5, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.NUMBER_OF_EMPLOYEES, weight: 6, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.INTEGRITY, weight: 10, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.HELD_BY_BIG_INVESTORS, weight: 4, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.TRADING_VOLUME_IN_EURO, weight: 8, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.YEARS_TO_EARNINGS_MATCH, weight: 5, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.SHARE_BOOK_VALUE, weight: 9, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.EQUITY_AVG, weight: 10, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.EBITDA_AVG, weight: 10, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.NET_PROFIT_AVG, weight: 10, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.DEBT_EQUITY, weight: 10, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.RETURN_ON_EQUITY, weight: 6, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.MARKET_CAP, weight: 1, maxPossibleScore: 10 },
    { criteriaId: CRITERIA.INDEX_MEMBERSHIP, weight: 5, maxPossibleScore: 3 },
    { criteriaId: CRITERIA.HELD_BY_BILLIONAIRES, weight: 6, maxPossibleScore: 1 },
    { criteriaId: CRITERIA.VALUATION, weight: 2, maxPossibleScore: 6 },
    { criteriaId: CRITERIA.FUTURE_GROWTH, weight: 2, maxPossibleScore: 6 },
    { criteriaId: CRITERIA.PAST_PERFORMANCE, weight: 2, maxPossibleScore: 6 },
    { criteriaId: CRITERIA.FINANCIAL_HEALTH, weight: 2, maxPossibleScore: 6 },
    { criteriaId: CRITERIA.DIVIDENDS, weight: 2, maxPossibleScore: 6 },
    { criteriaId: CRITERIA.MANAGEMENT, weight: 2, maxPossibleScore: 6 }
];

export default allCriteriasWithWeightArr;

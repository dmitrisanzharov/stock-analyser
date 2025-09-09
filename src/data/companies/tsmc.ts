import dayjs from 'dayjs';
import { CRITERIA, dateFormat } from '../globalVars';
import { Company } from '../../table/BasicTable';
import allCriteriasWithWeightArr from '../allCriteriasWithWeight';
import { ScoreArrayItem } from '../../types';
import calcTotalScore from '../../helpers/calcTotalScore';
import {
    scorePaymentFrequency,
    scoreDegiroCategory,
    scorePeRatio,
    scoreFitchAndSpRating,
    scoreMoodyRating,
    scoreDegiroIncomeStatement,
    scoreYearStarted,
    scoreNumberOfEmployees,
    scoreIntegrity,
    yearsForEarningsMatchPrice,
    scoreShareBookValue,
    scoreDebtToEquity,
    scoreReturnOnEquity,
    scoreMarketCap
} from '../../helpers/allOther';

// e.g. 2025-09-12
const date_when_analyzed = '2025-09-09';
const isin = 'US8740391003';
const name = 'TSMC';

// consts
const sharePriceInEuroConst = 210.38;

// prompts
// https://docs.google.com/spreadsheets/d/1-tffkTHziGUtE8yt4_E4ZB86Q9dNyvouHGMhNxlTGKk/edit?gid=661834923#gid=661834923

const scoreArray: ScoreArrayItem[] = [
    { criteriaId: CRITERIA.DIVIDENDS_INTEREST, dmitriScore: 1.05 }, // max 10
    { criteriaId: CRITERIA.PAYMENT_FREQUENCY, dmitriScore: scorePaymentFrequency(4) }, // max 6
    { criteriaId: CRITERIA.COUNTRY_CORRUPTION, dmitriScore: 67 }, // max 100
    { criteriaId: CRITERIA.DEGIRO_CATEGORY, dmitriScore: scoreDegiroCategory('b') }, // max 11
    { criteriaId: CRITERIA.PE_RATIO, dmitriScore: scorePeRatio(21.17, 48.95) }, // max 10, args: companyPeRatio, industryPeRatio ...
    { criteriaId: CRITERIA.STOCK_GRAPH, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.AUDITOR, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.FITCH_RATING, dmitriScore: scoreFitchAndSpRating(0) }, // max 11
    { criteriaId: CRITERIA.MOODY_RATING, dmitriScore: scoreMoodyRating('Aa3') }, // max 11
    { criteriaId: CRITERIA.SP_RATING, dmitriScore: scoreFitchAndSpRating('AA-') }, // max 11
    { criteriaId: CRITERIA.DEGIRO_INCOME_STATEMENT, dmitriScore: scoreDegiroIncomeStatement(6, 4) }, // max 12
    { criteriaId: CRITERIA.YEAR_STARTED, dmitriScore: scoreYearStarted(1987) }, // max 10
    { criteriaId: CRITERIA.NUMBER_OF_EMPLOYEES, dmitriScore: scoreNumberOfEmployees(83825) }, // max 10
    { criteriaId: CRITERIA.INTEGRITY, dmitriScore: scoreIntegrity(3) }, // max 10
    { criteriaId: CRITERIA.HELD_BY_BIG_INVESTORS, dmitriScore: 10 }, // max 10
    {
        criteriaId: CRITERIA.YEARS_TO_EARNINGS_MATCH,
        dmitriScore: yearsForEarningsMatchPrice(sharePriceInEuroConst, 3.19)
    }, // max 10, args: sharePriceInEuro, avgEpsIn10Years
    { criteriaId: CRITERIA.SHARE_BOOK_VALUE, dmitriScore: scoreShareBookValue(sharePriceInEuroConst, 5.44) }, // max 10, args: sharePriceInEuro, bookValuePerShare
    { criteriaId: CRITERIA.EQUITY_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.EBITDA_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.NET_PROFIT_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.DEBT_EQUITY, dmitriScore: scoreDebtToEquity(21.94) }, // max 10, input as percentage: e.g. 40% input as 40
    { criteriaId: CRITERIA.RETURN_ON_EQUITY, dmitriScore: scoreReturnOnEquity(34.20) }, // max 10, input as percentage: e.g. 1.5% input as 1.5
    { criteriaId: CRITERIA.MARKET_CAP, dmitriScore: scoreMarketCap(938) }, // max 10
    { criteriaId: CRITERIA.INDEX_MEMBERSHIP, dmitriScore: 3 }, // max 3
    { criteriaId: CRITERIA.HELD_BY_BILLIONAIRES, dmitriScore: 0.69 }, // max 1
    { criteriaId: CRITERIA.VALUATION, dmitriScore: 4 }, // max 6
    { criteriaId: CRITERIA.FUTURE_GROWTH, dmitriScore: 3 }, // max 6
    { criteriaId: CRITERIA.PAST_PERFORMANCE, dmitriScore: 6 }, // max 6
    { criteriaId: CRITERIA.FINANCIAL_HEALTH, dmitriScore: 5 }, // max 6
    { criteriaId: CRITERIA.DIVIDENDS, dmitriScore: 3 }, // max 6
    { criteriaId: CRITERIA.MANAGEMENT, dmitriScore: 2 } // max 6
];

const companyScore = calcTotalScore(CRITERIA, scoreArray, allCriteriasWithWeightArr);

const tsmc: Company = {
    dateOfAnalysis: dayjs(date_when_analyzed).format(dateFormat),
    name,
    isin,
    score: Number(companyScore.toFixed(2))
};

export default tsmc;

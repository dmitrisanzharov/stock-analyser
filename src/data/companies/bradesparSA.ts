import dayjs from 'dayjs';
import { CRITERIA, dateFormat } from '../globalVars';
import { Company, ScoreArrayItem } from '../../types';
import allCriteriasWithWeightArr from '../allCriteriasWithWeight';
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
    scoreTradeVolume,
    yearsForEarningsMatchPrice,
    scoreShareBookValue,
    scoreDebtToEquity,
    scoreReturnOnEquity,
    scoreMarketCap
} from '../../helpers/allOther';

// e.g. 2025-09-12
const date_when_analyzed = '2025-09-15';
const isin = 'BRBRAPACNOR5';
const name = 'Bradespar SA';
const countryDomain = 'br';

// consts
const sharePriceInEuroConst = 2.32;

// prompts
// https://docs.google.com/spreadsheets/d/1-tffkTHziGUtE8yt4_E4ZB86Q9dNyvouHGMhNxlTGKk/edit?gid=661834923#gid=661834923

const scoreArray: ScoreArrayItem[] = [
    { criteriaId: CRITERIA.DIVIDENDS_INTEREST, dmitriScore: 23 }, // max 10
    { criteriaId: CRITERIA.PAYMENT_FREQUENCY, dmitriScore: scorePaymentFrequency(2) }, // max 6
    { criteriaId: CRITERIA.COUNTRY_CORRUPTION, dmitriScore: 34 }, // max 100
    { criteriaId: CRITERIA.DEGIRO_CATEGORY, dmitriScore: scoreDegiroCategory('d') }, // max 11
    { criteriaId: CRITERIA.PE_RATIO, dmitriScore: scorePeRatio(5.16, 11.43) }, // max 10, args: companyPeRatio, industryPeRatio ...
    { criteriaId: CRITERIA.STOCK_GRAPH, dmitriScore: 5 }, // max 10
    { criteriaId: CRITERIA.AUDITOR, dmitriScore: 5 }, // max 10
    { criteriaId: CRITERIA.FITCH_RATING, dmitriScore: scoreFitchAndSpRating('AAA') }, // max 11, if NONE... then: ''
    { criteriaId: CRITERIA.MOODY_RATING, dmitriScore: scoreMoodyRating('') }, // max 11, if NONE... then: ''
    { criteriaId: CRITERIA.SP_RATING, dmitriScore: scoreFitchAndSpRating('') }, // max 11, if NONE... then: ''
    { criteriaId: CRITERIA.DEGIRO_INCOME_STATEMENT, dmitriScore: scoreDegiroIncomeStatement(6, 4) }, // max 12
    { criteriaId: CRITERIA.YEAR_STARTED, dmitriScore: scoreYearStarted(2000) }, // max 10
    { criteriaId: CRITERIA.NUMBER_OF_EMPLOYEES, dmitriScore: scoreNumberOfEmployees(350) }, // max 10
    { criteriaId: CRITERIA.INTEGRITY, dmitriScore: scoreIntegrity(4) }, // max 10
    { criteriaId: CRITERIA.HELD_BY_BIG_INVESTORS, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.TRADING_VOLUME_IN_EURO, dmitriScore: scoreTradeVolume(sharePriceInEuroConst, 71.1) }, // max 10
    {
        criteriaId: CRITERIA.YEARS_TO_EARNINGS_MATCH,
        dmitriScore: yearsForEarningsMatchPrice(sharePriceInEuroConst, 0.66)
    }, // max 10, args: sharePriceInEuro, avgEpsIn10Years
    { criteriaId: CRITERIA.SHARE_BOOK_VALUE, dmitriScore: scoreShareBookValue(sharePriceInEuroConst, 6.17) }, // max 10, args: sharePriceInEuro, bookValuePerShare
    { criteriaId: CRITERIA.EQUITY_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.EBITDA_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.NET_PROFIT_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.DEBT_EQUITY, dmitriScore: scoreDebtToEquity(0.05) }, // max 10, input as percentage: e.g. 40% input as 40
    { criteriaId: CRITERIA.RETURN_ON_EQUITY, dmitriScore: scoreReturnOnEquity(12.57) }, // max 10, input as percentage: e.g. 1.5% input as 1.5
    { criteriaId: CRITERIA.MARKET_CAP, dmitriScore: scoreMarketCap(1.21) }, // max 10
    { criteriaId: CRITERIA.INDEX_MEMBERSHIP, dmitriScore: 1 }, // max 3
    { criteriaId: CRITERIA.HELD_BY_BILLIONAIRES, dmitriScore: 0 }, // max 1
    { criteriaId: CRITERIA.VALUATION, dmitriScore: 4 }, // max 6
    { criteriaId: CRITERIA.FUTURE_GROWTH, dmitriScore: 2 }, // max 6
    { criteriaId: CRITERIA.PAST_PERFORMANCE, dmitriScore: 1 }, // max 6
    { criteriaId: CRITERIA.FINANCIAL_HEALTH, dmitriScore: 6 }, // max 6
    { criteriaId: CRITERIA.DIVIDENDS, dmitriScore: 4 }, // max 6
    { criteriaId: CRITERIA.MANAGEMENT, dmitriScore: 1 } // max 6
];

const companyScore = calcTotalScore(CRITERIA, scoreArray, allCriteriasWithWeightArr);

const bradesparSA: Company = {
    dateOfAnalysis: dayjs(date_when_analyzed).format(dateFormat),
    name,
    isin,
    score: Number(companyScore.toFixed(2)),
    country: countryDomain
};

export default bradesparSA;

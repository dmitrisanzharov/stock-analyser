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
    scoreTradeVolume,
    yearsForEarningsMatchPrice,
    scoreShareBookValue,
    scoreDebtToEquity,
    scoreReturnOnEquity,
    scoreMarketCap
} from '../../helpers/allOther';

// e.g. 2025-09-12
const date_when_analyzed = '2025-09-15';
const isin = 'NO0011202772';
const name = 'Var Energi ASA';
const countryDomain = 'no';

// consts
const sharePriceInEuroConst = 2.83;

// prompts
// https://docs.google.com/spreadsheets/d/1-tffkTHziGUtE8yt4_E4ZB86Q9dNyvouHGMhNxlTGKk/edit?gid=661834923#gid=661834923

const scoreArray: ScoreArrayItem[] = [
    { criteriaId: CRITERIA.DIVIDENDS_INTEREST, dmitriScore: 14.45 }, // max 10
    { criteriaId: CRITERIA.PAYMENT_FREQUENCY, dmitriScore: scorePaymentFrequency(4) }, // max 6
    { criteriaId: CRITERIA.COUNTRY_CORRUPTION, dmitriScore: 81 }, // max 100
    { criteriaId: CRITERIA.DEGIRO_CATEGORY, dmitriScore: scoreDegiroCategory('a') }, // max 11
    { criteriaId: CRITERIA.PE_RATIO, dmitriScore: scorePeRatio(13.77, 49.99) }, // max 10, args: companyPeRatio, industryPeRatio ...
    { criteriaId: CRITERIA.STOCK_GRAPH, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.AUDITOR, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.FITCH_RATING, dmitriScore: scoreFitchAndSpRating('') }, // max 11, if NONE... then: ''
    { criteriaId: CRITERIA.MOODY_RATING, dmitriScore: scoreMoodyRating('Baa3') }, // max 11, if NONE... then: ''
    { criteriaId: CRITERIA.SP_RATING, dmitriScore: scoreFitchAndSpRating('BBB') }, // max 11, if NONE... then: ''
    { criteriaId: CRITERIA.DEGIRO_INCOME_STATEMENT, dmitriScore: scoreDegiroIncomeStatement(5, 6) }, // max 12
    { criteriaId: CRITERIA.YEAR_STARTED, dmitriScore: scoreYearStarted(1965) }, // max 10
    { criteriaId: CRITERIA.NUMBER_OF_EMPLOYEES, dmitriScore: scoreNumberOfEmployees(1404) }, // max 10
    { criteriaId: CRITERIA.INTEGRITY, dmitriScore: scoreIntegrity(4) }, // max 10
    { criteriaId: CRITERIA.HELD_BY_BIG_INVESTORS, dmitriScore: 10 }, // max 10
    {
        criteriaId: CRITERIA.YEARS_TO_EARNINGS_MATCH,
        dmitriScore: yearsForEarningsMatchPrice(sharePriceInEuroConst, 0.23)
    }, // max 10, args: sharePriceInEuro, avgEpsIn10Years
    { criteriaId: CRITERIA.SHARE_BOOK_VALUE, dmitriScore: scoreShareBookValue(sharePriceInEuroConst, 0.35) }, // max 10, args: sharePriceInEuro, bookValuePerShare
    { criteriaId: CRITERIA.EQUITY_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.EBITDA_AVG, dmitriScore: 10 }, // max 10
    { criteriaId: CRITERIA.NET_PROFIT_AVG, dmitriScore: 0 }, // max 10
    { criteriaId: CRITERIA.DEBT_EQUITY, dmitriScore: 0 }, // max 10, input as percentage: e.g. 40% input as 40
    { criteriaId: CRITERIA.RETURN_ON_EQUITY, dmitriScore: scoreReturnOnEquity(56.04) }, // max 10, input as percentage: e.g. 1.5% input as 1.5
    { criteriaId: CRITERIA.MARKET_CAP, dmitriScore: scoreMarketCap(8) }, // max 10
    { criteriaId: CRITERIA.INDEX_MEMBERSHIP, dmitriScore: 2 }, // max 3
    { criteriaId: CRITERIA.HELD_BY_BILLIONAIRES, dmitriScore: 0 }, // max 1
    { criteriaId: CRITERIA.VALUATION, dmitriScore: 2 }, // max 6
    { criteriaId: CRITERIA.FUTURE_GROWTH, dmitriScore: 3 }, // max 6
    { criteriaId: CRITERIA.PAST_PERFORMANCE, dmitriScore: 4 }, // max 6
    { criteriaId: CRITERIA.FINANCIAL_HEALTH, dmitriScore: 2 }, // max 6
    { criteriaId: CRITERIA.DIVIDENDS, dmitriScore: 2 }, // max 6
    { criteriaId: CRITERIA.MANAGEMENT, dmitriScore: 1 } // max 6
];

const companyScore = calcTotalScore(CRITERIA, scoreArray, allCriteriasWithWeightArr);

const varEnergiAsa: Company = {
    dateOfAnalysis: dayjs(date_when_analyzed).format(dateFormat),
    name,
    isin,
    score: Number(companyScore.toFixed(2)),
    country: countryDomain
};

export default varEnergiAsa;

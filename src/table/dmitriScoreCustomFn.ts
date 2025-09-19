import {
    scorePaymentFrequency,
    scoreDegiroCategory,
    scorePeRatio,
    scoreDegiroIncomeStatement,
    scoreYearStarted,
    scoreNumberOfEmployees,
    scoreIntegrity,
    scoreTradeVolume,
    yearsForEarningsMatchPrice,
    scoreShareBookValue,
    scoreEquityAverage,
    scoreEBITDAAverage,
    scoreNetProfitAverage,
    scoreDebtToEquity,
    scoreReturnOnEquity,
    scoreMarketCap
} from '../helpers/allOther';
import { InvestmentRecord } from '../types';
import { dmitriScoreConversionNumber } from '../data/globalVars';

function consoleLennar(allValues: InvestmentRecord, currentScore: number, criteria: string, currentMaxScore: number) {
    if (allValues['Company Name'] === 'Lennar Corp') {
        console.log(criteria, ': ', currentScore, '...', 'maxScore: ', currentMaxScore);
    }
}

function dmitriScoreCustomFn(info: any) {

    const value = info.getValue();

    if (value || value === 0) {
        return Number(value.toFixed(2));
    }

    const item: InvestmentRecord = info.row.original;

    let finalScore = 0;
    let maxScorePossible = 0;

    // Dividends Interest Rate
    const dividendsInterestRateMaxScore = 10;
    const dividendsInterestRateWeight = 4;
    const dividendsInterestRateScore = Number(item['Yield as % (pref, degiro, 5 years)']);
    finalScore = finalScore + dividendsInterestRateScore * dividendsInterestRateWeight;
    maxScorePossible = maxScorePossible + dividendsInterestRateMaxScore * dividendsInterestRateWeight;
    consoleLennar(item, finalScore, 'dividends', maxScorePossible);

    // Payment Frequency
    const paymentFrequencyMaxScore = 6;
    const pfWeight = 1;
    const calcPf = scorePaymentFrequency(item['Number of payments per Year'] as number);
    finalScore = finalScore + calcPf * pfWeight;
    maxScorePossible = maxScorePossible + paymentFrequencyMaxScore * pfWeight;
    consoleLennar(item, finalScore, 'pf', maxScorePossible);

    // Country Corruption Level
    const countryCorruptionMaxScore = 10;
    const ccWeight = 10;
    const calcCC = Number(item['country corruption index (100 max)']) / 10;
    finalScore = finalScore + calcCC * ccWeight;
    maxScorePossible = maxScorePossible + countryCorruptionMaxScore * ccWeight;
    consoleLennar(item, finalScore, 'cc', maxScorePossible);

    // Degiro Category Grade
    const degiroCategoryMaxScore = 11;
    const dcWeight = 5;
    const calcDC = scoreDegiroCategory(item['degiro grade | dmitri translation']);
    finalScore = finalScore + calcDC * dcWeight;
    maxScorePossible = maxScorePossible + degiroCategoryMaxScore * dcWeight;
    consoleLennar(item, finalScore, 'dc', maxScorePossible);

    // PE Ratio
    const peRatioMaxScore = 10;
    const peWeight = 9;
    const calcPE = scorePeRatio(item['PE ratio'] as number, item['industry PE'] as number);
    finalScore = finalScore + calcPE * peWeight;
    maxScorePossible = maxScorePossible + peRatioMaxScore * peWeight;
    consoleLennar(item, finalScore, 'pe', maxScorePossible);

    // Stock Graph Analysis
    const stockGraphMaxScore = 10;
    const sgWeight = 1;
    const calcSG = item['stock chart score'];
    finalScore = finalScore + calcSG * sgWeight;
    maxScorePossible = maxScorePossible + stockGraphMaxScore * sgWeight;
    consoleLennar(item, finalScore, 'sg', maxScorePossible);

    // Auditor
    const auditorMaxScore = 10;
    const auditorWeight = 10;
    const calcAuditor = item['Auditor Score'] as number;
    finalScore = finalScore + calcAuditor * auditorWeight;
    maxScorePossible = maxScorePossible + auditorMaxScore * auditorWeight;
    consoleLennar(item, finalScore, 'auditor', maxScorePossible);

    // Fitch Rating
    const fitchRatingMaxScore = 11;
    const fitchWeight = 5;
    const calcFitch = item['fitch rating or equivalent'] as number;
    finalScore = finalScore + calcFitch * fitchWeight;
    maxScorePossible = maxScorePossible + fitchRatingMaxScore * fitchWeight;
    consoleLennar(item, finalScore, 'fitch', maxScorePossible);

    // Moody Rating
    const moodyRatingMaxScore = 11;
    const moodyWeight = 5;
    const calcMoody = item['moody'] as number;
    finalScore = finalScore + calcMoody * moodyWeight;
    maxScorePossible = maxScorePossible + moodyRatingMaxScore * moodyWeight;
    consoleLennar(item, finalScore, 'moody', maxScorePossible);

    // SP Rating
    const spRatingMaxScore = 11;
    const spWeight = 5;
    const calcSP = item['s&p'] as number;
    finalScore = finalScore + calcSP * spWeight;
    maxScorePossible = maxScorePossible + spRatingMaxScore * spWeight;
    consoleLennar(item, finalScore, 'sp', maxScorePossible);

    // Degiro Income Statement
    const degiroIncomeStatementMaxScore = 12;
    const disWeight = 6;
    const calcDIS = scoreDegiroIncomeStatement(
        Number(item['how does their Income Statement Look on Degiro'] as number),
        Number(item['are assets bigger than liabilities consistently'] as number)
    );
    console.log('calcDIS: ', calcDIS);
    finalScore = finalScore + calcDIS * disWeight;
    maxScorePossible = maxScorePossible + degiroIncomeStatementMaxScore * disWeight;
    consoleLennar(item, finalScore, 'dis', maxScorePossible);

    // Year Founded
    const yearFoundedMaxScore = 10;
    const yfWeight = 5;
    const calcYF = scoreYearStarted(item['year started'] as number);
    finalScore = finalScore + calcYF * yfWeight;
    maxScorePossible = maxScorePossible + yearFoundedMaxScore * yfWeight;
    consoleLennar(item, finalScore, 'yf', maxScorePossible);

    // Number Of Employees
    const numberOfEmployeesMaxScore = 10;
    const neWeight = 6;
    const calcNE = scoreNumberOfEmployees(item['number of employees'] as number);
    finalScore = finalScore + calcNE * neWeight;
    maxScorePossible = maxScorePossible + numberOfEmployeesMaxScore * neWeight;
    consoleLennar(item, finalScore, 'ne', maxScorePossible);

    // Integrity Score
    const integrityScoreMaxScore = 10;
    const isWeight = 10;
    const calcIS = scoreIntegrity(item['any dirt on them (0 being clean, 10 dirty)'] as number);
    finalScore = finalScore + calcIS * isWeight;
    maxScorePossible = maxScorePossible + integrityScoreMaxScore * isWeight;
    consoleLennar(item, finalScore, 'is', maxScorePossible);

    // Held By Big Investors
    const heldByBigInvestorsMaxScore = 10;
    const hbiWeight = 4;
    const calcHBI = item['Held By Big Investors'] as number;
    finalScore = finalScore + calcHBI * hbiWeight;
    maxScorePossible = maxScorePossible + heldByBigInvestorsMaxScore * hbiWeight;
    consoleLennar(item, finalScore, 'hbi', maxScorePossible);

    // Share Price
    const sharePrice = item['Share Price in euro'] as number;

    // Trading Volume
    const tradingVolumeMaxScore = 10;
    const tvWeight = 7;
    const calcTV = scoreTradeVolume(
        sharePrice,
        item['avg trading volume, last 3 months in units in Millions'] as number
    );
    finalScore = finalScore + calcTV * tvWeight;
    maxScorePossible = maxScorePossible + tradingVolumeMaxScore * tvWeight;
    consoleLennar(item, finalScore, 'tv', maxScorePossible);

    // Years To Earnings Match Share
    const yearsToEarningsMatchShareMaxScore = 10;
    const ytemWeight = 5;
    const calcYTEM = yearsForEarningsMatchPrice(
        sharePrice,
        item['EPS (earning per share) average for the past 10 years in euro currency'] as number
    );
    finalScore = finalScore + calcYTEM * ytemWeight;
    maxScorePossible = maxScorePossible + yearsToEarningsMatchShareMaxScore * ytemWeight;
    consoleLennar(item, finalScore, 'ytem', maxScorePossible);

    // Share To Book
    const shareToBookMaxScore = 10;
    const stbWeight = 9;
    const calcSTB = scoreShareBookValue(sharePrice, item['share / book value'] as number);
    finalScore = finalScore + calcSTB * stbWeight;
    maxScorePossible = maxScorePossible + shareToBookMaxScore * stbWeight;
    consoleLennar(item, finalScore, 'stb', maxScorePossible);

    // Equity Average
    const equityAverageMaxScore = 10;
    const eaWeight = 10;
    const calcEA = scoreEquityAverage(item['equity average past 10 years in millions euro'] as number);
    finalScore = finalScore + calcEA * eaWeight;
    maxScorePossible = maxScorePossible + equityAverageMaxScore * eaWeight;
    consoleLennar(item, finalScore, 'ea', maxScorePossible);

    // EBITDA
    const ebitdaMaxScore = 10;
    const ebitdaWeight = 10;
    const calcEBITDA = scoreEBITDAAverage(item['EBITDA average for the past 10 years in euros in millions?'] as number);
    finalScore = finalScore + calcEBITDA * ebitdaWeight;
    maxScorePossible = maxScorePossible + ebitdaMaxScore * ebitdaWeight;
    consoleLennar(item, finalScore, 'ebitda', maxScorePossible);

    // Net Profit
    const netProfitMaxScore = 10;
    const netProfitWeight = 10;
    const calcNetProfit = scoreNetProfitAverage(
        item['annual net profit average in the past 10 years, in euros in millions?'] as number
    );
    finalScore = finalScore + calcNetProfit * netProfitWeight;
    maxScorePossible = maxScorePossible + netProfitMaxScore * netProfitWeight;
    consoleLennar(item, finalScore, 'netProfit', maxScorePossible);

    // Debt To Equity
    const debtToEquityMaxScore = 10;
    const dteWeight = 10;
    const calcDTE = scoreDebtToEquity(item['debt / equity as %'] as number);
    finalScore = finalScore + calcDTE * dteWeight;
    maxScorePossible = maxScorePossible + debtToEquityMaxScore * dteWeight;
    consoleLennar(item, finalScore, 'dte', maxScorePossible);

    // Return On Equity
    const returnOnEquityMaxScore = 10;
    const roeWeight = 6;
    const calcROE = scoreReturnOnEquity(item['return on equity'] as number);
    finalScore = finalScore + calcROE * roeWeight;
    maxScorePossible = maxScorePossible + returnOnEquityMaxScore * roeWeight;
    consoleLennar(item, finalScore, 'roe', maxScorePossible);

    // Market Cap
    const marketCapMaxScore = 10;
    const mcWeight = 1;
    const calcMC = scoreMarketCap(
        item['market cap in Billions EUR (ask AI) (i.e. hype value... total shares X current share value)'] as number
    );
    finalScore = finalScore + calcMC * mcWeight;
    maxScorePossible = maxScorePossible + marketCapMaxScore * mcWeight;
    consoleLennar(item, finalScore, 'mc', maxScorePossible);

    // Part Of Index
    const partOfIndexMaxScore = 3;
    const poimWeight = 5;
    const calcPOIM = item[
        'is company part of any index / index fund (e.g. MSCI world fund), grade as: 0 = No indexes hold it (worst), 1 = some indexes hold it, 2 = many indexes hold it, 3 = almost ALL hold it (the best)'
    ] as number;
    finalScore = finalScore + calcPOIM * poimWeight;
    maxScorePossible = maxScorePossible + partOfIndexMaxScore * poimWeight;
    consoleLennar(item, finalScore, 'poim', maxScorePossible);

    // Held By Billionaires
    const heldByBillionairesMaxScore = 1;
    const hbbWeight = 6;
    const calcHBB = item['is held by Billionaires? ( use percentage of total portfolios, MAX 1)'] as number;
    finalScore = finalScore + calcHBB * hbbWeight;
    maxScorePossible = maxScorePossible + heldByBillionairesMaxScore * hbbWeight;
    consoleLennar(item, finalScore, 'hbb', maxScorePossible);

    // Valuation
    const valuationMaxScore = 6;
    const valWeight = 2;
    const calcVal = item['valuation, max 6'] as number;
    finalScore = finalScore + calcVal * valWeight;
    maxScorePossible = maxScorePossible + valuationMaxScore * valWeight;
    consoleLennar(item, finalScore, 'val', maxScorePossible);

    // Future Growth
    const futureGrowthMaxScore = 6;
    const fgWeight = 2;
    const calcFG = item['future growth, 6 max'] as number;
    finalScore = finalScore + calcFG * fgWeight;
    maxScorePossible = maxScorePossible + futureGrowthMaxScore * fgWeight;
    consoleLennar(item, finalScore, 'fg', maxScorePossible);

    // Past Performance
    const pastPerformanceMaxScore = 6;
    const ppWeight = 2;
    const calcPP = item['past performance, 6 mx'] as number;
    finalScore = finalScore + calcPP * ppWeight;
    maxScorePossible = maxScorePossible + pastPerformanceMaxScore * ppWeight;
    consoleLennar(item, finalScore, 'pp', maxScorePossible);

    // Financial Health
    const financialHealthMaxScore = 6;
    const fhWeight = 2;
    const calcFH = item['financial health, max 6'] as number;
    finalScore = finalScore + calcFH * fhWeight;
    maxScorePossible = maxScorePossible + financialHealthMaxScore * fhWeight;
    consoleLennar(item, finalScore, 'fh', maxScorePossible);

    // Dividends
    const dividendsMaxScore = 6;
    const divWeight = 2;
    const calcDiv = item['dividends, max 6'] as number;
    finalScore = finalScore + calcDiv * divWeight;
    maxScorePossible = maxScorePossible + dividendsMaxScore * divWeight;
    consoleLennar(item, finalScore, 'div', maxScorePossible);

    // Management
    const managementMaxScore = 4;
    const mgWeight = 2;
    const calcMG = item['management, 4 max'] as number;
    finalScore = finalScore + calcMG * mgWeight;
    maxScorePossible = maxScorePossible + managementMaxScore * mgWeight;
    consoleLennar(item, finalScore, 'mg', maxScorePossible);

    // end
    const finalReturn = ((finalScore / maxScorePossible) * dmitriScoreConversionNumber).toFixed(2);
    // console.log('============================');
    // console.log('company name', item['Company Name']);
    // console.log("finalReturn: ", finalReturn);

    return finalReturn;
}

export default dmitriScoreCustomFn;

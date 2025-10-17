import {
    scorePaymentFrequency,
    scoreDegiroCategory,
    gradeAgainstEuStem,
    scorePeRatio,
    scoreNetProfitMargin,
    scoreDegiroIncomeStatement,
    degiroAnalystRatingToScore,
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
import { dmitriScoreConversionNumber } from '../globalVars';

export const COMPANY_ANALYZED = 'dummy';

function consoleLennar(allValues: InvestmentRecord, currentScore: number, criteria: string, currentMaxScore: number) {
    if (allValues['Company Name'] === COMPANY_ANALYZED) {
        console.log(criteria, ': ', currentScore, '...', 'maxScore: ', currentMaxScore);
    }
}

function dmitriScoreCustomFn(info: any) {
    const value = info.getValue(); // this is DmitriScore column

    const item: InvestmentRecord = info.row.original;

    const companyAnalysisActive = item['Company Name'] === COMPANY_ANALYZED;

    if ((value || value === 0) && !companyAnalysisActive) {
        return Number(value.toFixed(2));
    }

    let finalScore = 0;
    let maxScorePossible = 0;

    if (!!companyAnalysisActive) {
        console.log('++++++++++++++++++++++++++++');
        console.log('Company Name: ', COMPANY_ANALYZED);
        console.log('++++++++++++++++++++++++++++');

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
        consoleLennar(item, finalScore, 'payment frequency', maxScorePossible);

        // Country Corruption Level
        const countryCorruptionMaxScore = 10;
        const ccWeight = 10;
        const calcCC = Number(item['country corruption index (100 max)']) / 10;
        finalScore = finalScore + calcCC * ccWeight;
        maxScorePossible = maxScorePossible + countryCorruptionMaxScore * ccWeight;
        consoleLennar(item, finalScore, 'country corruption', maxScorePossible);

        // Country science score
        const countryScienceScoreMaxScore = 10;
        const csWeight = 10;
        const calcCS = Number(item['Country science score']);
        finalScore = finalScore + calcCS * csWeight;
        maxScorePossible = maxScorePossible + countryScienceScoreMaxScore * csWeight;
        consoleLennar(item, finalScore, 'country science score', maxScorePossible);

        // Percentage of Population in Stem in Workforce
        const percentageOfPopulationInStemMaxScore = 10;
        const popWeight = 2;
        const calcPOP = gradeAgainstEuStem(Number(item['Percentage of Population in Stem in Workforce']));
        finalScore = finalScore + calcPOP * popWeight;
        maxScorePossible = maxScorePossible + percentageOfPopulationInStemMaxScore * popWeight;
        consoleLennar(item, finalScore, 'Percentage of Population in Stem in Workforce', maxScorePossible);

        // WhiteSmartAsianIndex (max 100)
        const whiteSmartAsianIndexMaxScore = 10;
        const wsaiWeight = 10;
        const calcWSAI = Number(item['WhiteSmartAsianIndex (max 100)']) / 10;
        finalScore = finalScore + calcWSAI * wsaiWeight;
        maxScorePossible = maxScorePossible + whiteSmartAsianIndexMaxScore * wsaiWeight;
        consoleLennar(item, finalScore, 'WhiteSmartAsianIndex', maxScorePossible);

        // CompanyMonopolyPowerAndMoat
        if (item['CompanyMonopolyPowerAndMoat'] !== null) {
            const companyMonopolyPowerAndMoatMaxScore = 10;
            const cmpWeight = 10;
            const calcCMP = Number(item['CompanyMonopolyPowerAndMoat']);
            finalScore = finalScore + calcCMP * cmpWeight;
            maxScorePossible = maxScorePossible + companyMonopolyPowerAndMoatMaxScore * cmpWeight;
            consoleLennar(item, finalScore, 'CompanyMonopolyPowerAndMoat', maxScorePossible);
        }

        // Degiro Category Grade
        const degiroCategoryMaxScore = 11;
        const dcWeight = 5;
        const calcDC = scoreDegiroCategory(item['degiro grade | dmitri translation']);
        finalScore = finalScore + calcDC * dcWeight;
        maxScorePossible = maxScorePossible + degiroCategoryMaxScore * dcWeight;
        consoleLennar(item, finalScore, 'degiro grade', maxScorePossible);

        // PE Ratio
        const itemPeRatio = item['PE ratio'];
        const noPeRatio = itemPeRatio === null || itemPeRatio === 'not available';
        const peRatioMaxScore = 10;
        const peWeight = 9;
        const calcPE = noPeRatio ? 0 : scorePeRatio(item['PE ratio'] as number, item['industry PE'] as number);
        finalScore = finalScore + calcPE * peWeight;
        maxScorePossible = maxScorePossible + peRatioMaxScore * peWeight;
        consoleLennar(item, finalScore, 'pe ratio', maxScorePossible);

        // Net Profit Margin
        const itemNetProfitMargin = item['Net Profit Margin AVG 5 years'];
        const noNetProfitMargin = itemNetProfitMargin === null || itemNetProfitMargin === 'not available';
        const netProfitMarginMaxScore = 10;
        const netProfitMarginWeight = 10;
        const calcGM = noNetProfitMargin
            ? 0
            : scoreNetProfitMargin(
                  item['Net Profit Margin AVG 5 years'] as number,
                  item['Net Profit Margin AVG 5 years (industry)'] as number
              );
        finalScore = finalScore + calcGM * netProfitMarginWeight;
        maxScorePossible = maxScorePossible + netProfitMarginMaxScore * netProfitMarginWeight;
        consoleLennar(item, finalScore, 'gross margin', maxScorePossible);

        // Return on Equity 5ya
        const itemReturnOnEquity5ya = item['Return On Equity 5ya'];
        const noReturnOnEquity5ya = itemReturnOnEquity5ya === null || itemReturnOnEquity5ya === 'not available';
        const returnOnEquity5yaMaxScore = 10;
        const returnOnEquity5yaWeight = 10;
        const calcROE5ya = noReturnOnEquity5ya
            ? 0
            : scoreNetProfitMargin(
                  item['Return On Equity 5ya'] as number,
                  item['Return On Equity 5ya (industry)'] as number
              );
        finalScore = finalScore + calcROE5ya * returnOnEquity5yaWeight;
        maxScorePossible = maxScorePossible + returnOnEquity5yaMaxScore * returnOnEquity5yaWeight;
        consoleLennar(item, finalScore, 'return on equity 5ya', maxScorePossible);

        // 5 Year EPS Growth
        const item5YearEPSGrowth = item['5 Year EPS Growth'];
        const no5YearEPSGrowth = item5YearEPSGrowth === null || item5YearEPSGrowth === 'not available';
        const epsGrowth5yaMaxScore = 10;
        const epsGrowth5yaWeight = 10;
        const calcEPSGrowth5ya = no5YearEPSGrowth
            ? 0
            : scoreNetProfitMargin(item['5 Year EPS Growth'] as number, item['5 Year EPS Growth (industry)'] as number);
        finalScore = finalScore + calcEPSGrowth5ya * epsGrowth5yaWeight;
        maxScorePossible = maxScorePossible + epsGrowth5yaMaxScore * epsGrowth5yaWeight;
        consoleLennar(item, finalScore, '5 Year EPS Growth', maxScorePossible);

        // 5 Year Sales Growth
        const item5YearSalesGrowth = item['5 Year Sales Growth'];
        const no5YearSalesGrowth = item5YearSalesGrowth === null || item5YearSalesGrowth === 'not available';
        const salesGrowth5yaMaxScore = 10;
        const salesGrowth5yaWeight = 10;
        const calcSalesGrowth5ya = no5YearSalesGrowth
            ? 0
            : scoreNetProfitMargin(
                  item['5 Year Sales Growth'] as number,
                  item['5 Year Sales Growth (industry)'] as number
              );
        finalScore = finalScore + calcSalesGrowth5ya * salesGrowth5yaWeight;
        maxScorePossible = maxScorePossible + salesGrowth5yaMaxScore * salesGrowth5yaWeight;
        consoleLennar(item, finalScore, '5 Year Sales Growth', maxScorePossible);

        // Net Income/Employee
        const itemNetIncomeEmployee = item['Net Income/Employee'];
        const noNetIncomeEmployee = itemNetIncomeEmployee === null || itemNetIncomeEmployee === 'not available';
        const netIncomeEmployeeMaxScore = 10;
        const netIncomeEmployeeWeight = 10;
        const calcNetIncomeEmployee = noNetIncomeEmployee
            ? 0
            : scoreNetProfitMargin(
                  item['Net Income/Employee'] as number,
                  item['Net Income/Employee (industry)'] as number
              );
        finalScore = finalScore + calcNetIncomeEmployee * netIncomeEmployeeWeight;
        maxScorePossible = maxScorePossible + netIncomeEmployeeMaxScore * netIncomeEmployeeWeight;
        consoleLennar(item, finalScore, 'net income/employee', maxScorePossible);

        // Stock Graph Analysis - redundant as of: 24-Sep-2025
        // const stockGraphMaxScore = 10;
        // const sgWeight = 1;
        // const calcSG = item['stock chart score'];
        // finalScore = finalScore + calcSG * sgWeight;
        // maxScorePossible = maxScorePossible + stockGraphMaxScore * sgWeight;
        // consoleLennar(item, finalScore, 'stock graph', maxScorePossible);

        // Auditor
        const auditorMaxScore = 10;
        const auditorWeight = 10;
        const calcAuditor = item['Auditor Score'] as number;
        finalScore = finalScore + calcAuditor * auditorWeight;
        maxScorePossible = maxScorePossible + auditorMaxScore * auditorWeight;
        consoleLennar(item, finalScore, 'auditor', maxScorePossible);

        // Fitch Rating
        if (item['fitch rating or equivalent'] && typeof item['fitch rating or equivalent'] === 'number') {
            const fitchRatingMaxScore = 11;
            const fitchWeight = 5;
            const calcFitch = item['fitch rating or equivalent'] as number;
            finalScore = finalScore + calcFitch * fitchWeight;
            maxScorePossible = maxScorePossible + fitchRatingMaxScore * fitchWeight;
            consoleLennar(item, finalScore, 'fitch', maxScorePossible);
        }

        // SP Rating
        if (item['s&p'] && typeof item['s&p'] === 'number') {
            const spRatingMaxScore = 11;
            const spWeight = 5;
            const calcSP = item['s&p'] as number;
            finalScore = finalScore + calcSP * spWeight;
            maxScorePossible = maxScorePossible + spRatingMaxScore * spWeight;
            consoleLennar(item, finalScore, 'sp', maxScorePossible);
        }

        // Moody Rating
        if (item['moody'] && typeof item['moody'] === 'number') {
            const moodyRatingMaxScore = 11;
            const moodyWeight = 5;
            const calcMoody = item['moody'] as number;
            finalScore = finalScore + calcMoody * moodyWeight;
            maxScorePossible = maxScorePossible + moodyRatingMaxScore * moodyWeight;
            consoleLennar(item, finalScore, 'moody', maxScorePossible);
        }

        // Degiro Income Statement
        const degiroIncomeStatementMaxScore = 12;
        const disWeight = 6;
        const calcDIS = scoreDegiroIncomeStatement(
            Number(item['how does their Income Statement Look on Degiro'] as number),
            Number(item['are assets bigger than liabilities consistently'] as number)
        );
        finalScore = finalScore + calcDIS * disWeight;
        maxScorePossible = maxScorePossible + degiroIncomeStatementMaxScore * disWeight;
        consoleLennar(item, finalScore, 'degiro income statement', maxScorePossible);

        // Degiro Analysts Score
        const degiroAnalystsScoreMaxScore = 10;
        const dasWeight = 1;
        const calcDAS = degiroAnalystRatingToScore(item['Degiro Analysts Score'] as number);
        finalScore = finalScore + calcDAS * dasWeight;
        maxScorePossible = maxScorePossible + degiroAnalystsScoreMaxScore * dasWeight;
        consoleLennar(item, finalScore, 'degiro analysts score', maxScorePossible);

        // investingComAnalystsScore
        const investingComAnalystsScoreMaxScore = 10;
        const iasWeight = 4;
        const calcIAS = (item['investingComAnalystsScore'] as number) * 10;
        finalScore = finalScore + calcIAS * iasWeight;
        maxScorePossible = maxScorePossible + investingComAnalystsScoreMaxScore * iasWeight;
        consoleLennar(item, finalScore, 'investing.com analysts score', maxScorePossible);

        // Year Founded
        const yearFoundedMaxScore = 10;
        const yfWeight = 5;
        const calcYF = scoreYearStarted(item['year started'] as number);
        finalScore = finalScore + calcYF * yfWeight;
        maxScorePossible = maxScorePossible + yearFoundedMaxScore * yfWeight;
        consoleLennar(item, finalScore, 'year founded', maxScorePossible);

        // Number Of Employees
        const numberOfEmployeesMaxScore = 10;
        const neWeight = 6;
        const calcNE = scoreNumberOfEmployees(item['number of employees'] as number);
        finalScore = finalScore + calcNE * neWeight;
        maxScorePossible = maxScorePossible + numberOfEmployeesMaxScore * neWeight;
        consoleLennar(item, finalScore, 'number of employees', maxScorePossible);

        // Integrity Score
        const integrityScoreMaxScore = 10;
        const isWeight = 10;
        const calcIS = scoreIntegrity(item['any dirt on them (0 being clean, 10 dirty)'] as number);
        finalScore = finalScore + calcIS * isWeight;
        maxScorePossible = maxScorePossible + integrityScoreMaxScore * isWeight;
        consoleLennar(item, finalScore, 'integrity', maxScorePossible);

        // Held By Big Investors
        const heldByBigInvestorsMaxScore = 10;
        const hbiWeight = 4;
        const calcHBI = item['Held By Big Investors'] as number;
        console.log('calcHBI: ', calcHBI);
        finalScore = finalScore + calcHBI * hbiWeight;
        maxScorePossible = maxScorePossible + heldByBigInvestorsMaxScore * hbiWeight;
        consoleLennar(item, finalScore, 'held by big investors', maxScorePossible);

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
        consoleLennar(item, finalScore, 'trading volume', maxScorePossible);

        // Years To Earnings Match Share
        const yearsToEarningsMatchShareMaxScore = 10;
        const ytemWeight = 5;
        const calcYTEM = yearsForEarningsMatchPrice(
            sharePrice,
            item['EPS (earning per share) average for the past 10 years in euro currency'] as number
        );
        finalScore = finalScore + calcYTEM * ytemWeight;
        maxScorePossible = maxScorePossible + yearsToEarningsMatchShareMaxScore * ytemWeight;
        consoleLennar(item, finalScore, 'years to earnings match share', maxScorePossible);

        // Share To Book
        const shareToBookMaxScore = 10;
        const stbWeight = 9;
        const calcSTB = scoreShareBookValue(sharePrice, item['share / book value'] as number);
        finalScore = finalScore + calcSTB * stbWeight;
        maxScorePossible = maxScorePossible + shareToBookMaxScore * stbWeight;
        consoleLennar(item, finalScore, 'share to book', maxScorePossible);

        // Equity Average
        const equityAverageMaxScore = 10;
        const eaWeight = 10;
        const calcEA = scoreEquityAverage(item['equity average past 10 years in millions euro'] as number);
        finalScore = finalScore + calcEA * eaWeight;
        maxScorePossible = maxScorePossible + equityAverageMaxScore * eaWeight;
        consoleLennar(item, finalScore, 'equity average', maxScorePossible);

        // EBITDA
        const ebitdaMaxScore = 10;
        const ebitdaWeight = 10;
        const calcEBITDA = scoreEBITDAAverage(
            item['EBITDA average for the past 10 years in euros in millions?'] as number
        );
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
        consoleLennar(item, finalScore, 'debt to equity', maxScorePossible);

        // Return On Equity
        const returnOnEquityMaxScore = 10;
        const roeWeight = 6;
        const calcROE = scoreReturnOnEquity(item['return on equity'] as number);
        finalScore = finalScore + calcROE * roeWeight;
        maxScorePossible = maxScorePossible + returnOnEquityMaxScore * roeWeight;
        consoleLennar(item, finalScore, 'return on equity', maxScorePossible);

        // Market Cap
        const marketCapMaxScore = 10;
        const mcWeight = 1;
        const calcMC = scoreMarketCap(
            item[
                'market cap in Billions EUR (ask AI) (i.e. hype value... total shares X current share value)'
            ] as number
        );
        finalScore = finalScore + calcMC * mcWeight;
        maxScorePossible = maxScorePossible + marketCapMaxScore * mcWeight;
        consoleLennar(item, finalScore, 'market cap', maxScorePossible);

        // Part Of Index
        const partOfIndexMaxScore = 3;
        const poimWeight = 5;
        const calcPOIM = item['indexesHoldIt'] as number;
        finalScore = finalScore + calcPOIM * poimWeight;
        maxScorePossible = maxScorePossible + partOfIndexMaxScore * poimWeight;
        consoleLennar(item, finalScore, 'part of index', maxScorePossible);

        // Held By Billionaires
        const heldByBillionairesMaxScore = 1;
        const hbbWeight = 6;
        const calcHBB = item['is held by Billionaires? ( use percentage of total portfolios, MAX 1)'] as number;
        finalScore = finalScore + calcHBB * hbbWeight;
        maxScorePossible = maxScorePossible + heldByBillionairesMaxScore * hbbWeight;
        consoleLennar(item, finalScore, 'held by billionaires', maxScorePossible);

        // SIMPLY WALL STREET METRICS

        // Valuation
        const valuationMaxScore = 6;
        const valWeight = 2;
        const calcVal = item['valuation, max 6'] as number;
        finalScore = finalScore + calcVal * valWeight;
        maxScorePossible = maxScorePossible + valuationMaxScore * valWeight;
        consoleLennar(item, finalScore, 'valuation', maxScorePossible);

        // Future Growth
        const futureGrowthMaxScore = 6;
        const fgWeight = 2;
        const calcFG = item['future growth, 6 max'] as number;
        finalScore = finalScore + calcFG * fgWeight;
        maxScorePossible = maxScorePossible + futureGrowthMaxScore * fgWeight;
        consoleLennar(item, finalScore, 'future growth', maxScorePossible);

        // Past Performance
        const pastPerformanceMaxScore = 6;
        const ppWeight = 2;
        const calcPP = item['past performance, 6 mx'] as number;
        finalScore = finalScore + calcPP * ppWeight;
        maxScorePossible = maxScorePossible + pastPerformanceMaxScore * ppWeight;
        consoleLennar(item, finalScore, 'past performance', maxScorePossible);

        // Financial Health
        const financialHealthMaxScore = 6;
        const fhWeight = 2;
        const calcFH = item['financial health, max 6'] as number;
        finalScore = finalScore + calcFH * fhWeight;
        maxScorePossible = maxScorePossible + financialHealthMaxScore * fhWeight;
        consoleLennar(item, finalScore, 'financial health', maxScorePossible);

        // Dividends
        const dividendsMaxScore = 6;
        const divWeight = 2;
        const calcDiv = item['dividends, max 6'] as number;
        finalScore = finalScore + calcDiv * divWeight;
        maxScorePossible = maxScorePossible + dividendsMaxScore * divWeight;
        consoleLennar(item, finalScore, 'dividends, simply wall st.', maxScorePossible);

        // Management
        const managementMaxScore = 4;
        const mgWeight = 2;
        const calcMG = item['management, 4 max'] as number;
        finalScore = finalScore + calcMG * mgWeight;
        maxScorePossible = maxScorePossible + managementMaxScore * mgWeight;
        consoleLennar(item, finalScore, 'management', maxScorePossible);

        // AI score
        const aiMaxScore = 11;
        const aiWeight = 7;
        const calcAI = item['Pure AI Average Grade'] as number;
        finalScore = finalScore + calcAI * aiWeight;
        maxScorePossible = maxScorePossible + aiMaxScore * aiWeight;
        consoleLennar(item, finalScore, 'AI score', maxScorePossible);
    }

    // end
    const finalReturn = ((finalScore / maxScorePossible) * dmitriScoreConversionNumber).toFixed(2);
    console.log('============================');
    console.log('FINAL SCORE');
    console.log('============================');
    console.log('company name', item['Company Name']);
    console.log('final Dmitri Score: ', finalReturn);

    return finalReturn;
}

export default dmitriScoreCustomFn;

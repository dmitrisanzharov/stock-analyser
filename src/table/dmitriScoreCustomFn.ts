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
    scoreMarketCap,
    growthScore5Years,
    growthScore5YearsDividends,
    scoreCurrentRatioCompany,
    scoreFitchRating,
    FITCH_RATING_MAP,
    DEGIRO_CATEGORIES_ARRAY,
    ratingOutlook,
    outlookMap,
    OUTLOOK_MAX_SCORE
} from '../helpers/allOther';
import {
    InvestmentRecord,
    notApplicableFieldsConst,
    NotApplicableFields,
    NOT_APPLICABLE_STRING,
    FitchRatingType,
    RatingsOutlookType
} from '../types';
import { dmitriScoreConversionNumber } from '../globalVars';

export const COMPANY_ANALYZED = 'generalTestCompany';

const allowedArrayItems = [...Object.keys(FITCH_RATING_MAP), ...DEGIRO_CATEGORIES_ARRAY, ...Object.keys(outlookMap)];

function consoleLennar(
    allValues: InvestmentRecord,
    currentScore: number,
    criteria: string,
    currentMaxScore: number,
    itemValue: any
) {
    if (allValues['Company Name'] === COMPANY_ANALYZED) {
        const skippedString = 'SKIPPED';

        // NOTE: Here we check for ALLOWED TYPES... Number | 'na' | 0 | notApplicable;  exception are Degiro Grades

        const allowedValuesAndTypes =
            typeof itemValue === 'number' || itemValue === 0 || allowedArrayItems.includes(itemValue);

        const skip = allowedValuesAndTypes ? '' : skippedString;
        console.log(criteria, ': ', currentScore, '...', 'maxScore: ', currentMaxScore, skip);

        if (skip === skippedString) {
            throw new Error('SKIPPED in: ' + criteria);
        }
    }
};

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

        console.log('main ITEM: ', item);
        console.log('fitch: ', item['fitch rating']);
        console.log('============================');

        // Dividends Interest Rate
        const dividendsInterestRateItem = item['Yield as % (pref, degiro, 5 years)'];
        const dividendsInterestRateMaxScore = 10;
        const dividendsInterestRateWeight = 4;
        const dividendsInterestRateScore = Number(dividendsInterestRateItem);
        finalScore = finalScore + dividendsInterestRateScore * dividendsInterestRateWeight;
        maxScorePossible = maxScorePossible + dividendsInterestRateMaxScore * dividendsInterestRateWeight;
        consoleLennar(item, finalScore, 'dividends', maxScorePossible, dividendsInterestRateItem);

        // Payment Frequency
        const paymentFrequencyItem = item['Number of payments per Year'];
        const paymentFrequencyMaxScore = 6;
        const pfWeight = 1;
        const calcPf = scorePaymentFrequency(paymentFrequencyItem as number);
        finalScore = finalScore + calcPf * pfWeight;
        maxScorePossible = maxScorePossible + paymentFrequencyMaxScore * pfWeight;
        consoleLennar(item, finalScore, 'payment frequency', maxScorePossible, paymentFrequencyItem);

        // Country Corruption Level
        const countryCorruptionItem = item['country corruption index (100 max)'];
        const countryCorruptionMaxScore = 10;
        const ccWeight = 10;
        const calcCC = Number(countryCorruptionItem) / 10;
        finalScore = finalScore + calcCC * ccWeight;
        maxScorePossible = maxScorePossible + countryCorruptionMaxScore * ccWeight;
        consoleLennar(item, finalScore, 'country corruption', maxScorePossible, countryCorruptionItem);

        // Country science score
        const countryScienceScoreItem = item['Country science score'];
        const countryScienceScoreMaxScore = 10;
        const csWeight = 10;
        const calcCS = Number(countryScienceScoreItem);
        finalScore = finalScore + calcCS * csWeight;
        maxScorePossible = maxScorePossible + countryScienceScoreMaxScore * csWeight;
        consoleLennar(item, finalScore, 'country science score', maxScorePossible, countryScienceScoreItem);

        // Percentage of Population in Stem in Workforce
        const percentageOfPopulationInStemItem = item['Percentage of Population in Stem in Workforce'];
        const percentageOfPopulationInStemMaxScore = 10;
        const popWeight = 2;
        const calcPOP = gradeAgainstEuStem(Number(percentageOfPopulationInStemItem));
        finalScore = finalScore + calcPOP * popWeight;
        maxScorePossible = maxScorePossible + percentageOfPopulationInStemMaxScore * popWeight;
        consoleLennar(
            item,
            finalScore,
            'Percentage of Population in Stem in Workforce',
            maxScorePossible,
            percentageOfPopulationInStemItem
        );

        // WhiteSmartAsianIndex (max 100)
        const itemWhiteSmartAsianIndex = item['WhiteSmartAsianIndex (max 100)'];
        const whiteSmartAsianIndexMaxScore = 10;
        const wsaiWeight = 10;
        const calcWSAI = Number(itemWhiteSmartAsianIndex) / 10;
        finalScore = finalScore + calcWSAI * wsaiWeight;
        maxScorePossible = maxScorePossible + whiteSmartAsianIndexMaxScore * wsaiWeight;
        consoleLennar(item, finalScore, 'WhiteSmartAsianIndex', maxScorePossible, itemWhiteSmartAsianIndex);

        // CompanyMonopolyPowerAndMoat
        const companyMonopolyPowerAndMoatItem = item['CompanyMonopolyPowerAndMoat'];
        const companyMonopolyPowerAndMoatMaxScore = 10;
        const cmpWeight = 10;
        const calcCMP = Number(companyMonopolyPowerAndMoatItem);
        finalScore = finalScore + calcCMP * cmpWeight;
        maxScorePossible = maxScorePossible + companyMonopolyPowerAndMoatMaxScore * cmpWeight;
        consoleLennar(
            item,
            finalScore,
            'CompanyMonopolyPowerAndMoat',
            maxScorePossible,
            companyMonopolyPowerAndMoatItem
        );

        // Degiro Category Grade
        const degiroCategoryItem = item['degiro grade | dmitri translation'];
        const degiroCategoryMaxScore = 11;
        const dcWeight = 5;
        const calcDC = scoreDegiroCategory(degiroCategoryItem);
        finalScore = finalScore + calcDC * dcWeight;
        maxScorePossible = maxScorePossible + degiroCategoryMaxScore * dcWeight;
        consoleLennar(item, finalScore, 'degiro grade', maxScorePossible, degiroCategoryItem);

        // PE Ratio
        const itemPeRatio = item['PE ratio'];
        const noPeRatio = itemPeRatio === null || itemPeRatio === 'na';
        const peRatioMaxScore = 10;
        const peWeight = 9;
        const calcPE = noPeRatio ? 0 : scorePeRatio(item['PE ratio'] as number, item['industry PE'] as number);
        finalScore = finalScore + calcPE * peWeight;
        maxScorePossible = maxScorePossible + peRatioMaxScore * peWeight;
        consoleLennar(item, finalScore, 'pe ratio', maxScorePossible, itemPeRatio);

        // Net Profit Margin
        const itemNetProfitMargin = item['Net Profit Margin AVG 5 years'];
        const noNetProfitMargin = itemNetProfitMargin === null || itemNetProfitMargin === 'na';
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
        consoleLennar(item, finalScore, 'gross margin', maxScorePossible, itemNetProfitMargin);

        // Return on Equity 5ya
        const itemReturnOnEquity5ya = item['Return On Equity 5ya'];
        const noReturnOnEquity5ya = itemReturnOnEquity5ya === null || itemReturnOnEquity5ya === 'na';
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
        consoleLennar(item, finalScore, 'return on equity 5ya', maxScorePossible, itemReturnOnEquity5ya);

        // 5 Year EPS Growth
        const item5YearEPSGrowth = item['5 Year EPS Growth'];
        const no5YearEPSGrowth = item5YearEPSGrowth === null || item5YearEPSGrowth === 'na';
        const epsGrowth5yaMaxScore = 10;
        const epsGrowth5yaWeight = 10;
        const calcEPSGrowth5ya = no5YearEPSGrowth
            ? 0
            : scoreNetProfitMargin(item['5 Year EPS Growth'] as number, item['5 Year EPS Growth (industry)'] as number);
        finalScore = finalScore + calcEPSGrowth5ya * epsGrowth5yaWeight;
        maxScorePossible = maxScorePossible + epsGrowth5yaMaxScore * epsGrowth5yaWeight;
        consoleLennar(item, finalScore, '5 Year EPS Growth', maxScorePossible, item5YearEPSGrowth);

        // 5 Year Sales Growth
        const item5YearSalesGrowth = item['5 Year Sales Growth'];
        const no5YearSalesGrowth = item5YearSalesGrowth === null || item5YearSalesGrowth === 'na';
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
        consoleLennar(item, finalScore, '5 Year Sales Growth', maxScorePossible, item5YearSalesGrowth);

        // Net Income/Employee
        const itemNetIncomeEmployee = item['Net Income/Employee'];
        const noNetIncomeEmployee = itemNetIncomeEmployee === null || itemNetIncomeEmployee === 'na';
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
        consoleLennar(item, finalScore, 'net income/employee', maxScorePossible, itemNetIncomeEmployee);

        // 5 Year Growth Analysis - Total (Capital Gains + Dividends)
        const itemTotalGrowth5ya = item['finalGrowth_till_16/10/2025'];
        const noItemTotalGrowth5ya: boolean = notApplicableFieldsConst.includes(
            itemNetProfitMargin as NotApplicableFields
        );
        const totalGrowth5yaMaxScore = 10;
        const totalGrowth5yaWeight = 10;
        const calcTotalGrowth5ya = noItemTotalGrowth5ya ? 0 : growthScore5Years(itemTotalGrowth5ya as number);
        finalScore = finalScore + calcTotalGrowth5ya * totalGrowth5yaWeight;
        maxScorePossible = maxScorePossible + totalGrowth5yaMaxScore * totalGrowth5yaWeight;
        consoleLennar(item, finalScore, 'total growth 5ya', maxScorePossible, itemTotalGrowth5ya);

        // 5 Year Growth Analysis - Dividends
        const itemTotalGrowth5yaDividends = item['dividendsAsPercentageOfTotalGrowth_till_16/10/2025'];
        const noItemTotalGrowth5yaDividends: boolean = notApplicableFieldsConst.includes(
            itemNetProfitMargin as NotApplicableFields
        );
        const totalGrowth5yaMaxScoreDividends = 10;
        const totalGrowth5yaWeightDividends = 10;
        const calcTotalGrowth5yaDividends = noItemTotalGrowth5yaDividends
            ? 0
            : growthScore5YearsDividends(itemTotalGrowth5yaDividends as number);
        finalScore = finalScore + calcTotalGrowth5yaDividends * totalGrowth5yaWeightDividends;
        maxScorePossible = maxScorePossible + totalGrowth5yaMaxScoreDividends * totalGrowth5yaWeightDividends;
        consoleLennar(item, finalScore, 'dividends growth 5ya', maxScorePossible, itemTotalGrowth5yaDividends);

        // Auditor
        const auditorItem = item['Auditor Score'];
        const auditorMaxScore = 10;
        const auditorWeight = 10;
        const calcAuditor = auditorItem as number;
        finalScore = finalScore + calcAuditor * auditorWeight;
        maxScorePossible = maxScorePossible + auditorMaxScore * auditorWeight;
        consoleLennar(item, finalScore, 'auditor', maxScorePossible, auditorItem);

        // Fitch Rating
        const fitchRatingMaxScoreItem = item['fitch rating'];
        const isFitchRatingApplicable = item['fitchRatingApplicable'];
        if (isFitchRatingApplicable) {
            const fitchRatingMaxScore = 11;
            const fitchWeight = 5;
            const calcFitch = scoreFitchRating(fitchRatingMaxScoreItem as FitchRatingType);
            finalScore = finalScore + calcFitch * fitchWeight;
            maxScorePossible = maxScorePossible + fitchRatingMaxScore * fitchWeight;
            consoleLennar(item, finalScore, 'Fitch Rating', maxScorePossible, fitchRatingMaxScoreItem);
        }

        // Fitch Outlook
        const fitchOutlookItem = item['fitch outlook'];
        if(isFitchRatingApplicable){
            const fitchOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const fitchOutlookWeight = 5;
            const calcFitchOutlook = ratingOutlook(fitchOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcFitchOutlook * fitchOutlookWeight;
            maxScorePossible = maxScorePossible + fitchOutlookMaxScore * fitchOutlookWeight;
            consoleLennar(item, finalScore, 'Fitch Outlook', maxScorePossible, fitchOutlookItem);
        }

        // SP Rating
        const spRatingItem = item['s&p'];
        const isSpApplicable = item['spApplicable'];
        if (isSpApplicable) {
            const spRatingMaxScore = 11;
            const spWeight = 5;
            const calcSP = scoreFitchRating(spRatingItem as FitchRatingType, true);
            finalScore = finalScore + calcSP * spWeight;
            maxScorePossible = maxScorePossible + spRatingMaxScore * spWeight;
            consoleLennar(item, finalScore, 'sp', maxScorePossible, spRatingItem);
        }

        // SP Outlook
        const spOutlookItem = item['s&p outlook'];
        if(isSpApplicable){
            const spOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const spOutlookWeight = 5;
            const calcSPOutlook = ratingOutlook(spOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcSPOutlook * spOutlookWeight;
            maxScorePossible = maxScorePossible + spOutlookMaxScore * spOutlookWeight;
            consoleLennar(item, finalScore, 'sp outlook', maxScorePossible, spOutlookItem);
        }

        // Moody Rating
        const moodyRatingItem = item['moody'];
        if (moodyRatingItem !== NOT_APPLICABLE_STRING) {
            const moodyRatingMaxScore = 11;
            const moodyWeight = 5;
            const calcMoody = typeof moodyRatingItem === 'number' ? (moodyRatingItem as number) : 0;
            finalScore = finalScore + calcMoody * moodyWeight;
            maxScorePossible = maxScorePossible + moodyRatingMaxScore * moodyWeight;
            consoleLennar(item, finalScore, 'moody', calcMoody, moodyRatingItem);
        }

        // Degiro Income Statement
        const degiroIncomeStatementItem = item['how does their Income Statement Look on Degiro'];
        const degiroIncomeStatementMaxScore = 12;
        const disWeight = 6;
        const calcDIS = scoreDegiroIncomeStatement(
            Number(degiroIncomeStatementItem as number),
            Number(item['are assets bigger than liabilities consistently'] as number)
        );
        finalScore = finalScore + calcDIS * disWeight;
        maxScorePossible = maxScorePossible + degiroIncomeStatementMaxScore * disWeight;
        consoleLennar(item, finalScore, 'degiro income statement', maxScorePossible, degiroIncomeStatementItem);

        // Degiro Analysts Score
        const degiroAnalystsScoreItem = item['Degiro Analysts Score'];
        const degiroAnalystsScoreMaxScore = 10;
        const dasWeight = 1;
        const calcDAS = degiroAnalystRatingToScore(degiroAnalystsScoreItem as number);
        finalScore = finalScore + calcDAS * dasWeight;
        maxScorePossible = maxScorePossible + degiroAnalystsScoreMaxScore * dasWeight;
        consoleLennar(item, finalScore, 'degiro analysts score', maxScorePossible, degiroAnalystsScoreItem);

        // investingComAnalystsScore
        const investingComAnalystsScoreItem = item['investingComAnalystsScore'];
        const investingComAnalystsScoreMaxScore = 10;
        const iasWeight = 4;
        const calcIAS = (investingComAnalystsScoreItem as number) * 10;
        finalScore = finalScore + calcIAS * iasWeight;
        maxScorePossible = maxScorePossible + investingComAnalystsScoreMaxScore * iasWeight;
        consoleLennar(
            item,
            finalScore,
            'investing.com analysts score',
            maxScorePossible,
            investingComAnalystsScoreItem
        );

        // Year Founded
        const yearFoundedItem = item['year started'];
        const yearFoundedMaxScore = 10;
        const yfWeight = 5;
        const calcYF = scoreYearStarted(yearFoundedItem as number);
        finalScore = finalScore + calcYF * yfWeight;
        maxScorePossible = maxScorePossible + yearFoundedMaxScore * yfWeight;
        consoleLennar(item, finalScore, 'year founded', maxScorePossible, yearFoundedItem);

        // Number Of Employees
        const itemNumberOfEmployees = item['number of employees'];
        const numberOfEmployeesMaxScore = 10;
        const neWeight = 6;
        const calcNE = scoreNumberOfEmployees(itemNumberOfEmployees as number);
        finalScore = finalScore + calcNE * neWeight;
        maxScorePossible = maxScorePossible + numberOfEmployeesMaxScore * neWeight;
        consoleLennar(item, finalScore, 'number of employees', maxScorePossible, itemNumberOfEmployees);

        // Integrity Score
        const integrityScoreItem = item['any dirt on them (0 being clean, 10 dirty)'];
        const integrityScoreMaxScore = 10;
        const isWeight = 10;
        const calcIS = scoreIntegrity(integrityScoreItem as number);
        finalScore = finalScore + calcIS * isWeight;
        maxScorePossible = maxScorePossible + integrityScoreMaxScore * isWeight;
        consoleLennar(item, finalScore, 'integrity', maxScorePossible, integrityScoreItem);

        // Held By Big Investors
        const heldByBigInvestorsMaxScoreItem = item['Held By Big Investors'];
        const heldByBigInvestorsMaxScore = 10;
        const hbiWeight = 4;
        const calcHBI = Number(heldByBigInvestorsMaxScoreItem) as number;
        finalScore = finalScore + calcHBI * hbiWeight;
        maxScorePossible = maxScorePossible + heldByBigInvestorsMaxScore * hbiWeight;
        consoleLennar(item, finalScore, 'held by big investors', maxScorePossible, heldByBigInvestorsMaxScoreItem);

        // Share Price
        const sharePrice = item['Share Price in euro'] as number;

        // Trading Volume
        const tradingVolumeItem = item['avg trading volume, last 3 months in units in Millions'];
        const tradingVolumeMaxScore = 10;
        const tvWeight = 7;
        const calcTV = scoreTradeVolume(sharePrice, tradingVolumeItem as number);
        finalScore = finalScore + calcTV * tvWeight;
        maxScorePossible = maxScorePossible + tradingVolumeMaxScore * tvWeight;
        consoleLennar(item, finalScore, 'trading volume', maxScorePossible, tradingVolumeItem);

        // Years To Earnings Match Share
        const yearsToEarningsMatchShareItem =
            item['EPS (earning per share) average for the past 10 years in euro currency'];
        const yearsToEarningsMatchShareMaxScore = 10;
        const ytemWeight = 5;
        const calcYTEM = yearsForEarningsMatchPrice(sharePrice, yearsToEarningsMatchShareItem as number);
        finalScore = finalScore + calcYTEM * ytemWeight;
        maxScorePossible = maxScorePossible + yearsToEarningsMatchShareMaxScore * ytemWeight;
        consoleLennar(
            item,
            finalScore,
            'years to earnings match share',
            maxScorePossible,
            yearsToEarningsMatchShareItem
        );

        // Share To Book
        const shareToBookMaxScoreItem = item['share / book value'];
        const shareToBookMaxScore = 10;
        const stbWeight = 9;
        const calcSTB = scoreShareBookValue(sharePrice, shareToBookMaxScoreItem as number);
        finalScore = finalScore + calcSTB * stbWeight;
        maxScorePossible = maxScorePossible + shareToBookMaxScore * stbWeight;
        consoleLennar(item, finalScore, 'share to book', maxScorePossible, shareToBookMaxScoreItem);

        // Equity Average
        const equityAverageItem = item['equity average past 10 years in millions euro'];
        const equityAverageMaxScore = 10;
        const eaWeight = 10;
        const calcEA = scoreEquityAverage(equityAverageItem as number);
        finalScore = finalScore + calcEA * eaWeight;
        maxScorePossible = maxScorePossible + equityAverageMaxScore * eaWeight;
        consoleLennar(item, finalScore, 'equity average', maxScorePossible, equityAverageItem);

        // EBITDA
        const ebitdaMaxScoreItem = item['EBITDA average for the past 10 years in euros in millions?'];
        const ebitdaMaxScore = 10;
        const ebitdaWeight = 10;
        const calcEBITDA = scoreEBITDAAverage(ebitdaMaxScoreItem as number);
        finalScore = finalScore + calcEBITDA * ebitdaWeight;
        maxScorePossible = maxScorePossible + ebitdaMaxScore * ebitdaWeight;
        consoleLennar(item, finalScore, 'ebitda', maxScorePossible, ebitdaMaxScoreItem);

        // Net Profit
        const netProfitMaxScoreItem = item['annual net profit average in the past 10 years, in euros in millions?'];
        const netProfitMaxScore = 10;
        const netProfitWeight = 10;
        const calcNetProfit = scoreNetProfitAverage(netProfitMaxScoreItem as number);
        finalScore = finalScore + calcNetProfit * netProfitWeight;
        maxScorePossible = maxScorePossible + netProfitMaxScore * netProfitWeight;
        consoleLennar(item, finalScore, 'netProfit', maxScorePossible, netProfitMaxScoreItem);

        // Debt To Equity
        const debtToEquityMaxScoreItem = item['debt / equity as %'];
        const debtToEquityMaxScore = 10;
        const dteWeight = 10;
        const calcDTE =
            typeof debtToEquityMaxScoreItem === 'number' ? scoreDebtToEquity(debtToEquityMaxScoreItem as number) : 0;
        finalScore = finalScore + calcDTE * dteWeight;
        maxScorePossible = maxScorePossible + debtToEquityMaxScore * dteWeight;
        consoleLennar(item, finalScore, 'debt to equity', maxScorePossible, debtToEquityMaxScoreItem);

        // currentRatioCompany
        const currentRatioCompanyItem = item['currentRatioCompany'];
        if (currentRatioCompanyItem !== NOT_APPLICABLE_STRING) {
            const currentRatioCompanyMaxScore = 10;
            const crcWeight = 3;
            const calcCRC = scoreCurrentRatioCompany(
                currentRatioCompanyItem as number | null,
                item['currentRatioIndustry'] as number | null
            );
            finalScore = finalScore + calcCRC * crcWeight;
            maxScorePossible = maxScorePossible + currentRatioCompanyMaxScore * crcWeight;
            consoleLennar(item, finalScore, 'current ratio company', maxScorePossible, currentRatioCompanyItem);
        }

        // Market Cap
        const marketCapItem =
            item['market cap in Billions EUR (ask AI) (i.e. hype value... total shares X current share value)'];
        const marketCapMaxScore = 10;
        const mcWeight = 1;
        const calcMC = scoreMarketCap(marketCapItem as number);
        finalScore = finalScore + calcMC * mcWeight;
        maxScorePossible = maxScorePossible + marketCapMaxScore * mcWeight;
        consoleLennar(item, finalScore, 'market cap', maxScorePossible, calcMC);

        // Part Of Index
        const partOfIndexItem = item['indexesHoldIt'];
        const partOfIndexMaxScore = 3;
        const poimWeight = 5;
        const calcPOIM = partOfIndexItem as number;
        finalScore = finalScore + calcPOIM * poimWeight;
        maxScorePossible = maxScorePossible + partOfIndexMaxScore * poimWeight;
        consoleLennar(item, finalScore, 'part of index', maxScorePossible, partOfIndexItem);

        // Held By Billionaires
        const heldByBillionairesItem = item['is held by Billionaires? ( use percentage of total portfolios, MAX 1)'];
        const heldByBillionairesMaxScore = 1;
        const hbbWeight = 6;
        const calcHBB = heldByBillionairesItem as number;
        finalScore = finalScore + calcHBB * hbbWeight;
        maxScorePossible = maxScorePossible + heldByBillionairesMaxScore * hbbWeight;
        consoleLennar(item, finalScore, 'held by billionaires', maxScorePossible, heldByBillionairesItem);

        // SIMPLY WALL STREET METRICS

        // Valuation
        const valuationMaxScoreItem = item['valuation, max 6'];
        const valuationMaxScore = 6;
        const valWeight = 2;
        const calcVal = valuationMaxScoreItem as number;
        finalScore = finalScore + calcVal * valWeight;
        maxScorePossible = maxScorePossible + valuationMaxScore * valWeight;
        consoleLennar(item, finalScore, 'valuation', maxScorePossible, valuationMaxScoreItem);

        // Future Growth
        const futureGrowthMaxScoreItem = item['future growth, 6 max'];
        const futureGrowthMaxScore = 6;
        const fgWeight = 2;
        const calcFG = futureGrowthMaxScoreItem as number;
        finalScore = finalScore + calcFG * fgWeight;
        maxScorePossible = maxScorePossible + futureGrowthMaxScore * fgWeight;
        consoleLennar(item, finalScore, 'future growth', maxScorePossible, futureGrowthMaxScoreItem);

        // Past Performance
        const pastPerformanceItem = item['past performance, 6 mx'];
        const pastPerformanceMaxScore = 6;
        const ppWeight = 2;
        const calcPP = pastPerformanceItem as number;
        finalScore = finalScore + calcPP * ppWeight;
        maxScorePossible = maxScorePossible + pastPerformanceMaxScore * ppWeight;
        consoleLennar(item, finalScore, 'past performance', maxScorePossible, pastPerformanceItem);

        // Financial Health
        const financialHealthItem = item['financial health, max 6'];
        const financialHealthMaxScore = 6;
        const fhWeight = 2;
        const calcFH = financialHealthItem as number;
        finalScore = finalScore + calcFH * fhWeight;
        maxScorePossible = maxScorePossible + financialHealthMaxScore * fhWeight;
        consoleLennar(item, finalScore, 'financial health', maxScorePossible, financialHealthItem);

        // Dividends
        const dividendsMaxScoreItem = item['dividends, max 6'];
        const dividendsMaxScore = 6;
        const divWeight = 2;
        const calcDiv = dividendsMaxScoreItem as number;
        finalScore = finalScore + calcDiv * divWeight;
        maxScorePossible = maxScorePossible + dividendsMaxScore * divWeight;
        consoleLennar(item, finalScore, 'dividends, simply wall st.', maxScorePossible, dividendsMaxScoreItem);

        // Management
        const managementItem = item['management, 4 max'];
        const managementMaxScore = 4;
        const mgWeight = 2;
        const calcMG = managementItem as number;
        finalScore = finalScore + calcMG * mgWeight;
        maxScorePossible = maxScorePossible + managementMaxScore * mgWeight;
        consoleLennar(item, finalScore, 'management', maxScorePossible, managementItem);

        // AI score
        const aiMaxScoreItem = item['Pure AI Average Grade'];
        const aiMaxScore = 11;
        const aiWeight = 7;
        const calcAI = aiMaxScoreItem as number;
        finalScore = finalScore + calcAI * aiWeight;
        maxScorePossible = maxScorePossible + aiMaxScore * aiWeight;
        consoleLennar(item, finalScore, 'AI score', maxScorePossible, aiMaxScoreItem);
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

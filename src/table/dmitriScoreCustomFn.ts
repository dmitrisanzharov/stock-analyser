import {
    InvestmentRecord,
    notApplicableFieldsConst,
    NotApplicableFields,
    FitchRatingType,
    RatingsOutlookType,
    MoodyRatingType,
    CreditreformRatingType,
    GuruFocusValuationStatus,
    guruFocusValuationStatusesArr,
    SingleCompanyAnalysisType
} from '../types';

import {
    scorePaymentFrequency,
    scoreDegiroCategory,
    gradeAgainstEuStem,
    scorePeRatio,
    scoreNetProfitMargin,
    scoreDegiroIncomeStatement,
    degiroAnalystRatingToScore,
    scoreYearStarted,
    scoreIntegrity,
    scoreTradeVolume,
    yearsForEarningsMatchPrice,
    scoreShareBookValue,
    scoreEquityAverage,
    scoreEBITDAAverage,
    scoreNetProfitAverage,
    scoreMarketCap,
    growthScore5Years,
    growthScore5YearsDividends,
    scoreCurrentRatioCompany,
    scoreFitchRating,
    FITCH_RATING_MAP,
    DEGIRO_CATEGORIES_ARRAY,
    ratingOutlook,
    outlookMap,
    OUTLOOK_MAX_SCORE,
    scoreMoodyRatingV2,
    MOODY_RATING_MAP,
    scoreCreditreformRating,
    athValuationScore,
    scoreDebtToEquityV2,
    scoreGuruFocusValuation,
    scorePERatio10YearAvg,
    scorePe5YearAvgToCurrent,
    dividendScore,
    scoreNumberOfEmployeesV2
} from '../helpers/allOther';

import { dmitriScoreConversionNumber } from '../globalVars';

export const COMPANY_ANALYZED = 'Alphabet (aka Google) Class A';

const edgeCase1NotApplicable = -10000000; // banks when they do NOT have current ratios

const allowedArrayItems = [
    ...Object.keys(FITCH_RATING_MAP),
    ...DEGIRO_CATEGORIES_ARRAY,
    ...Object.keys(outlookMap),
    ...Object.keys(MOODY_RATING_MAP),
    ...guruFocusValuationStatusesArr
];

export const SINGLE_ANALYSIS_ITEMS_ARR: SingleCompanyAnalysisType[] = [];

function consoleLennar(
    allValues: InvestmentRecord,
    currentScore: number,
    criteria: string,
    currentMaxScore: number,
    itemValue: any, // this is directly from GoogleSheet column
    itemScore: number, // this is after calculation,
    itemMaxPossibleForThisCriteria: number
) {
    if (allValues['Company Name'] === COMPANY_ANALYZED) {
        const skippedString = 'SKIPPED';

        // NOTE: Here we check for ALLOWED TYPES... Number | 'na' | 0 | notApplicable;  exception are Degiro Grades

        const allowedValuesAndTypes =
            typeof itemValue === 'number' || itemValue === 0 || allowedArrayItems.includes(itemValue);

        const skip = allowedValuesAndTypes ? '' : skippedString;
        console.log(
            criteria,
            ':',
            Number(itemScore.toFixed(2)),
            'out of: ',
            Number(itemMaxPossibleForThisCriteria.toFixed(2)),
            '... totalScore: ',
            Number(currentScore.toFixed(2)),
            '...',
            'maxScore: ',
            Number(currentMaxScore.toFixed(2)),
            skip
        );

        if (skip === skippedString) {
            throw new Error('SKIPPED in: ' + criteria);
        }

        if (itemScore > itemMaxPossibleForThisCriteria) {
            throw new Error('itemScore > itemMaxPossibleForThisCriteria in: ' + criteria);
        }

        // for analysis

        SINGLE_ANALYSIS_ITEMS_ARR.push({
            criteriaName: criteria,
            criteriaScore: Number(itemScore.toFixed(2)),
            maxScore: Number(itemMaxPossibleForThisCriteria.toFixed(2)),
            currentScore: Number(currentScore.toFixed(2)),
            currentMaxScore: Number(currentMaxScore.toFixed(2))
        });
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

        console.log('main ITEM: ', item);
        console.log('============================');

        // Dividends Interest Rate
        const dividendsInterestRateItem = item['Yield as % (pref, degiro, 5 years)'];
        const dividendsInterestRateMaxScore = 10;
        const dividendsInterestRateWeight = 4;
        const dividendsInterestRateScore = dividendScore(Number(dividendsInterestRateItem));
        finalScore = finalScore + dividendsInterestRateScore * dividendsInterestRateWeight;
        maxScorePossible = maxScorePossible + dividendsInterestRateMaxScore * dividendsInterestRateWeight;
        consoleLennar(
            item,
            finalScore,
            'dividends',
            maxScorePossible,
            dividendsInterestRateItem,
            dividendsInterestRateScore,
            dividendsInterestRateMaxScore
        );

        // Payment Frequency
        const paymentFrequencyItem = item['Number of payments per Year'];
        const paymentFrequencyMaxScore = 6;
        const pfWeight = 1;
        const calcPf = scorePaymentFrequency(paymentFrequencyItem as number);
        finalScore = finalScore + calcPf * pfWeight;
        maxScorePossible = maxScorePossible + paymentFrequencyMaxScore * pfWeight;
        consoleLennar(
            item,
            finalScore,
            'payment frequency',
            maxScorePossible,
            paymentFrequencyItem,
            calcPf,
            paymentFrequencyMaxScore
        );

        // Country Corruption Level
        const countryCorruptionItem = item['country corruption index (100 max)'];
        const countryCorruptionMaxScore = 10;
        const ccWeight = 10;
        const calcCC = Number(countryCorruptionItem) / 10;
        finalScore = finalScore + calcCC * ccWeight;
        maxScorePossible = maxScorePossible + countryCorruptionMaxScore * ccWeight;
        consoleLennar(
            item,
            finalScore,
            'country corruption',
            maxScorePossible,
            countryCorruptionItem,
            calcCC,
            countryCorruptionMaxScore
        );

        // Country science score
        const countryScienceScoreItem = item['Country science score'];
        const countryScienceScoreMaxScore = 10;
        const csWeight = 10;
        const calcCS = Number(countryScienceScoreItem);
        finalScore = finalScore + calcCS * csWeight;
        maxScorePossible = maxScorePossible + countryScienceScoreMaxScore * csWeight;
        consoleLennar(
            item,
            finalScore,
            'country science score',
            maxScorePossible,
            countryScienceScoreItem,
            calcCS,
            countryScienceScoreMaxScore
        );

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
            percentageOfPopulationInStemItem,
            calcPOP,
            percentageOfPopulationInStemMaxScore
        );

        // WhiteSmartAsianIndex (max 100)
        const itemWhiteSmartAsianIndex = item['WhiteSmartAsianIndex (max 100)'];
        const whiteSmartAsianIndexMaxScore = 10;
        const wsaiWeight = 10;
        const calcWSAI = Number(itemWhiteSmartAsianIndex) / 10;
        finalScore = finalScore + calcWSAI * wsaiWeight;
        maxScorePossible = maxScorePossible + whiteSmartAsianIndexMaxScore * wsaiWeight;
        consoleLennar(
            item,
            finalScore,
            'WhiteSmartAsianIndex',
            maxScorePossible,
            itemWhiteSmartAsianIndex,
            calcWSAI,
            whiteSmartAsianIndexMaxScore
        );

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
            companyMonopolyPowerAndMoatItem,
            calcCMP,
            companyMonopolyPowerAndMoatMaxScore
        );

        // Degiro Category Grade
        const degiroCategoryItem = item['degiro grade | dmitri translation'];
        const degiroCategoryMaxScore = 11;
        const dcWeight = 5;
        const calcDC = scoreDegiroCategory(degiroCategoryItem);
        finalScore = finalScore + calcDC * dcWeight;
        maxScorePossible = maxScorePossible + degiroCategoryMaxScore * dcWeight;
        consoleLennar(
            item,
            finalScore,
            'degiro grade',
            maxScorePossible,
            degiroCategoryItem,
            calcDC,
            degiroCategoryMaxScore
        );

        // Auditor
        const auditorItem = item['Auditor Score'];
        const auditorMaxScore = 10;
        const auditorWeight = 10;
        const calcAuditor = auditorItem as number;
        finalScore = finalScore + calcAuditor * auditorWeight;
        maxScorePossible = maxScorePossible + auditorMaxScore * auditorWeight;
        consoleLennar(item, finalScore, 'auditor', maxScorePossible, auditorItem, calcAuditor, auditorMaxScore);

        // peRatio10YearAvg
        const peRatio10YearAvgItem = item['peRatio10YearAvg'];
        const peRatio10YearAvgMaxScore = 10;
        const peRatio10YearAvgWeight = 10;
        const calcPeRatio10YearAvg = scorePERatio10YearAvg(peRatio10YearAvgItem);
        finalScore = finalScore + calcPeRatio10YearAvg * peRatio10YearAvgWeight;
        maxScorePossible = maxScorePossible + peRatio10YearAvgMaxScore * peRatio10YearAvgWeight;
        consoleLennar(
            item,
            finalScore,
            'peRatio10YearAvg',
            maxScorePossible,
            peRatio10YearAvgItem,
            calcPeRatio10YearAvg,
            peRatio10YearAvgMaxScore
        );

        // currentPeRatioTo10YearAvg
        const currentPeRatioTo10YearAvgItem = item['currentPeRatio'];
        const currentPeRatioTo10YearAvgMaxScore = 10;
        const currentPeRatioTo10YearAvgWeight = 5;
        const calcCurrentPeRatioTo10YearAvg = scorePe5YearAvgToCurrent(
            currentPeRatioTo10YearAvgItem,
            peRatio10YearAvgItem
        );
        finalScore = finalScore + calcCurrentPeRatioTo10YearAvg * currentPeRatioTo10YearAvgWeight;
        maxScorePossible = maxScorePossible + currentPeRatioTo10YearAvgMaxScore * currentPeRatioTo10YearAvgWeight;
        consoleLennar(
            item,
            finalScore,
            'currentPeRatioTo10YearAvgItem',
            maxScorePossible,
            currentPeRatioTo10YearAvgItem,
            calcCurrentPeRatioTo10YearAvg,
            currentPeRatioTo10YearAvgMaxScore
        );

        // PE Ratio
        const itemPeRatio = item['PE ratio'];
        const noPeRatio = itemPeRatio <= 0;
        const peRatioMaxScore = 10;
        const peWeight = 1;
        const calcPE = noPeRatio ? 0 : scorePeRatio(item['PE ratio'] as number, item['industry PE'] as number);
        finalScore = finalScore + calcPE * peWeight;
        maxScorePossible = maxScorePossible + peRatioMaxScore * peWeight;
        consoleLennar(item, finalScore, 'pe ratio to industry', maxScorePossible, itemPeRatio, calcPE, peRatioMaxScore);

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
        consoleLennar(
            item,
            finalScore,
            'net profit margin',
            maxScorePossible,
            itemNetProfitMargin,
            calcGM,
            netProfitMarginMaxScore
        );

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
        consoleLennar(
            item,
            finalScore,
            'return on equity 5ya',
            maxScorePossible,
            itemReturnOnEquity5ya,
            calcROE5ya,
            returnOnEquity5yaMaxScore
        );

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
        consoleLennar(
            item,
            finalScore,
            '5 Year EPS Growth',
            maxScorePossible,
            item5YearEPSGrowth,
            calcEPSGrowth5ya,
            epsGrowth5yaMaxScore
        );

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
        consoleLennar(
            item,
            finalScore,
            '5 Year Sales Growth',
            maxScorePossible,
            item5YearSalesGrowth,
            calcSalesGrowth5ya,
            salesGrowth5yaMaxScore
        );

        // Net Income/Employee
        const itemNetIncomeEmployee = item['Net Income/Employee'];
        const noNetIncomeEmployee = itemNetIncomeEmployee === null || itemNetIncomeEmployee === 'na';
        const netIncomeEmployeeMaxScore = 10;
        const netIncomeEmployeeWeight = 1;
        const calcNetIncomeEmployee = noNetIncomeEmployee
            ? 0
            : scoreNetProfitMargin(
                  item['Net Income/Employee'] as number,
                  item['Net Income/Employee (industry)'] as number
              );
        finalScore = finalScore + calcNetIncomeEmployee * netIncomeEmployeeWeight;
        maxScorePossible = maxScorePossible + netIncomeEmployeeMaxScore * netIncomeEmployeeWeight;
        consoleLennar(
            item,
            finalScore,
            'net income/employee',
            maxScorePossible,
            itemNetIncomeEmployee,
            calcNetIncomeEmployee,
            netIncomeEmployeeMaxScore
        );

        // currentRatioCompany
        const currentRatioCompanyItem = item['currentRatioCompany'];
        if (currentRatioCompanyItem !== edgeCase1NotApplicable) {
            const currentRatioCompanyMaxScore = 10;
            const crcWeight = 3;
            const calcCRC = scoreCurrentRatioCompany(
                currentRatioCompanyItem as number | null,
                item['currentRatioIndustry'] as number | null
            );
            finalScore = finalScore + calcCRC * crcWeight;
            maxScorePossible = maxScorePossible + currentRatioCompanyMaxScore * crcWeight;
            consoleLennar(
                item,
                finalScore,
                'current ratio company',
                maxScorePossible,
                currentRatioCompanyItem,
                calcCRC,
                currentRatioCompanyMaxScore
            );
        }

        // Debt To Equity
        const debtToEquityMaxScoreItem = item['debt / equity as %'];
        if (debtToEquityMaxScoreItem !== edgeCase1NotApplicable) {
            const debtToEquityMaxScore = 10;
            const dteWeight = 10;
            const calcDTE = scoreDebtToEquityV2(
                debtToEquityMaxScoreItem as number,
                item['debt / equity as % industry'] as number
            );

            finalScore = finalScore + calcDTE * dteWeight;
            maxScorePossible = maxScorePossible + debtToEquityMaxScore * dteWeight;
            consoleLennar(
                item,
                finalScore,
                'debt to equity',
                maxScorePossible,
                debtToEquityMaxScoreItem,
                calcDTE,
                debtToEquityMaxScore
            );
        }

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
        consoleLennar(
            item,
            finalScore,
            'total growth 5ya analysis',
            maxScorePossible,
            itemTotalGrowth5ya,
            calcTotalGrowth5ya,
            totalGrowth5yaMaxScore
        );

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
        consoleLennar(
            item,
            finalScore,
            'dividends growth 5ya',
            maxScorePossible,
            itemTotalGrowth5yaDividends,
            calcTotalGrowth5yaDividends,
            totalGrowth5yaMaxScoreDividends
        );

        // noOneIsAnalysingThisCompany
        const noOneIsAnalysingThisCompanyItem = item['noOneIsAnalysingThisCompany'];
        if (noOneIsAnalysingThisCompanyItem === true) {
            const noOneIsAnalysingThisCompanyMaxScore = 10;
            const noOneIsAnalysingThisCompanyWeight = 10;
            const calcNoOneIsAnalysingThisCompany = 0;
            finalScore = finalScore + calcNoOneIsAnalysingThisCompany * noOneIsAnalysingThisCompanyWeight;
            maxScorePossible =
                maxScorePossible + noOneIsAnalysingThisCompanyMaxScore * noOneIsAnalysingThisCompanyWeight;
            consoleLennar(
                item,
                finalScore,
                'no one is analysing this company',
                maxScorePossible,
                calcNoOneIsAnalysingThisCompany,
                calcNoOneIsAnalysingThisCompany,
                noOneIsAnalysingThisCompanyMaxScore
            );
        }

        // Fitch Rating
        const fitchRatingMaxScoreItem = item['fitch rating'];
        const isFitchRatingApplicable = item['fitchRatingApplicable'];
        if (isFitchRatingApplicable) {
            const fitchRatingMaxScore = 11;
            const fitchWeight = 5;
            const calcFitch = scoreFitchRating(fitchRatingMaxScoreItem as FitchRatingType, 'Fitch');
            finalScore = finalScore + calcFitch * fitchWeight;
            maxScorePossible = maxScorePossible + fitchRatingMaxScore * fitchWeight;
            consoleLennar(
                item,
                finalScore,
                'Fitch Rating',
                maxScorePossible,
                fitchRatingMaxScoreItem,
                calcFitch,
                fitchRatingMaxScore
            );
        } else if (isFitchRatingApplicable === null) {
            throw new Error('isFitchRatingApplicable = empty field');
        }

        // Fitch Outlook
        const fitchOutlookItem = item['fitch outlook'];
        if (isFitchRatingApplicable) {
            const fitchOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const fitchOutlookWeight = 5;
            const calcFitchOutlook = ratingOutlook(fitchOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcFitchOutlook * fitchOutlookWeight;
            maxScorePossible = maxScorePossible + fitchOutlookMaxScore * fitchOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'Fitch Outlook',
                maxScorePossible,
                fitchOutlookItem,
                calcFitchOutlook,
                fitchOutlookMaxScore
            );
        }

        // SP Rating
        const spRatingItem = item['s&p'];
        const isSpApplicable = item['spApplicable'];
        if (isSpApplicable) {
            const spRatingMaxScore = 11;
            const spWeight = 5;
            const calcSP = scoreFitchRating(spRatingItem as FitchRatingType, 'SP');
            finalScore = finalScore + calcSP * spWeight;
            maxScorePossible = maxScorePossible + spRatingMaxScore * spWeight;
            consoleLennar(item, finalScore, 'sp', maxScorePossible, spRatingItem, calcSP, spRatingMaxScore);
        } else if (isSpApplicable === null) {
            throw new Error('isSpApplicable = empty field');
        }

        // SP Outlook
        const spOutlookItem = item['s&p outlook'];
        if (isSpApplicable) {
            const spOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const spOutlookWeight = 5;
            const calcSPOutlook = ratingOutlook(spOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcSPOutlook * spOutlookWeight;
            maxScorePossible = maxScorePossible + spOutlookMaxScore * spOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'sp outlook',
                maxScorePossible,
                spOutlookItem,
                calcSPOutlook,
                spOutlookMaxScore
            );
        }

        // Moody Rating
        const moodyRatingItem = item['moody'];
        const isMoodyApplicable = item['moodyApplicable'];
        if (isMoodyApplicable) {
            const moodyRatingMaxScore = 11;
            const moodyWeight = 5;
            const calcMoody = scoreMoodyRatingV2(moodyRatingItem as MoodyRatingType);
            finalScore = finalScore + calcMoody * moodyWeight;
            maxScorePossible = maxScorePossible + moodyRatingMaxScore * moodyWeight;
            consoleLennar(item, finalScore, 'moody', maxScorePossible, moodyRatingItem, calcMoody, moodyRatingMaxScore);
        } else if (isMoodyApplicable === null) {
            throw new Error('isMoodyApplicable = empty field');
        }

        // Moody Outlook
        const moodyOutlookItem = item['moody outlook'];
        if (isMoodyApplicable) {
            const moodyOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const moodyOutlookWeight = 5;
            const calcMoodyOutlook = ratingOutlook(moodyOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcMoodyOutlook * moodyOutlookWeight;
            maxScorePossible = maxScorePossible + moodyOutlookMaxScore * moodyOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'moody outlook',
                maxScorePossible,
                moodyOutlookItem,
                calcMoodyOutlook,
                moodyOutlookMaxScore
            );
        }

        // Scope Ratings GmbH
        const scopeRatingsGmbHItem = item['Scope Ratings GmbH'];
        const isScopeRatingsGmbHApplicable = item['isScopeRatingGmbHApplicable'];
        if (isScopeRatingsGmbHApplicable) {
            const scopeRatingsGmbHMaxScore = 11;
            const scopeRatingsGmbHWeight = 5;
            const calcScopeRatingsGmbH = scoreFitchRating(
                scopeRatingsGmbHItem as FitchRatingType,
                'Scope Ratings GmbH'
            );
            finalScore = finalScore + calcScopeRatingsGmbH * scopeRatingsGmbHWeight;
            maxScorePossible = maxScorePossible + scopeRatingsGmbHMaxScore * scopeRatingsGmbHWeight;
            consoleLennar(
                item,
                finalScore,
                'Scope Ratings GmbH',
                maxScorePossible,
                scopeRatingsGmbHItem,
                calcScopeRatingsGmbH,
                scopeRatingsGmbHMaxScore
            );
        } else if (isScopeRatingsGmbHApplicable === null) {
            throw new Error('isScopeRatingGmbHApplicable = empty field');
        }

        // Scope Ratings GmbH Outlook
        const scopeRatingsGmbHOutlookItem = item['Scope Ratings GmbH Outlook'];
        if (isScopeRatingsGmbHApplicable) {
            const scopeRatingsGmbHOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const scopeRatingsGmbHOutlookWeight = 5;
            const calcScopeRatingsGmbHOutlook = ratingOutlook(scopeRatingsGmbHOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcScopeRatingsGmbHOutlook * scopeRatingsGmbHOutlookWeight;
            maxScorePossible = maxScorePossible + scopeRatingsGmbHOutlookMaxScore * scopeRatingsGmbHOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'Scope Ratings GmbH Outlook',
                maxScorePossible,
                scopeRatingsGmbHOutlookItem,
                calcScopeRatingsGmbHOutlook,
                scopeRatingsGmbHOutlookMaxScore
            );
        }

        // DBRS Morningstar Rating
        const dbrsMorningstarRatingItem = item['DBRS Morningstar Rating'];
        const isDBRSMorningstarApplicable = item['isDBRSMorningstarApplicable'];
        if (isDBRSMorningstarApplicable) {
            const dbrsMorningstarRatingMaxScore = 11;
            const dbrsMorningstarWeight = 5;
            const calcDBRSMorningstar = scoreCreditreformRating(dbrsMorningstarRatingItem as CreditreformRatingType);
            finalScore = finalScore + calcDBRSMorningstar * dbrsMorningstarWeight;
            maxScorePossible = maxScorePossible + dbrsMorningstarRatingMaxScore * dbrsMorningstarWeight;
            consoleLennar(
                item,
                finalScore,
                'DBRS Morningstar Rating',
                maxScorePossible,
                dbrsMorningstarRatingItem,
                calcDBRSMorningstar,
                dbrsMorningstarRatingMaxScore
            );
        } else if (isDBRSMorningstarApplicable === null) {
            throw new Error('isDBRSMorningstarApplicable = empty field');
        }

        // DBRS Morningstar Outlook
        const dbrsMorningstarOutlookItem = item['DBRS Morningstar Outlook'];
        if (isDBRSMorningstarApplicable) {
            const dbrsMorningstarOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const dbrsMorningstarOutlookWeight = 5;
            const calcDBRSMorningstarOutlook = ratingOutlook(dbrsMorningstarOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcDBRSMorningstarOutlook * dbrsMorningstarOutlookWeight;
            maxScorePossible = maxScorePossible + dbrsMorningstarOutlookMaxScore * dbrsMorningstarOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'DBRS Morningstar Outlook',
                maxScorePossible,
                dbrsMorningstarOutlookItem,
                calcDBRSMorningstarOutlook,
                dbrsMorningstarOutlookMaxScore
            );
        }

        // Creditreform Rating AG
        const creditreformRatingAGItem = item['Creditreform Rating AG'];
        const isCreditreformRatingAGApplicable = item['isCreditreformRatingAGApplicable'];
        if (isCreditreformRatingAGApplicable) {
            const creditreformRatingAGMaxScore = 11;
            const creditreformRatingAGWeight = 5;
            const calcCreditreformRatingAG = scoreFitchRating(
                creditreformRatingAGItem as FitchRatingType,
                'Creditreform Rating AG'
            );
            finalScore = finalScore + calcCreditreformRatingAG * creditreformRatingAGWeight;
            maxScorePossible = maxScorePossible + creditreformRatingAGMaxScore * creditreformRatingAGWeight;
            consoleLennar(
                item,
                finalScore,
                'Creditreform Rating AG',
                maxScorePossible,
                creditreformRatingAGItem,
                calcCreditreformRatingAG,
                creditreformRatingAGMaxScore
            );
        } else if (isCreditreformRatingAGApplicable === null) {
            throw new Error('isCreditreformRatingAGApplicable = empty field');
        }

        // Creditreform Rating AG Outlook
        const creditreformRatingAGOutlookItem = item['Creditreform Rating AG Outlook'];
        if (isCreditreformRatingAGApplicable) {
            const creditreformRatingAGOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const creditreformRatingAGOutlookWeight = 5;
            const calcCreditreformRatingAGOutlook = ratingOutlook(
                creditreformRatingAGOutlookItem as RatingsOutlookType
            );
            finalScore = finalScore + calcCreditreformRatingAGOutlook * creditreformRatingAGOutlookWeight;
            maxScorePossible =
                maxScorePossible + creditreformRatingAGOutlookMaxScore * creditreformRatingAGOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'Creditreform Rating AG Outlook',
                maxScorePossible,
                creditreformRatingAGOutlookItem,
                calcCreditreformRatingAGOutlook,
                creditreformRatingAGOutlookMaxScore
            );
        }

        // ARC Ratings, S.A.
        const arcRatingsItem = item['ARC Ratings, S.A.'];
        const isArcRatingsApplicable = item['isARCRatings,S.A.Applicable'];
        if (isArcRatingsApplicable) {
            const arcRatingsMaxScore = 11;
            const arcRatingsWeight = 5;
            const calcArcRatings = scoreFitchRating(arcRatingsItem as FitchRatingType, 'ARC Ratings, S.A.');
            finalScore = finalScore + calcArcRatings * arcRatingsWeight;
            maxScorePossible = maxScorePossible + arcRatingsMaxScore * arcRatingsWeight;
            consoleLennar(
                item,
                finalScore,
                'ARC Ratings, S.A.',
                maxScorePossible,
                arcRatingsItem,
                calcArcRatings,
                arcRatingsMaxScore
            );
        } else if (isArcRatingsApplicable === null) {
            throw new Error('isARCRatings,S.A.Applicable = empty field');
        }

        // ARC Ratings, S.A. Outlook
        const arcRatingsOutlookItem = item['ARC Ratings, S.A. Outlook'];
        if (isArcRatingsApplicable) {
            const arcRatingsOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const arcRatingsOutlookWeight = 5;
            const calcArcRatingsOutlook = ratingOutlook(arcRatingsOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcArcRatingsOutlook * arcRatingsOutlookWeight;
            maxScorePossible = maxScorePossible + arcRatingsOutlookMaxScore * arcRatingsOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'ARC Ratings, S.A. Outlook',
                maxScorePossible,
                arcRatingsOutlookItem,
                calcArcRatingsOutlook,
                arcRatingsOutlookMaxScore
            );
        }

        // CRIF Ratings S.r.l.
        const crifRatingsItem = item['CRIF Ratings S.r.l.'];
        const isCrifRatingsApplicable = item['isCRIFRatingsS.r.l.Applicable'];
        if (isCrifRatingsApplicable) {
            const crifRatingsMaxScore = 11;
            const crifRatingsWeight = 5;
            const calcCrifRatings = scoreFitchRating(crifRatingsItem as FitchRatingType, 'CRIF Ratings S.r.l.');
            finalScore = finalScore + calcCrifRatings * crifRatingsWeight;
            maxScorePossible = maxScorePossible + crifRatingsMaxScore * crifRatingsWeight;
            consoleLennar(
                item,
                finalScore,
                'CRIF Ratings S.r.l.',
                maxScorePossible,
                crifRatingsItem,
                calcCrifRatings,
                crifRatingsMaxScore
            );
        } else if (isCrifRatingsApplicable === null) {
            throw new Error('isCRIFRatingsS.r.l.Applicable = empty field');
        }

        // CRIF Ratings S.r.l. Outlook
        const crifRatingsOutlookItem = item['CRIF Ratings S.r.l. Outlook'];
        if (isCrifRatingsApplicable) {
            const crifRatingsOutlookMaxScore = OUTLOOK_MAX_SCORE;
            const crifRatingsOutlookWeight = 5;
            const calcCrifRatingsOutlook = ratingOutlook(crifRatingsOutlookItem as RatingsOutlookType);
            finalScore = finalScore + calcCrifRatingsOutlook * crifRatingsOutlookWeight;
            maxScorePossible = maxScorePossible + crifRatingsOutlookMaxScore * crifRatingsOutlookWeight;
            consoleLennar(
                item,
                finalScore,
                'CRIF Ratings S.r.l. Outlook',
                maxScorePossible,
                crifRatingsOutlookItem,
                calcCrifRatingsOutlook,
                crifRatingsOutlookMaxScore
            );
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
        consoleLennar(
            item,
            finalScore,
            'degiro income statement',
            maxScorePossible,
            degiroIncomeStatementItem,
            calcDIS,
            degiroIncomeStatementMaxScore
        );

        // Degiro Analysts Score
        const degiroAnalystsScoreItem = item['Degiro Analysts Score'];
        const degiroAnalystsScoreMaxScore = 10;
        const dasWeight = 1;
        const calcDAS = degiroAnalystRatingToScore(degiroAnalystsScoreItem as number);
        finalScore = finalScore + calcDAS * dasWeight;
        maxScorePossible = maxScorePossible + degiroAnalystsScoreMaxScore * dasWeight;
        consoleLennar(
            item,
            finalScore,
            'degiro analysts score',
            maxScorePossible,
            degiroAnalystsScoreItem,
            calcDAS,
            degiroAnalystsScoreMaxScore
        );

        // investingComAnalystsScore
        // buy = 2, hold = 1, sell = 0;
        // formula is: totalVotes * 2 = gives us what Should be if all votes are buy... then we look at how many voted to buy and hold, to get Ratio
        // finally multiply by 10, to give us 'the score' from 0 to 10
        const investingComAnalystsScoreItem = item['investingComAnalystsScore'];
        const buy_investingComAnalysts = item['buy_investingComAnalysts'];
        const hold_investingComAnalysts = item['hold_investingComAnalysts'];
        const sell_investingComAnalysts = item['sell_investingComAnalysts'];
        const investingComAnalystsScoreTotalVotes =
            buy_investingComAnalysts + hold_investingComAnalysts + sell_investingComAnalysts;
        const buyWeightIeMax = 2;
        const investingComAnalystsScoreMaxScore = 10;
        const iasWeight = 4;
        const calcIAS =
            ((buy_investingComAnalysts * buyWeightIeMax + hold_investingComAnalysts) /
                (investingComAnalystsScoreTotalVotes * buyWeightIeMax)) *
            10;
        finalScore = finalScore + calcIAS * iasWeight;
        maxScorePossible = maxScorePossible + investingComAnalystsScoreMaxScore * iasWeight;
        consoleLennar(
            item,
            finalScore,
            'investing.com analysts score',
            maxScorePossible,
            investingComAnalystsScoreItem,
            calcIAS,
            investingComAnalystsScoreMaxScore
        );

        // Year Founded
        const yearFoundedItem = item['year started'];
        const yearFoundedMaxScore = 10;
        const yfWeight = 5;
        const calcYF = scoreYearStarted(yearFoundedItem as number);
        finalScore = finalScore + calcYF * yfWeight;
        maxScorePossible = maxScorePossible + yearFoundedMaxScore * yfWeight;
        consoleLennar(item, finalScore, 'year founded', maxScorePossible, yearFoundedItem, calcYF, yearFoundedMaxScore);

        // Number Of Employees
        const itemNumberOfEmployees = item['number of employees'];
        const numberOfEmployeesMaxScore = 10;
        const neWeight = 6;
        const calcNE = scoreNumberOfEmployeesV2(itemNumberOfEmployees as number);
        finalScore = finalScore + calcNE * neWeight;
        maxScorePossible = maxScorePossible + numberOfEmployeesMaxScore * neWeight;
        consoleLennar(
            item,
            finalScore,
            'number of employees',
            maxScorePossible,
            itemNumberOfEmployees,
            calcNE,
            numberOfEmployeesMaxScore
        );

        // Integrity Score
        const integrityScoreItem = item['any dirt on them (0 being clean, 10 dirty)'];
        const integrityScoreMaxScore = 10;
        const isWeight = 10;
        const calcIS = scoreIntegrity(integrityScoreItem as number);
        finalScore = finalScore + calcIS * isWeight;
        maxScorePossible = maxScorePossible + integrityScoreMaxScore * isWeight;
        consoleLennar(
            item,
            finalScore,
            'integrity',
            maxScorePossible,
            integrityScoreItem,
            calcIS,
            integrityScoreMaxScore
        );

        // Held By Big Investors
        const heldByBigInvestorsMaxScoreItem = item['Held By Big Investors'];
        const heldByBigInvestorsMaxScore = 10;
        const hbiWeight = 4;
        const calcHBI = Number(heldByBigInvestorsMaxScoreItem) as number;
        finalScore = finalScore + calcHBI * hbiWeight;
        maxScorePossible = maxScorePossible + heldByBigInvestorsMaxScore * hbiWeight;
        consoleLennar(
            item,
            finalScore,
            'held by big investors',
            maxScorePossible,
            heldByBigInvestorsMaxScoreItem,
            calcHBI,
            heldByBigInvestorsMaxScore
        );

        // Share Price
        const sharePrice = item['Share Price in euro'] as number;

        // allTimeHigh_ATM
        const highestSharePriceItem = item['allTimeHigh_ATM_inEuro'];
        const highestSharePriceMaxScore = 10;
        const hspWeight = 2;
        const calcHSP = athValuationScore(sharePrice as number, highestSharePriceItem as number);
        finalScore = finalScore + calcHSP * hspWeight;
        maxScorePossible = maxScorePossible + highestSharePriceMaxScore * hspWeight;
        consoleLennar(
            item,
            finalScore,
            'highest share price',
            maxScorePossible,
            highestSharePriceItem,
            calcHSP,
            highestSharePriceMaxScore
        );

        // AnalystsAvgPricePredictionInEuro
        const analystsAvgPricePredictionInEuroItem = item['AnalystsAvgPricePredictionInEuro'];
        const analystsAvgPricePredictionInEuroMaxScore = 10;
        const aappWeight = 5;
        const calcAAPP = athValuationScore(sharePrice as number, analystsAvgPricePredictionInEuroItem as number);
        finalScore = finalScore + calcAAPP * aappWeight;
        maxScorePossible = maxScorePossible + analystsAvgPricePredictionInEuroMaxScore * aappWeight;
        consoleLennar(
            item,
            finalScore,
            'analysts avg price prediction',
            maxScorePossible,
            analystsAvgPricePredictionInEuroItem,
            calcAAPP,
            analystsAvgPricePredictionInEuroMaxScore
        );

        // Trading Volume
        const tradingVolumeItem = item['avg trading volume, last 3 months in units in Millions'];
        const tradingVolumeMaxScore = 10;
        const tvWeight = 7;
        const calcTV = scoreTradeVolume(sharePrice, tradingVolumeItem as number);
        finalScore = finalScore + calcTV * tvWeight;
        maxScorePossible = maxScorePossible + tradingVolumeMaxScore * tvWeight;
        consoleLennar(
            item,
            finalScore,
            'trading volume',
            maxScorePossible,
            tradingVolumeItem,
            calcTV,
            tradingVolumeMaxScore
        );

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
            yearsToEarningsMatchShareItem,
            calcYTEM,
            yearsToEarningsMatchShareMaxScore
        );

        // Share To Book
        const shareToBookMaxScoreItem = item['share / book value'];
        const shareToBookMaxScore = 10;
        const stbWeight = 9;
        const calcSTB = scoreShareBookValue(sharePrice, shareToBookMaxScoreItem as number);
        finalScore = finalScore + calcSTB * stbWeight;
        maxScorePossible = maxScorePossible + shareToBookMaxScore * stbWeight;
        consoleLennar(
            item,
            finalScore,
            'share to book',
            maxScorePossible,
            shareToBookMaxScoreItem,
            calcSTB,
            shareToBookMaxScore
        );

        // Equity Average
        const equityAverageItem = item['equity average past 10 years in millions euro'];
        const equityAverageMaxScore = 10;
        const eaWeight = 10;
        const calcEA = scoreEquityAverage(equityAverageItem as number);
        finalScore = finalScore + calcEA * eaWeight;
        maxScorePossible = maxScorePossible + equityAverageMaxScore * eaWeight;
        consoleLennar(
            item,
            finalScore,
            'equity average',
            maxScorePossible,
            equityAverageItem,
            calcEA,
            equityAverageMaxScore
        );

        // EBITDA
        const ebitdaMaxScoreItem = item['EBITDA average for the past 10 years in euros in millions?'];
        const ebitdaMaxScore = 10;
        const ebitdaWeight = 10;
        const calcEBITDA = scoreEBITDAAverage(ebitdaMaxScoreItem as number);
        finalScore = finalScore + calcEBITDA * ebitdaWeight;
        maxScorePossible = maxScorePossible + ebitdaMaxScore * ebitdaWeight;
        consoleLennar(item, finalScore, 'ebitda', maxScorePossible, ebitdaMaxScoreItem, calcEBITDA, ebitdaMaxScore);

        // Net Profit
        const netProfitMaxScoreItem = item['annual net profit average in the past 10 years, in euros in millions?'];
        const netProfitMaxScore = 10;
        const netProfitWeight = 10;
        const calcNetProfit = scoreNetProfitAverage(netProfitMaxScoreItem as number);
        finalScore = finalScore + calcNetProfit * netProfitWeight;
        maxScorePossible = maxScorePossible + netProfitMaxScore * netProfitWeight;
        consoleLennar(item, finalScore, 'netProfit', maxScorePossible, calcNetProfit, calcNetProfit, netProfitMaxScore); // 4-Nov-2025: here we do NOT use netProfitMaxScoreItem, cause it can be negative, so we use calcNetProfit instead

        // Market Cap
        const marketCapItem = item['marketCapInBillionsOfEuro'];
        const marketCapMaxScore = 10;
        const mcWeight = 1;
        const calcMC = scoreMarketCap(marketCapItem as number);
        finalScore = finalScore + calcMC * mcWeight;
        maxScorePossible = maxScorePossible + marketCapMaxScore * mcWeight;
        consoleLennar(item, finalScore, 'market cap', maxScorePossible, marketCapItem, calcMC, marketCapMaxScore);

        // Part Of Index
        const partOfIndexItem = item['indexesHoldIt'];
        const partOfIndexMaxScore = 3;
        const poimWeight = 5;
        const calcPOIM = partOfIndexItem as number;
        finalScore = finalScore + calcPOIM * poimWeight;
        maxScorePossible = maxScorePossible + partOfIndexMaxScore * poimWeight;
        consoleLennar(
            item,
            finalScore,
            'part of index',
            maxScorePossible,
            partOfIndexItem,
            calcPOIM,
            partOfIndexMaxScore
        );

        // Held By Billionaires
        const heldByBillionairesItem = item['is held by Billionaires? ( use percentage of total portfolios, MAX 1)'];
        const heldByBillionairesMaxScore = 1;
        const hbbWeight = 6;
        const calcHBB = heldByBillionairesItem > 1 ? 1 : heldByBillionairesItem as number;
        finalScore = finalScore + calcHBB * hbbWeight;
        maxScorePossible = maxScorePossible + heldByBillionairesMaxScore * hbbWeight;
        consoleLennar(
            item,
            finalScore,
            'held by billionaires',
            maxScorePossible,
            heldByBillionairesItem,
            calcHBB,
            heldByBillionairesMaxScore
        );

        // SIMPLY WALL STREET METRICS

        // Valuation
        const valuationMaxScoreItem = item['valuation, max 6'];
        const valuationMaxScore = 6;
        const valWeight = 2;
        const calcVal = valuationMaxScoreItem as number;
        finalScore = finalScore + calcVal * valWeight;
        maxScorePossible = maxScorePossible + valuationMaxScore * valWeight;
        consoleLennar(
            item,
            finalScore,
            'valuation',
            maxScorePossible,
            valuationMaxScoreItem,
            calcVal,
            valuationMaxScore
        );

        // Future Growth
        const futureGrowthMaxScoreItem = item['future growth, 6 max'];
        const futureGrowthMaxScore = 6;
        const fgWeight = 2;
        const calcFG = futureGrowthMaxScoreItem as number;
        finalScore = finalScore + calcFG * fgWeight;
        maxScorePossible = maxScorePossible + futureGrowthMaxScore * fgWeight;
        consoleLennar(
            item,
            finalScore,
            'future growth',
            maxScorePossible,
            futureGrowthMaxScoreItem,
            calcFG,
            futureGrowthMaxScore
        );

        // Past Performance
        const pastPerformanceItem = item['past performance, 6 mx'];
        const pastPerformanceMaxScore = 6;
        const ppWeight = 2;
        const calcPP = pastPerformanceItem as number;
        finalScore = finalScore + calcPP * ppWeight;
        maxScorePossible = maxScorePossible + pastPerformanceMaxScore * ppWeight;
        consoleLennar(
            item,
            finalScore,
            'past performance',
            maxScorePossible,
            pastPerformanceItem,
            calcPP,
            pastPerformanceMaxScore
        );

        // Financial Health
        const financialHealthItem = item['financial health, max 6'];
        const financialHealthMaxScore = 6;
        const fhWeight = 2;
        const calcFH = financialHealthItem as number;
        finalScore = finalScore + calcFH * fhWeight;
        maxScorePossible = maxScorePossible + financialHealthMaxScore * fhWeight;
        consoleLennar(
            item,
            finalScore,
            'financial health',
            maxScorePossible,
            financialHealthItem,
            calcFH,
            financialHealthMaxScore
        );

        // Dividends
        const dividendsMaxScoreItem = item['dividends, max 6'];
        const dividendsMaxScore = 6;
        const divWeight = 2;
        const calcDiv = dividendsMaxScoreItem as number;
        finalScore = finalScore + calcDiv * divWeight;
        maxScorePossible = maxScorePossible + dividendsMaxScore * divWeight;
        consoleLennar(
            item,
            finalScore,
            'dividends, simply wall st.',
            maxScorePossible,
            dividendsMaxScoreItem,
            calcDiv,
            dividendsMaxScore
        );

        // Management
        const managementItem = item['management, 4 max'];
        const managementMaxScore = 4;
        const mgWeight = 2;
        const calcMG = managementItem as number;
        finalScore = finalScore + calcMG * mgWeight;
        maxScorePossible = maxScorePossible + managementMaxScore * mgWeight;
        consoleLennar(item, finalScore, 'management', maxScorePossible, managementItem, calcMG, managementMaxScore);

        // GuruFocusScore
        const guruFocusScoreItem = item['GuruFocusScore'];
        const guruFocusScoreMaxScore = 10;
        const gfsWeight = 2;
        const calcGFS = (guruFocusScoreItem as number) / 10;
        finalScore = finalScore + calcGFS * gfsWeight;
        maxScorePossible = maxScorePossible + guruFocusScoreMaxScore * gfsWeight;
        consoleLennar(
            item,
            finalScore,
            'GuruFocus Score',
            maxScorePossible,
            guruFocusScoreItem,
            calcGFS,
            guruFocusScoreMaxScore
        );

        // GuruFocusValuation
        const guruFocusValuationItem = item['GuruFocusValuation'];
        const guruFocusValuationMaxScore = 10;
        const gfvWeight = 2;
        const calcGFV = scoreGuruFocusValuation(guruFocusValuationItem as GuruFocusValuationStatus);
        finalScore = finalScore + calcGFV * gfvWeight;
        maxScorePossible = maxScorePossible + guruFocusValuationMaxScore * gfvWeight;
        consoleLennar(
            item,
            finalScore,
            'GuruFocus Valuation',
            maxScorePossible,
            guruFocusValuationItem,
            calcGFV,
            guruFocusValuationMaxScore
        );

        // AI score
        const aiMaxScoreItem = item['Pure AI Average Grade'];
        const aiMaxScore = 11;
        const aiWeight = 7;
        const calcAI = aiMaxScoreItem as number;
        finalScore = finalScore + calcAI * aiWeight;
        maxScorePossible = maxScorePossible + aiMaxScore * aiWeight;
        consoleLennar(item, finalScore, 'AI score', maxScorePossible, aiMaxScoreItem, calcAI, aiMaxScore);

        // probabilityOfDoublingIn5Years
        const probabilityOfDoublingIn5YearsItem = item['probabilityOfDoublingIn5Years'];
        const probabilityOfDoublingIn5YearsMaxScore = 10;
        const podiyWeight = 10;
        const calcPODIY = (probabilityOfDoublingIn5YearsItem as number) / 10;
        finalScore = finalScore + calcPODIY * podiyWeight;
        maxScorePossible = maxScorePossible + probabilityOfDoublingIn5YearsMaxScore * podiyWeight;
        consoleLennar(
            item,
            finalScore,
            'probabilityOfDoublingIn5Years',
            maxScorePossible,
            probabilityOfDoublingIn5YearsItem,
            calcPODIY,
            probabilityOfDoublingIn5YearsMaxScore
        );

        // probabilityOfMaintainingValueIn5Years
        const probabilityOfMaintainingValueIn5YearsItem = item['probabilityOfMaintainingValueIn5Years'];
        const probabilityOfMaintainingValueIn5YearsMaxScore = 10;
        const pmvWeight = 10;
        const calcPMV = (probabilityOfMaintainingValueIn5YearsItem as number) / 10;
        finalScore = finalScore + calcPMV * pmvWeight;
        maxScorePossible = maxScorePossible + probabilityOfMaintainingValueIn5YearsMaxScore * pmvWeight;
        consoleLennar(
            item,
            finalScore,
            'probabilityOfMaintainingValueIn5Years',
            maxScorePossible,
            probabilityOfMaintainingValueIn5YearsItem,
            calcPMV,
            probabilityOfMaintainingValueIn5YearsMaxScore
        );

        // probabilityOfLosing50pcOfSharePriceIn5Years
        const probabilityOfLosing50pcOfSharePriceIn5YearsItem = item['probabilityOfLosing50pcOfSharePriceIn5Years'];
        const probabilityOfLosing50pcOfSharePriceIn5YearsMaxScore = 10;
        const plpWeight = 10;
        const calcPLP = scoreIntegrity(probabilityOfLosing50pcOfSharePriceIn5YearsItem as number / 10);
        finalScore = finalScore + calcPLP * plpWeight;
        maxScorePossible = maxScorePossible + probabilityOfLosing50pcOfSharePriceIn5YearsMaxScore * plpWeight;
        consoleLennar(
            item,
            finalScore,
            'probabilityOfLosing50pcOfSharePriceIn5Years (high is good)',
            maxScorePossible,
            probabilityOfLosing50pcOfSharePriceIn5YearsItem,
            calcPLP,
            probabilityOfLosing50pcOfSharePriceIn5YearsMaxScore
        );

        // probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriod
        const isDividendsStock = item['isDividendsStock'];
        if (isDividendsStock) {
            const probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriodItem =
                item['probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriod'];
            const probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriodMaxScore = 10;
            const pdpWeight = 10;
            const calcPDP = (probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriodItem as number) / 10;
            finalScore = finalScore + calcPDP * pdpWeight;
            maxScorePossible =
                maxScorePossible + probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriodMaxScore * pdpWeight;
            consoleLennar(
                item,
                finalScore,
                'probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriod',
                maxScorePossible,
                probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriodItem,
                calcPDP,
                probabilityOfMaintainingTheirDividendPaymentsOver5YearPeriodMaxScore
            );
        }
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

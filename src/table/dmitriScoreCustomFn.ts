import {
    scorePaymentFrequency,
    scoreDegiroCategory,
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
import { InvestmentRecord, RatingType } from '../types';
import { dmitriScoreConversionNumber } from '../globalVars';

const companyAnalyzed = 'UnitedHealth Group';

function consoleLennar(allValues: InvestmentRecord, currentScore: number, criteria: string, currentMaxScore: number) {
    if (allValues['Company Name'] === companyAnalyzed) {
        console.log(criteria, ': ', currentScore, '...', 'maxScore: ', currentMaxScore);
    }
}

function dmitriScoreCustomFn(info: any) {
    const value = info.getValue();

    const item: InvestmentRecord = info.row.original;

    const companyAnalysisActive = item['Company Name'] === companyAnalyzed;

    if ((value || value === 0) && !companyAnalysisActive) {
        return Number(value.toFixed(2));
    }

    let finalScore = 0;
    let maxScorePossible = 0;

    if (companyAnalysisActive) {
        console.log('++++++++++++++++++++++++++++');
        console.log('Company Name: ', companyAnalyzed);
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

        // Degiro Category Grade
        const degiroCategoryMaxScore = 11;
        const dcWeight = 5;
        const calcDC = scoreDegiroCategory(item['degiro grade | dmitri translation']);
        finalScore = finalScore + calcDC * dcWeight;
        maxScorePossible = maxScorePossible + degiroCategoryMaxScore * dcWeight;
        consoleLennar(item, finalScore, 'degiro grade', maxScorePossible);

        // PE Ratio
        if (item['PE ratio'] && item['PE ratio'] > 0) {
            const peRatioMaxScore = 10;
            const peWeight = 9;
            const calcPE = scorePeRatio(item['PE ratio'] as number, item['industry PE'] as number);
            finalScore = finalScore + calcPE * peWeight;
            maxScorePossible = maxScorePossible + peRatioMaxScore * peWeight;
            consoleLennar(item, finalScore, 'pe ratio', maxScorePossible);
        }

        // Net Profit Margin
        if (item['Net Profit Margin AVG 5 years'] && item['Net Profit Margin AVG 5 years'] > 0) {
            const netProfitMarginMaxScore = 10;
            const netProfitMarginWeight = 10;
            const calcGM = scoreNetProfitMargin(
                item['Net Profit Margin AVG 5 years'] as number,
                item['Net Profit Margin AVG 5 years (industry)'] as number
            );
            finalScore = finalScore + calcGM * netProfitMarginWeight;
            maxScorePossible = maxScorePossible + netProfitMarginMaxScore * netProfitMarginWeight;
            consoleLennar(item, finalScore, 'gross margin', maxScorePossible);
        }

        // Return on Equity 5ya
        if (item['Return On Equity 5ya'] && item['Return On Equity 5ya'] > 0) {
            const returnOnEquity5yaMaxScore = 10;
            const returnOnEquity5yaWeight = 10;
            const calcROE5ya = scoreNetProfitMargin(
                item['Return On Equity 5ya'] as number,
                item['Return On Equity 5ya (industry)'] as number
            );
            finalScore = finalScore + calcROE5ya * returnOnEquity5yaWeight;
            maxScorePossible = maxScorePossible + returnOnEquity5yaMaxScore * returnOnEquity5yaWeight;
            consoleLennar(item, finalScore, 'return on equity 5ya', maxScorePossible);
        }

        // 5 Year EPS Growth
        if (item['5 Year EPS Growth'] && item['5 Year EPS Growth'] > 0) {
            const epsGrowth5yaMaxScore = 10;
            const epsGrowth5yaWeight = 10;
            const calcEPSGrowth5ya = scoreNetProfitMargin(
                item['5 Year EPS Growth'] as number,
                item['5 Year EPS Growth (industry)'] as number
            );
            finalScore = finalScore + calcEPSGrowth5ya * epsGrowth5yaWeight;
            maxScorePossible = maxScorePossible + epsGrowth5yaMaxScore * epsGrowth5yaWeight;
            consoleLennar(item, finalScore, '5 Year EPS Growth', maxScorePossible);
        }

        // 5 Year Sales Growth
        if (item['5 Year Sales Growth'] && item['5 Year Sales Growth'] > 0) {
            const salesGrowth5yaMaxScore = 10;
            const salesGrowth5yaWeight = 10;
            const calcSalesGrowth5ya = scoreNetProfitMargin(
                item['5 Year Sales Growth'] as number,
                item['5 Year Sales Growth (industry)'] as number
            );
            finalScore = finalScore + calcSalesGrowth5ya * salesGrowth5yaWeight;
            maxScorePossible = maxScorePossible + salesGrowth5yaMaxScore * salesGrowth5yaWeight;
            consoleLennar(item, finalScore, '5 Year Sales Growth', maxScorePossible);
        }

        // Net Income/Employee
        if (item['Net Income/Employee'] && item['Net Income/Employee'] > 0) {
            const netIncomeEmployeeMaxScore = 10;
            const netIncomeEmployeeWeight = 10;
            const calcNetIncomeEmployee = scoreNetProfitMargin(
                item['Net Income/Employee'] as number,
                item['Net Income/Employee (industry)'] as number
            );
            finalScore = finalScore + calcNetIncomeEmployee * netIncomeEmployeeWeight;
            maxScorePossible = maxScorePossible + netIncomeEmployeeMaxScore * netIncomeEmployeeWeight;
            consoleLennar(item, finalScore, 'net income/employee', maxScorePossible);
        }

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
        const calcPOIM = item[
            'is company part of any index / index fund (e.g. MSCI world fund), grade as: 0 = No indexes hold it (worst), 1 = some indexes hold it, 2 = many indexes hold it, 3 = almost ALL hold it (the best)'
        ] as number;
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

        console.log('---------------------------------');
        console.log('AI Analysis');
        console.log('---------------------------------');

        // AI ANALYSIS
        let aiMaxPossible = 0;
        let aiFinalScore = 0;

        // Dmitri Score
        const dmitriScoreMaxScore = 11;
        const dsWeight = 10;
        const calcDS = item['Dmitri score by feel'] as number;
        aiFinalScore = aiFinalScore + calcDS * dsWeight;
        aiMaxPossible = aiMaxPossible + dmitriScoreMaxScore * dsWeight;
        consoleLennar(item, aiFinalScore, 'dmitri score', aiMaxPossible);

        // degiro grade | dmitri translation
        const degiroGradeMaxScore = 11;
        const dgWeight = 5;
        const calcDG = item['degiro (A = 11; B=8; C=4; D=1)'] as number;
        aiFinalScore = aiFinalScore + calcDG * dgWeight;
        aiMaxPossible = aiMaxPossible + degiroGradeMaxScore * dgWeight;
        consoleLennar(item, aiFinalScore, 'degiro (A = 11; B=8; C=4; D=1)', aiMaxPossible);

        // fitchRating ai
        const fitchRatingAi: RatingType = item['fitch rating'];
        if (typeof fitchRatingAi === 'number') {
            const fitchRatingMaxScore = 11;
            const frWeight = 4;
            const calcFR = fitchRatingAi;
            aiFinalScore = aiFinalScore + calcFR * frWeight;
            aiMaxPossible = aiMaxPossible + fitchRatingMaxScore * frWeight;
            consoleLennar(item, aiFinalScore, 'fitch rating', aiMaxPossible);
        }

        // s&p rating
        const spRating: RatingType = item['s&p rating'];
        if (typeof spRating === 'number') {
            const spRatingMaxScore = 11;
            const srWeight = 4;
            const calcSR = spRating;
            aiFinalScore = aiFinalScore + calcSR * srWeight;
            aiMaxPossible = aiMaxPossible + spRatingMaxScore * srWeight;
            consoleLennar(item, aiFinalScore, 's&p rating', aiMaxPossible);
        }

        // moody rating
        const moodyRating: RatingType = item['moody rating'];
        if (typeof moodyRating === 'number') {
            const moodyRatingMaxScore = 11;
            const mrWeight = 4;
            const calcMR = moodyRating;
            aiFinalScore = aiFinalScore + calcMR * mrWeight;
            aiMaxPossible = aiMaxPossible + moodyRatingMaxScore * mrWeight;
            consoleLennar(item, aiFinalScore, 'moody rating', aiMaxPossible);
        }

        // chatGPT
        const chatGPTMaxScore = 11;
        const cgWeight = 1;
        const calcCG = item['chatGPT Grade (11 to 1)'] as number;
        aiFinalScore = aiFinalScore + calcCG * cgWeight;
        aiMaxPossible = aiMaxPossible + chatGPTMaxScore * cgWeight;
        consoleLennar(item, aiFinalScore, 'chatGPT', aiMaxPossible);

        // ChatGPT Plus
        const chatGPTPlusMaxScore = 11;
        const cgPlusWeight = 2;
        const calcCGPlus = item['ChatGPT Plus'] as number;
        aiFinalScore = aiFinalScore + calcCGPlus * cgPlusWeight;
        aiMaxPossible = aiMaxPossible + chatGPTPlusMaxScore * cgPlusWeight;
        consoleLennar(item, aiFinalScore, 'chatGPT Plus', aiMaxPossible);

        // claude
        const claudeMaxScore = 11;
        const clWeight = 1;
        const calcCL = item['claude'] as number;
        aiFinalScore = aiFinalScore + calcCL * clWeight;
        aiMaxPossible = aiMaxPossible + claudeMaxScore * clWeight;
        consoleLennar(item, aiFinalScore, 'claude', aiMaxPossible);

        // gemini
        const geminiMaxScore = 11;
        const gmWeight = 1;
        const calcGemini = item['gemini'] as number;
        aiFinalScore = aiFinalScore + calcGemini * gmWeight;
        aiMaxPossible = aiMaxPossible + geminiMaxScore * gmWeight;
        consoleLennar(item, aiFinalScore, 'gemini', aiMaxPossible);

        // copilot
        const copilotMaxScore = 11;
        const cpWeight = 1;
        const calcCopilot = item['copilot'] as number;
        aiFinalScore = aiFinalScore + calcCopilot * cpWeight;
        aiMaxPossible = aiMaxPossible + copilotMaxScore * cpWeight;
        consoleLennar(item, aiFinalScore, 'copilot', aiMaxPossible);

        // perplexity
        const perplexityMaxScore = 11;
        const pxWeight = 1;
        const calcPerplexity = item['perplexity'] as number;
        aiFinalScore = aiFinalScore + calcPerplexity * pxWeight;
        aiMaxPossible = aiMaxPossible + perplexityMaxScore * pxWeight;
        consoleLennar(item, aiFinalScore, 'perplexity', aiMaxPossible);

        // LeChatGPT
        const leChatMaxScore = 11;
        const lcWeight = 1;
        const calcLeChat = item['LeChat'] as number;
        aiFinalScore = aiFinalScore + calcLeChat * lcWeight;
        aiMaxPossible = aiMaxPossible + leChatMaxScore * lcWeight;
        consoleLennar(item, aiFinalScore, 'LeChat', aiMaxPossible);

        // grok
        const grokMaxScore = 11;
        const grWeight = 1;
        const calcGrok = item['grok'] as number;
        aiFinalScore = aiFinalScore + calcGrok * grWeight;
        aiMaxPossible = aiMaxPossible + grokMaxScore * grWeight;
        consoleLennar(item, aiFinalScore, 'grok', aiMaxPossible);

        // kimi
        const kimiMaxScore = 11;
        const kmWeight = 1;
        const calcKimi = item['kimi'] as number;
        aiFinalScore = aiFinalScore + calcKimi * kmWeight;
        aiMaxPossible = aiMaxPossible + kimiMaxScore * kmWeight;
        consoleLennar(item, aiFinalScore, 'kimi', aiMaxPossible);

        // deepseek
        const deepseekMaxScore = 11;
        const dsAiWeight = 1;
        const calcDeepseek = item['deepseek'] as number;
        aiFinalScore = aiFinalScore + calcDeepseek * dsAiWeight;
        aiMaxPossible = aiMaxPossible + deepseekMaxScore * dsAiWeight;
        consoleLennar(item, aiFinalScore, 'deepseek', aiMaxPossible);

        console.log('final AI score', ((aiFinalScore / aiMaxPossible) * dmitriScoreConversionNumber).toFixed(2));
    }

    // end
    const finalReturn = ((finalScore / maxScorePossible) * dmitriScoreConversionNumber).toFixed(2);
    console.log('============================');
    console.log('FINAL SCORE');
    console.log('============================');
    console.log('company name', item['Company Name']);
    console.log('final Dmitri Score: ', finalReturn);
    console.log('maxScorePossible, should be on 22-Sep-2025: ', 1757);

    return finalReturn;
}

export default dmitriScoreCustomFn;

import { InvestmentRecord } from '../types';
import { dmitriScoreConversionNumber } from '../globalVars';

type RatingType = string | number | null;

export function calculateAiScoreWithWeight(item: InvestmentRecord, consoleLennar: any) {
    console.log('---------------------------------');
    console.log('AI Analysis');
    console.log('---------------------------------');

    // AI ANALYSIS
    let aiMaxPossible = 0;
    let aiFinalScore = 0;

    // Dmitri Score
    const dmitriScoreMaxScore = 11;
    const dsWeight = 10;
    const calcDS = item['DmitriScore'] as number;
    aiFinalScore = aiFinalScore + calcDS * dsWeight;
    aiMaxPossible = aiMaxPossible + dmitriScoreMaxScore * dsWeight;
    consoleLennar(item, aiFinalScore, 'dmitri score', aiMaxPossible);

    // degiro grade | dmitri translation
    const degiroGradeMaxScore = 11;
    const dgWeight = 3;
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

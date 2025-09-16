
import { CRITERIA, dmitriScoreConversionNumber } from '../data/globalVars';
import { ScoreArrayItem } from '../types';
import allCriteriasWithWeightArr from '../data/allCriteriasWithWeight';

function calcTotalScore(
    criteriaObj: typeof CRITERIA,
    scores: ScoreArrayItem[],
    weights: typeof allCriteriasWithWeightArr
) {
    const criteriaValues = Object.values(criteriaObj);

    // this tells me that one of the Companies Items is missing Value
    if (criteriaValues.length !== weights.length || weights.length !== scores.length) {
        throw new Error(
            `calcTotalValue: Array lengths mismatch. ` +
                `CRITERIA(${criteriaValues.length}), ` +
                `allCriteriasWithWeightArr(${weights.length}), ` +
                `scoreArray(${scores.length})`
        );
    }

    let total = 0;
    let maxTotal = 0;

    criteriaValues.forEach((criteriaName) => {
        // Find weight info
        const weightObj = weights.find((w) => w.criteriaId === criteriaName);
        if (!weightObj) throw new Error(`No weight found for ${criteriaName}`);

        // Find Dmitri's score
        const scoreObj = scores.find((s) => s.criteriaId === criteriaName);
        if (!scoreObj) throw new Error(`No score found for ${criteriaName}`);

        // Weighted score: (dmitriScore / maxPossibleScore) * weight
        const weightedScore = scoreObj.dmitriScore * weightObj.weight;

        total += weightedScore;
        maxTotal += (weightObj.maxPossibleScore * weightObj.weight);
    });

    return (total / maxTotal) * dmitriScoreConversionNumber;
}

export default calcTotalScore;
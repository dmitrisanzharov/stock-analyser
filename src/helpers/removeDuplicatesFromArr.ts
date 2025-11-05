import { SingleCompanyAnalysisType } from '../types';

type KeepMode = "first" | "last";


export function removeDuplicatesFromArr(
    items: SingleCompanyAnalysisType[],
    keep: KeepMode = "last"
): SingleCompanyAnalysisType[] {
    const map = new Map<string, SingleCompanyAnalysisType>();

    if (keep === "first") {
        for (const it of items) {
            if (!map.has(it.criteriaName)) map.set(it.criteriaName, it);
        }
    } else {
        // keep === "last"
        for (const it of items) {
            map.set(it.criteriaName, it);
        }
    }

    return Array.from(map.values());
}
import dayjs from 'dayjs';
import { dateFormat } from '../globalVars';
import { Company } from '../../table/BasicTable';

const oldCompanies: Company[] = [
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'Atlas Arteria Ltd', isin: 'AU0000013559', score: 7.22 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'APA Group', isin: 'AU000000APA1', score: 5.56 },
    { dateOfAnalysis: dayjs('2025-08-31').format(dateFormat), name: 'Chevron Corp (Buffet)', isin: 'US1667641005', score: 7.95 },
    { dateOfAnalysis: dayjs('2025-08-31').format(dateFormat), name: 'Constellation Brands Inc (Buffet)', isin: 'US21036P1084', score: 6.77 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'Enagas SA', isin: 'ES0130960018', score: 7.29 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'Fortescue Ltd', isin: 'AU000000FMG4', score: 8.05 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'GQG Partners Inc', isin: 'AU0000180499', score: 6.87 },
    { dateOfAnalysis: dayjs('2025-08-31').format(dateFormat), name: 'Lamar Advertising Co (Buffet)', isin: 'US5128161099', score: 7.24 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'New Hope Corp Ltd', isin: 'AU000000NHC7', score: 7.96 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'NAK Kazatomprom', isin: 'US63253R2013', score: 7.50 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'Orient Overseas International Ltd', isin: 'BMG677491539', score: 9.70 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'Repsol SA', isin: 'ES0173516115', score: 8.42 },
    { dateOfAnalysis: dayjs('2025-07-01').format(dateFormat), name: 'SITC International Holdings Co Ltd', isin: 'KYG8187G1055', score: 7.84 },
    { dateOfAnalysis: dayjs('2025-08-22').format(dateFormat), name: 'Shougang Fushan Resources Group Ltd', isin: 'HK0639031506', score: 8.25 },
    { dateOfAnalysis: dayjs('2025-08-22').format(dateFormat), name: 'Sun Art Retail Group Ltd', isin: 'HK0000083920', score: 6.83 },
    { dateOfAnalysis: dayjs('2025-08-22').format(dateFormat), name: 'Yue Yuen Industrial Holdings Ltd', isin: 'BMG988031446', score: 8.29 },
    { dateOfAnalysis: dayjs('2025-08-22').format(dateFormat), name: 'VTech Holdings Ltd', isin: 'BMG9400S1329', score: 8.21 },
    { dateOfAnalysis: dayjs('2025-08-22').format(dateFormat), name: 'WH Group Ltd', isin: 'KYG960071028', score: 8.88 },
    { dateOfAnalysis: dayjs('2025-08-31').format(dateFormat), name: 'UnitedHealth Group (Buffet)', isin: 'US91324P1021', score: 7.75 },
];

export default oldCompanies; 
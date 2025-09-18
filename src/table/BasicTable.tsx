import React from "react";
import dayjs from "dayjs";
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
    scoreEquityAverage,
    scoreEBITDAAverage,
    scoreNetProfitAverage,
    scoreDebtToEquity,
    scoreReturnOnEquity,
    scoreMarketCap
} from '../helpers/allOther';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
    getSortedRowModel
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box
} from "@mui/material";
import allCompanies from '../data/companies/allCompanies';
import useGetData from './hooks';
import { InvestmentRecord } from '../types';
import { dmitriScoreConversionNumber } from '../data/globalVars';

// TODO: remove useless
export type Company = {
    dateOfAnalysis: string,
    name: string,
    isin: string,
    score: number,
    country: string
}

// const date = dayjs('2025-09-12');
// const formattedDate = date.format('DD-MMM-YYYY');

// const defaultData: any = [
//   { dateOfAnalysis: formattedDate, name: "Apple", isin: 'abc', score: 1 },
//   { dateOfAnalysis: formattedDate, name: "Google", isin: 'xyz', score: 2 },
//     { dateOfAnalysis: formattedDate, name: "Facebook", isin: 'sdl', score: 3 },
// ]

function parseCustomDate(value?: unknown): dayjs.Dayjs {
    if (value == null) {
        return dayjs("2025-04-01"); // fallback
    }

    if (value instanceof Date || typeof value === "number") {
        const d = dayjs(value as any);
        return d.isValid() ? d : dayjs("2025-04-01");
    }

    if (typeof value === "string") {
        const s = value.trim();
        const match = s.match(/Date\(\s*(\d{4})\s*,\s*(\d{1,2})\s*,\s*(\d{1,2})\s*\)/i);
        if (match) {
            const year = Number(match[1]);
            const month = Number(match[2]); // zero-based
            const day = Number(match[3]);
            return dayjs(new Date(year, month, day));
        }

        const fallback = dayjs(s);
        return fallback.isValid() ? fallback : dayjs("2025-04-01");
    }

    return dayjs("2025-04-01");
}

function consoleLennar(allValues: InvestmentRecord, currentScore: number, criteria: string, currentMaxScore: number) {

    if (allValues['Company Name'] === 'Lennar Corp') {
        console.log(criteria, ': ', currentScore, '...', 'maxScore: ', currentMaxScore)
    }
}

function dmitriScoreCustomFn(info: any) {
    const value = info.getValue();

    // TODO: uncomment this VALUE thing
    // if (value) {
    //     return Number(value.toFixed(2));
    // }

    const item: InvestmentRecord = info.row.original;

    let finalScore = 0;
    let maxScorePossible = 0;
    // TODO: remove this, i.e. currently we are doing only LENNAR so change that
    if (item['Company Name'] === 'Lennar Corp') {
        console.log('============================');
        console.log('item: ', item);

        // console.log("allValues: ", item);


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
        const calcDIS = scoreDegiroIncomeStatement(Number(item['how does their Income Statement Look on Degiro'] as number), Number(item['are assets bigger than liabilities consistently'] as number));
        console.log("calcDIS: ", calcDIS);
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
        const calcTV = scoreTradeVolume(sharePrice, item['avg trading volume, last 3 months in units in Millions'] as number);
        finalScore = finalScore + calcTV * tvWeight;
        maxScorePossible = maxScorePossible + tradingVolumeMaxScore * tvWeight;
        consoleLennar(item, finalScore, 'tv', maxScorePossible);


        // Years To Earnings Match Share
        const yearsToEarningsMatchShareMaxScore = 10;
        const ytemWeight = 5;
        const calcYTEM = yearsForEarningsMatchPrice(sharePrice, item['EPS (earning per share) average for the past 10 years in euro currency'] as number);
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
        const calcNetProfit = scoreNetProfitAverage(item['annual net profit average in the past 10 years, in euros in millions?'] as number);
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








    }
    // end
    const finalReturn = (finalScore / maxScorePossible * dmitriScoreConversionNumber).toFixed(2);
    // console.log('============================');
    // console.log('company name', item['Company Name']);
    // console.log("finalReturn: ", finalReturn);


    return finalReturn;

}

function createSortableHeader(name: string | React.ReactNode) {
    return ({ column }: { column: any }) => {
        const isSorted = column.getIsSorted();
        return (
            <button
                onClick={() => column.toggleSorting()}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    cursor: "pointer",
                    background: "none",
                    border: "none"
                }}
            >
                {name}{" "}
                {isSorted === "asc" ? "🔼" : isSorted === "desc" ? "🔽" : "↕️"}
            </button>
        );
    };
}

const defaultColumns: ColumnDef<InvestmentRecord>[] = [
    {
        accessorKey: "avg AI grade",
        header: createSortableHeader('avg AI grade'),
        id: 'aiGrade',
        cell: ({ getValue }) => getValue() ? Number(getValue<number>().toFixed(2)) : 0
    },
    {
        accessorKey: "date of analysis",
        id: "date",
        header: createSortableHeader('Date of Analysis'),
        cell: ({ getValue }) => {
            // getValue can return a string, Date, number, etc.
            const raw = getValue() as unknown;
            const parsed = parseCustomDate(raw);
            return parsed ? parsed.format("DD-MMM-YYYY") : "-";
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = parseCustomDate(rowA.getValue(columnId));
            const b = parseCustomDate(rowB.getValue(columnId));

            if (!a && !b) return 0;

            // nulls are always "greater"
            if (!a) return 1;
            if (!b) return -1;

            return a.valueOf() - b.valueOf();
        },
    },
    {
        accessorKey: "Country",
        header: "Country",
        id: 'country'
    },
    {
        accessorKey: "isin",
        header: "isin",
        id: 'isin'
    },
    {
        accessorKey: "Company Name",
        header: "Name",
        id: 'name'
    },
    {
        accessorKey: "Dmitri score by feel",
        header: createSortableHeader(<><div style={{ fontSize: '12px' }}>{"Dmitri Score"}</div><div style={{ fontSize: '10px' }}>{'(max 11)'}</div></>),
        id: 'dmitriScore',
        cell: dmitriScoreCustomFn
    }
]

const BasicTable = () => {

    const data = useGetData();

    const [sorting, setSorting] = React.useState([
        { id: "dmitriScore", desc: true },
    ]);
    const [fitchAndSp, setFitchAndSp] = React.useState('');
    const [convertedFitchAndSp, setConvertedFitchAndSp] = React.useState(0);

    const [moody, setMoody] = React.useState('');
    const [convertedMoody, setConvertedMoody] = React.useState(0);

    function convertMoody() {
        setConvertedMoody(scoreMoodyRating(moody));
    }

    function convertFitchAndSp() {
        setConvertedFitchAndSp(scoreFitchAndSpRating(fitchAndSp));
    }

    const table = useReactTable({
        data: data,
        columns: defaultColumns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <>
            <Box sx={{ display: 'flex', gap: 10 }}>
                <Box>
                    <input type='text' value={fitchAndSp} onChange={(e) => setFitchAndSp(e.target.value)} />
                    <button onClick={convertFitchAndSp}>convert</button>
                    <h3>Fitch and S&P: {convertedFitchAndSp}</h3>
                </Box>
                <Box>
                    <input
                        type="text"
                        value={moody}
                        onChange={(e) => setMoody(e.target.value)}
                    />
                    <button onClick={convertMoody}>convert</button>
                    <h3>Moody: {convertedMoody}</h3>
                </Box>
            </Box >
            <hr />
            <Table>
                <TableHead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} sx={{ backgroundColor: '#f0f0f0' }}>
                            {headerGroup.headers.map(header => (
                                <TableCell
                                    key={header.id}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export default BasicTable;
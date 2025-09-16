import React from "react";
import dayjs from "dayjs";
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
import {
    scoreFitchAndSpRating,
    scoreMoodyRating,
} from '../helpers/allOther';
import useGetData from './hooks';
import { InvestmentRecord } from '../types';

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

function dmitriScoreCustomFn(info: any){
    console.log('info', info);

    const value = info.getValue();

    if(value){
        return Number(value.toFixed(2));
    }

    return 0;

}

const defaultColumns: ColumnDef<InvestmentRecord>[] = [
    {
        accessorKey: "date of analysis",
        id: "date",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <button
                    onClick={() => column.toggleSorting()}
                    style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", background: "none", border: "none" }}
                >
                    Date of Analysis{" "}
                    {isSorted === "asc" ? "🔼" : isSorted === "desc" ? "🔽" : "↕️"}
                </button>
            );
        },
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
        accessorKey: "avg AI grade",
        header: "avg AI grade",
        id: 'aiGrade',
        cell: ({getValue}) => getValue() ? Number(getValue<number>().toFixed(2)) : 0
    },
    {
        accessorKey: "Dmitri score by feel",
        header: () => <><div style={{ fontSize: '12px' }}>{"Dmitri Score"}</div><div style={{ fontSize: '10px' }}>{'(max 11)'}</div></>,
        id: 'dmitriScore',
        cell: dmitriScoreCustomFn
    },
]

const BasicTable = () => {

    const data = useGetData();

    const [sorting, setSorting] = React.useState([
        { id: "aiGrade", desc: true },
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
            <Table sx={{ maxWidth: 1050 }}>
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
import { useEffect, useState } from 'react';
import {
    ColumnDef, createColumnHelper
} from "@tanstack/react-table";
import { InvestmentRecord } from '../types';
import dayjs from "dayjs";
import dmitriScoreCustomFn from './dmitriScoreCustomFn';

const SHEET_ID = '1-tffkTHziGUtE8yt4_E4ZB86Q9dNyvouHGMhNxlTGKk';
const SHEET_NAME = 'SingleStocksWithDividends';
const rowToStartAt = 3;

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


// 1) Strip the JSONP wrapper and parse
function parseGViz(text: string) {
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\)\s*;?\s*$/);
    if (!match) {
        throw new Error("Unexpected response format: GViz wrapper not found.");
    }
    return JSON.parse(match[1]);
}


// 2) Convert GViz table -> array of objects
//    Set useFormatted=true to prefer formatted strings (e.g., "7.25%" instead of 0.0725)
function gvizTableToObjects(gviz: any, useFormatted = false) {
    const cols = gviz.table.cols.map((c: any) => c.label || c.id);
    return gviz.table.rows.map((r: any) => {
        const obj: Record<string, any> = {};
        r.c.forEach((cell: any, i: number) => {
            if (!cell) {
                obj[cols[i]] = null;
            } else {
                obj[cols[i]] = useFormatted && cell.f != null ? cell.f : cell.v;
            }
        });
        return obj;
    });
}


export const useGetData = () => {
    const [data, setData] = useState([]);


    useEffect(() => {
        const fetchSheet = async () => {
            const url =
                `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
                `?sheet=${SHEET_NAME}&range=A${rowToStartAt}:ZZ`;
            const res = await fetch(url);
            const text = await res.text();




            const gviz = parseGViz(text);           // <-- unwrap + JSON.parse
            // console.log("gviz: ", gviz);
            const rows = gvizTableToObjects(gviz);  // <-- array of row objects (raw values)
            // const rows = gvizTableToObjects(gviz, true); // use formatted values instead, i.e. Currency will be: "$1,000.00" as opposed to 1000
            // console.log("rows: ", rows);

            // remove "BY FEEL SCORE" items
            let filteredRows = rows.filter((row: any) => {
                return row['score was by feel'] !== 'yes'
            })


            setData(filteredRows);


        };


        fetchSheet();
    }, []);

    return data;

}

const columnHelper = createColumnHelper<InvestmentRecord>();

export const defaultColumns = [
    // Date of Analysis column with custom sorting
    columnHelper.accessor('date of analysis', {
        id: 'date',
        header: createSortableHeader('Date of Analysis'),
        cell: ({ getValue }) => {
            const raw = getValue();
            const parsed = parseCustomDate(raw);
            return parsed ? parsed.format("DD-MMM-YYYY") : "-";
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = parseCustomDate(rowA.getValue(columnId));
            const b = parseCustomDate(rowB.getValue(columnId));

            if (!a && !b) return 0;
            if (!a) return 1;
            if (!b) return -1;

            return a.valueOf() - b.valueOf();
        },
    }),

    // Country
    columnHelper.accessor('Country', {
        id: 'country',
        header: 'Country',
    }),

    // ISIN
    columnHelper.accessor('isin', {
        id: 'isin',
        header: 'ISIN',
    }),

    // Company Name
    columnHelper.accessor('Company Name', {
        id: 'name',
        header: 'Name',
    }),

    // Dmitri Score
    columnHelper.accessor('DmitriScore', {
        id: 'dmitriScore',
        header: createSortableHeader(
            <>
                <div style={{ fontSize: '12px' }}>Dmitri Score</div>
                <div style={{ fontSize: '10px' }}>(max 11)</div>
            </>
        ),
        cell: dmitriScoreCustomFn,
    }),
];
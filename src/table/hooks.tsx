import React, { useEffect, useState } from 'react';

const SHEET_ID = '1-tffkTHziGUtE8yt4_E4ZB86Q9dNyvouHGMhNxlTGKk';
const SHEET_NAME = 'SingleStocksWithDividends';
const rowToStartAt = 3;




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


const useGetData = () => {
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


            setData(rows);


        };


        fetchSheet();
    }, []);

    return data;

}

export default useGetData;
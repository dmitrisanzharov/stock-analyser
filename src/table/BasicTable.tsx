import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel
} from "@tanstack/react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import useGetData, { defaultColumns } from './hooks';
import {
    scoreFitchAndSpRating,
    scoreMoodyRating,
} from '../helpers/allOther';


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
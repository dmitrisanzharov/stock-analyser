import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';
import { removeDuplicatesFromArr } from '../helpers/removeDuplicatesFromArr';
import { SingleCompanyAnalysisType } from '../types';
import { COMPANY_ANALYZED, SINGLE_ANALYSIS_ITEMS_ARR } from './dmitriScoreCustomFn';
import { defaultColumns, useGetData } from './hooks';
import AnalysisTable from './AnalysisTable';



const BasicTable = () => {
    const data = useGetData(!Boolean(COMPANY_ANALYZED));

    const [sorting, setSorting] = React.useState([{ id: 'dmitriScore', desc: true }]);

    const table = useReactTable({
        data: data,
        columns: defaultColumns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    const finalSingleAnalysisData: SingleCompanyAnalysisType[] = removeDuplicatesFromArr(SINGLE_ANALYSIS_ITEMS_ARR);

    return (
        <Box>
            {Boolean(COMPANY_ANALYZED.length) && (
                <>
                    <h2>Company analyzed: {COMPANY_ANALYZED}</h2>
                    <AnalysisTable finalSingleAnalysisData={finalSingleAnalysisData} />
                    <hr />
                </>
            )}
            <Table>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} sx={{ backgroundColor: '#f0f0f0' }}>
                            {headerGroup.headers.map((header) => (
                                <TableCell key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default BasicTable;

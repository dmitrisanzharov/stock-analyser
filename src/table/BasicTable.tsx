import React from "react";
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
} from "@mui/material";
import allCompanies from '../data/companies/allCompanies';

export type Company = {
  dateOfAnalysis: string,
  name: string,
  isin: string,
  score: number,
}

// const date = dayjs('2025-09-12');
// const formattedDate = date.format('DD-MMM-YYYY');

// const defaultData: any = [
//   { dateOfAnalysis: formattedDate, name: "Apple", isin: 'abc', score: 1 },
//   { dateOfAnalysis: formattedDate, name: "Google", isin: 'xyz', score: 2 },
//     { dateOfAnalysis: formattedDate, name: "Facebook", isin: 'sdl', score: 3 },
// ]

const defaultColumns: ColumnDef<Company>[] = [
  {
    accessorKey: "dateOfAnalysis",
    header: "Date of Analysis",
    id: 'date'
  },
  {
    accessorKey: "isin",
    header: "isin",
    id: 'isin'
  },
  {
    accessorKey: "name",
    header: "Name",
    id: 'name'
  },
  {
    accessorKey: "score",
    header: () => <><div style={{fontSize: '12px'}}>{"Dmitri Score"}</div><div style={{fontSize: '10px'}}>{'(max 11)'}</div></>,
    id: 'score',
    cell: info => info.getValue<number>().toFixed(2)
  },
]

const BasicTable = () => {

  const [sorting, setSorting] = React.useState([
    { id: "score", desc: true },
  ]);


  const table = useReactTable({
    data: allCompanies,
    columns: defaultColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table sx={{ maxWidth: 750 }}>
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
  )
}

export default BasicTable;
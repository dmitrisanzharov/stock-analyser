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
  Box
} from "@mui/material";
import allCompanies from '../data/companies/allCompanies';
import {
  scoreFitchAndSpRating,
  scoreMoodyRating,
} from '../helpers/allOther';

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
    id: 'date',
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <button
          onClick={() => column.toggleSorting()}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          Date of Analysis {" "}
          {isSorted === 'asc' ? "🔼" : isSorted === 'desc' ? "🔽" : '↕️'}
        </button>
      );
    },
    sortingFn: (a, b, columnId) => {
      const dateA = new Date(a.getValue(columnId));
      const dateB = new Date(b.getValue(columnId));
      return dateA.getTime() - dateB.getTime();
    },
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
    header: () => <><div style={{ fontSize: '12px' }}>{"Dmitri Score"}</div><div style={{ fontSize: '10px' }}>{'(max 11)'}</div></>,
    id: 'score',
    cell: info => info.getValue<number>().toFixed(2)
  },
]

const BasicTable = () => {

  const [sorting, setSorting] = React.useState([
    { id: "score", desc: true },
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
    </>
  )
}

export default BasicTable;
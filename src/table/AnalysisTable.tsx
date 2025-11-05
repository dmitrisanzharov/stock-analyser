import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, Typography, TableBody } from "@mui/material";
import { SingleCompanyAnalysisType } from "../types";

const yellowColor = '#fcf4a3';

type StatusResult = { label: 'ok' | 'bad'; color: typeof yellowColor | 'red' } | null;

export function getStatus(itemValue: number, maxValue: number): StatusResult {
    if (maxValue <= 0) return null; // prevent division by zero
    const ratio = (itemValue / maxValue) * 100;

    if (ratio >= 80) return null;
    if (ratio >= 50) return { label: 'ok', color: yellowColor };
    return { label: 'bad', color: 'red' };
}

const AnalysisTable: React.FC<{ finalSingleAnalysisData: SingleCompanyAnalysisType[] }> = ({
    finalSingleAnalysisData
}) => {

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant='subtitle2' fontWeight={600}>
                                Criteria
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='subtitle2' fontWeight={600}>
                                Flag
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='subtitle2' fontWeight={600}>
                                Score
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='subtitle2' fontWeight={600}>
                                Max Score
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {finalSingleAnalysisData.map((item: SingleCompanyAnalysisType, index: number) => {

                        const calcFlag: StatusResult = getStatus(item.criteriaScore, item.maxScore);

                        return <TableRow key={index}>
                            <TableCell>{item.criteriaName}</TableCell>
                            <TableCell sx={{ backgroundColor: calcFlag?.color }}>{calcFlag?.label}</TableCell>
                            <TableCell>{item.criteriaScore}</TableCell>
                            <TableCell>{item.maxScore}</TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AnalysisTable;
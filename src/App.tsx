import React, { Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { ErrorBoundary } from 'react-error-boundary';
import ConvertToFitchSpMoody from './table/ConvertToFitchSpMoody';

// Lazy load the table
const BasicTable = lazy(() => import('./table/BasicTable'));

function App() {
    return (
        <Box sx={{ p: 2 }}>
            <ConvertToFitchSpMoody />
            <ErrorBoundary
                FallbackComponent={() => <Box sx={{color: 'red'}}>error</Box>}
                onReset={() => {
                    // reset logic, e.g., reload table
                }}
            >
                <Suspense
                    fallback={
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    }
                >
                    <BasicTable />
                </Suspense>
            </ErrorBoundary>
        </Box>
    );
}

export default App;

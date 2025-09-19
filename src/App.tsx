import React, { Suspense, lazy } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load the table
const BasicTable = lazy(() => import('./table/BasicTable'));

function App() {
    return (
        <Box sx={{ p: 2 }}>
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

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {
    scoreFitchAndSpRating,
    scoreMoodyRating,
} from '../helpers/allOther';

const ConvertToFitchSpMoody: React.FC = () => {
    const [fitchAndSp, setFitchAndSp] = useState('');
    const [convertedFitchAndSp, setConvertedFitchAndSp] = useState(0);

    const [moody, setMoody] = useState('');
    const [convertedMoody, setConvertedMoody] = useState(0);

    function convertMoody() {
        setConvertedMoody(scoreMoodyRating(moody));
    }

    function convertFitchAndSp() {
        setConvertedFitchAndSp(scoreFitchAndSpRating(fitchAndSp));
    }

    return (
        <>
            <Box sx={{ display: 'flex', gap: 10 }}>
                <Box>
                    <input
                        type="text"
                        value={fitchAndSp}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFitchAndSp(e.target.value)}
                    />
                    <button onClick={convertFitchAndSp}>convert</button>
                    <h3>Fitch and S&P: {convertedFitchAndSp}</h3>
                </Box>

                <Box>
                    <input
                        type="text"
                        value={moody}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMoody(e.target.value)}
                    />
                    <button onClick={convertMoody}>convert</button>
                    <h3>Moody: {convertedMoody}</h3>
                </Box>
            </Box>
            <hr />
        </>
    );
};

export default ConvertToFitchSpMoody;

import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { ComparativeChart } from './MethodChart'
import { EvaluateEndpoint } from './EvaluateEndpoint'

export default function App() {
  return (
    <Grid   justifyContent="center" container spacing={2} c>
      <Grid item xs={5} sx={{mx:4,my:8}}>
        <ComparativeChart></ComparativeChart>
      </Grid>
      <Grid item xs={5} sx={{mx:4,my:8}}>
      <EvaluateEndpoint></EvaluateEndpoint>
      </Grid>

    </Grid>
  );
}

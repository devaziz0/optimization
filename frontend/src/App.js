import * as React from 'react';
import Grid from '@mui/material/Grid';
import { ComparativeChart,EvaluateEndpoint } from './charts'

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

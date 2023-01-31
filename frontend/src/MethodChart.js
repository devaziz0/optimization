import React, { useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function ComparativeChart() {



    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },

        },
    };

    const [loading, setLoading] = React.useState(false)
    const [naiveData, setNaiveData] = React.useState([])
    const [efficientData, setEfficientData] = React.useState([])
    const [numElement, setNumElements] = React.useState(1);
    const handleChange = (event) => {
        setNumElements(event.target.value);
    };
    const labels = ['5', '10', '15', '20', '25'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Naive',
                data: naiveData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Efficient',
                data: efficientData,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    useEffect(() => {
        setLoading(true)
        fetch(`http://127.0.0.1:8000/benchmark/compare/?num_elements=${numElement}&repetition=1`)
            .then((response) => response.json()
                .then((data) => {
                    setNaiveData(data["naive"])
                    setEfficientData(data["efficient"])
                    setLoading(false)
                }))
    }, [numElement])

    return <>
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Naive vs effective method
                </Typography>
                <Typography sx={{ py: 2 }}>This graph showcase the difference in performance between the naive method and the efficient method in comparaison by the number of lists, you can change the number of list elements below for different results.</Typography>

                {loading ? <Box sx={{ display: 'flex',justifyContent:'center',minHeight:320,alignItems:'center' }}>
                    <CircularProgress />
                </Box> : <Line options={options} data={data} />}


            </CardContent>
            <CardActions>
                <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel id="demo-simple-select-label">Number of list elements</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={numElement}
                        label="Number of list elements"
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>1</MenuItem>

                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={10}>10</MenuItem>

                    </Select>
                </FormControl>
            </CardActions>
        </Card>



    </>;
}


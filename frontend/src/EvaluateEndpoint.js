import React, { useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


function ParameterInput(props) {
    const handleChange = (event) => {
        props.handler(event.target.value);
    };
    return <FormControl sx={{ minWidth: 160 }}>
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.element}
            label="Number of list elements"
            onChange={handleChange}
        >
            <MenuItem value={1}>4</MenuItem>

            <MenuItem value={4}>8</MenuItem>
            <MenuItem value={6}>12</MenuItem>
            <MenuItem value={8}>16</MenuItem>
            <MenuItem value={10}>20</MenuItem>

        </Select>
    </FormControl>
}



export function EvaluateEndpoint() {

    const [loading, setLoading] = React.useState(false)

    const [naiveData, setNaiveData] = React.useState(0)
    const [efficientData, setEfficientData] = React.useState(0)
    const [numElement, setNumElements] = React.useState(4);
    const [numList, setnumList] = React.useState(4);
    const [numRepetition, setRepetition] = React.useState(4);
    const [quotient, setQuotient] = React.useState(1);

    const handleChange = (event) => {
        setQuotient(event.target.value);
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
            },
        },
    };

    const labels = ['Naive', 'Efficient'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Method performance',
                data: [naiveData, efficientData],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },

        ],
    };

    useEffect(() => {
        setLoading(true)

        fetch(`http://127.0.0.1:8000/optimize/naive/?num_elements=${numElement}&repetition=${numRepetition}&num_lists=${numList}&quotient=${quotient}`)
            .then((response) => response.json()
                .then((data) => {
                    setNaiveData(data["mean_time"])
                    setLoading(false)

                }))
        fetch(`http://127.0.0.1:8000/optimize/efficient/?num_elements=${numElement}&repetition=${numRepetition}&num_lists=${numList}&quotient=${quotient}`)
            .then((response) => response.json()
                .then((data) => {
                    setEfficientData(data["mean_time"])
                    setLoading(false)

                }))
    }, [numElement, numList, numRepetition, quotient])

    return <>
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Evaluate methods
                </Typography>
                <Typography sx={{ py: 2 }}>A graph showcasing the result of the evaluation of the methods in function of the number of lists,number of element, repetition and the quotient value.</Typography>
                
                {loading ? <Box sx={{ display: 'flex',justifyContent:'center',minHeight:320,alignItems:'center' }}>
                    <CircularProgress />
                </Box> : <Bar options={options} data={data} />}
            </CardContent>
            <CardActions>
                <ParameterInput
                    label={"Num of lists"}
                    element={numList}
                    handler={setnumList}

                />
                <ParameterInput
                    label={"Num of elements"}
                    element={numElement}
                    handler={setNumElements}
                />
                <ParameterInput
                    label={"Repetitions"}
                    element={numRepetition}
                    handler={setRepetition}

                />
                <TextField
                    id="outlined-number"
                    label="Number"
                    type="number"
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </CardActions>
        </Card>



    </>;
}




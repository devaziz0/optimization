import React, { useEffect } from 'react';
import {
    Chart as ChartJS,
    BarElement,
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Box from '@mui/material/Box';
import { Line } from 'react-chartjs-2';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';

import {
    evaluateMethodDescription,
    chartMethodDescription
} from './constants'

ChartJS.register(
    BarElement,
    LinearScale,
    CategoryScale,
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
        <InputLabel>{props.label}</InputLabel>
        <Select
            value={props.element}
            onChange={handleChange}
            label={props.label}
        >
            {props.paramChoices.map((choice) => <MenuItem value={choice}>{choice}</MenuItem>)}


        </Select>
    </FormControl>
}



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

export function ChartCard(props) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {props.title}
                </Typography>
                <Typography sx={{ py: 2 }}>{props.description}</Typography>

                {props.loading ? <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 320, alignItems: 'center' }}>
                    <CircularProgress />
                </Box> : props.chart}


            </CardContent>
            <CardActions>
                {props.children}
            </CardActions>
        </Card>

    )

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


    function optimizeMethodTime(method) {
        return fetch(`http://127.0.0.1:8000/optimize/${method}/?num_elements=${numElement}&repetition=${numRepetition}&num_lists=${numList}&quotient=${quotient}`)
            .then((response) => response.json())
    }

    useEffect(() => {
        setLoading(true)
        Promise.all([optimizeMethodTime("naive"), optimizeMethodTime("efficient")]).then((mean_times) => {
            setNaiveData(mean_times[0]["mean_time"])
            setEfficientData(mean_times[1]["mean_time"])
            setLoading(false)

        })
    }, [numElement, numList, numRepetition, quotient])

    return <>
        <ChartCard
            title={"Evaluate methods"}
            description={evaluateMethodDescription}
            loading={loading}
            chart={<Bar options={options} data={data} />}
        >                <ParameterInput
                label={"Num of lists"}
                element={numList}
                handler={setnumList}
                paramChoices={[4, 6, 8, 10]}

            />
            <ParameterInput
                label={"Num of elements"}
                element={numElement}
                handler={setNumElements}
                paramChoices={[4, 6, 8, 10, 12]}

            />
            <ParameterInput
                label={"Repetitions"}
                element={numRepetition}
                handler={setRepetition}
                paramChoices={[4,8,12,16]}


            />
            <TextField
                label="Quotient"
                type="number"
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </ChartCard>



    </>;
}



export function ComparativeChart() {

    const [loading, setLoading] = React.useState(false)
    const [naiveData, setNaiveData] = React.useState([])
    const [efficientData, setEfficientData] = React.useState([])
    const [numElement, setNumElements] = React.useState(1);
    const [repetition, setRepetition] = React.useState(1);

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
        fetch(`http://127.0.0.1:8000/benchmark/compare/?num_elements=${numElement}&repetition=${repetition}`)
            .then((response) => response.json()
                .then((data) => {
                    setNaiveData(data["naive"])
                    setEfficientData(data["efficient"])
                    setLoading(false)
                }))
    }, [numElement, repetition])

    return <>
        <ChartCard
            title={"Naive vs effective method"}
            description={chartMethodDescription}
            loading={loading}
            chart={<Line options={options} data={data} />}
        >
            <ParameterInput
                label={"Number of list elements"}
                element={numElement}
                handler={setNumElements}
                paramChoices={[4, 6, 8, 10, 12]}

            />
            <ParameterInput
                label={"Number of repetition"}
                element={repetition}
                handler={setRepetition}
                paramChoices={[1, 2, 4, 6, 8, 10]}

            />
        </ChartCard>

    </>;
}


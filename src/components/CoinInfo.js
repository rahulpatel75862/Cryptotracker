import React, { useEffect, useState } from 'react';
import { CryptoState } from '../CryptoContext';
import axios from 'axios';
import { HistoricalChart } from '../config/api';
import { CircularProgress, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState([]);
  const { currency } = CryptoState();

  const fetchHistoricData = async () => {
    try {
      const { data } = await axios.get(HistoricalChart(coin.id, 1, currency));
      setHistoricData(data.prices);
    } catch (error) {
      console.error('Error fetching historic data:', error);
    }
  };

  useEffect(() => {
    console.log('Fetching historic data...');
    fetchHistoricData();
  }, [coin.id, currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      mode: 'dark',
    },
  });

  const Container = styled('div')(({ theme }) => ({
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  }));

  const renderChart = () => {
    if (!historicData.length) {
      return (
        <CircularProgress style={{ color: 'gold' }} size={250} thickness={1} />
      );
    }

    const labels = historicData.map((coin) => {
      let date = new Date(coin[0]);
      return date;
    });
    const prices = historicData.map((coin) => coin[1]);

    // Set chartData and options
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: `Price (Past 1 Day) in ${currency}`,
          data: prices,
          borderColor: '#EEBC1D',
          fill: false,
        },
      ],
    };

    const options = {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour',
            displayFormats: {
              hour: 'h:mm A',
            },
          },
        },
        y: {
          beginAtZero: false,
        },
      },
    };

    return (
      <>
        {/* Debugging: Log historicData to console */}
        <pre>{JSON.stringify(historicData, null, 2)}</pre>

        {/* Render the Line chart with chartData and options */}
        <Line data={chartData} options={options} />
      </>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <div>
          {renderChart()}
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default CoinInfo;

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CryptoState } from '../CryptoContext';
import axios from 'axios';
import { SingleCoin } from '../config/api';
import { styled } from '@mui/system';
import CoinInfo from '../components/CoinInfo';
import { LinearProgress, Typography } from '@mui/material';
import ReactHtmlParser from 'react-html-parser';
import { numberWithCommas } from '../components/Banner/Caraousel';
import { Chart } from 'chart.js/auto'; // Import Chart.js with time scale support

const CoinPageContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const CoinPageSidebar = styled('div')(({ theme }) => ({
  width: '30%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 25,
  borderRight: '2px solid grey',
}));

const Heading = styled('div')({
  fontWeight: 'bold',
  marginBottom: 20,
  fontFamily: 'Montserrat',
});

const Description = styled('div')({
  width: '100%',
  fontFamily: 'Montserrat',
  padding: 25,
  paddingBottom: 15,
  paddingTop: 0,
  textAlign: 'justify',
});

const MarketData = styled('div')(({ theme }) => ({
  alignSelf: 'start',
  padding: 25,
  paddingTop: 10,
  width: '100%',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  [theme.breakpoints.down('xs')]: {
    alignItems: 'start',
    width: '100%',
  },
}));

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const { currency, symbol } = CryptoState();
  const [chartInstance, setChartInstance] = useState(null);

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error('Error fetching coin:', error);
    }
  };

  useEffect(() => {
    if (coin === null) {
      fetchCoin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coin]);

  useEffect(() => {
    if (coin) {
      // Check if a chart instance already exists and update it if it does
      if (chartInstance) {
        // Update the chart data here, e.g., chartInstance.data.labels and chartInstance.data.datasets[0].data
        chartInstance.update();
      } else {
        // Create a new chart instance
        const ctx = document.getElementById('coinChart').getContext('2d');
        const newChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [], // Your time labels here
            datasets: [
              {
                label: 'Price',
                data: [], // Your data points here
                borderColor: 'blue',
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                },
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        setChartInstance(newChartInstance);
      }
    }
  }, [coin, chartInstance]);

  if (!coin) return <LinearProgress style={{ backgroundColor: 'gold' }} />;

  return (
    <CoinPageContainer>
      <CoinPageSidebar>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Heading>
          <Typography variant='h3'>{coin?.name}</Typography>
        </Heading>
        <Description>
          <Typography variant='subtitle1'>
            {ReactHtmlParser(coin?.description.en.split('. ')[0])}
          </Typography>
          <MarketData>
            {/* Your market data here */}
          </MarketData>
        </Description>
      </CoinPageSidebar>
      <div>
        <canvas id="coinChart"></canvas>
      </div>
    </CoinPageContainer>
  );
};

export default CoinPage;

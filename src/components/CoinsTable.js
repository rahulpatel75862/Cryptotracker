import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'; // Step 1: Import useRef
import { CoinList } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { Container, LinearProgress, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { numberWithCommas } from './Banner/Caraousel';

const CoinsTable = () => {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const tableContainerRef = useRef(null); // Step 2: Create a ref for the TableContainer

    const { currency, symbol } = CryptoState();

    const fetchCoins = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(CoinList(currency));
            setCoins(data);
        } catch (error) {
            console.error('Error fetching coins:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoins();
    }, [currency]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: '#fff',
            },
            mode: 'dark',
        },
    });

    const handleSearch = () => {
        return coins.filter((coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        );
    };

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&.Mui-selected': {
            backgroundColor: 'transparent',
        },
        '&.Mui-selected:hover': {
            backgroundColor: 'transparent',
        },
        backgroundColor: '#16171a',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#131111',
        },
        fontFamily: 'Montserrat',
    }));

    const handlePaginationChange = (_, value) => {
        setPage(value);
        // Step 4: Scroll to the TableContainer ref
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Container style={{ textAlign: 'center' }}>
                <Typography
                    variant="h4"
                    style={{ margin: 18, fontFamily: 'Montserrat' }}
                >
                    Cryptocurrency Prices by Market Cap
                </Typography>
                <TextField
                    label="Search for a crypto currency.."
                    variant="outlined"
                    style={{ marginBottom: 20, width: '100%' }}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* Step 3: Attach the ref to the TableContainer */}
                <TableContainer ref={tableContainerRef}>
                    {loading ? (
                        <LinearProgress style={{ backgroundColor: 'gold' }} />
                    ) : (
                        <Table>
                            <TableHead style={{ backgroundColor: 'gold' }}>
                                <TableRow>
                                    {['Coin', 'Price', '24h change', 'Market Cap'].map((head) => (
                                        <TableCell
                                            style={{
                                                color: 'black',
                                                fontWeight: 700,
                                                fontFamily: 'Montserrat',
                                            }}
                                            key={head}
                                            align={head === 'Coin' ? '' : 'right'}
                                        >
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {handleSearch()
                                    .slice((page - 1) * 10, (page - 1) * 10 + 10)
                                    .map((row) => {
                                        const profit = row.price_change_percentage_24h > 0;
                                        return (
                                            <StyledTableRow
                                                onClick={() => navigate(`/coins/${row.id}`)}
                                                key={row.name}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{
                                                        display: 'flex',
                                                        gap: 15,
                                                    }}
                                                >
                                                    <img
                                                        src={row?.image}
                                                        alt={row.name}
                                                        height="50"
                                                        style={{ marginBottom: 10 }}
                                                    />
                                                    <div
                                                        style={{ display: "flex", flexDirection: "column" }}
                                                    >
                                                        <span
                                                            style={{
                                                                textTransform: "uppercase",
                                                                fontSize: 22,
                                                            }}
                                                        >
                                                            {row.symbol}
                                                        </span>
                                                        <span style={{ color: "darkgrey" }}>{row.name}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell align='right'>
                                                    {symbol}{' '}
                                                    <span
                                                        style={{
                                                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        {profit && "+"}
                                                        {row.price_change_percentage_24h.toFixed(2)}%
                                                    </span>
                                                </TableCell>
                                                <TableCell align='right'>
                                                    {symbol} {numberWithCommas(row.price_change_percentage_24h.toFixed(2))}%
                                                </TableCell>
                                                <TableCell align='right'>
                                                    {symbol}{' '}
                                                    {numberWithCommas(row.market_cap.toFixed(2))} M
                                                </TableCell>
                                            </StyledTableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
                <Pagination
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: 'gold',
                        },
                    }}
                    style={{
                        padding: 20,
                        width: "100%",
                        display: 'flex',
                        justifyContent: "center"
                    }}
                    count={(handleSearch()?.length / 10).toFixed(0)}
                    page={page}
                    onChange={handlePaginationChange}
                />
            </Container>
        </ThemeProvider>
    );
};

export default CoinsTable;

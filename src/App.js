import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header, { } from './components/Header';
import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';
import { styled } from '@mui/system';

function App() {
  const AppContainer = styled('div')({
    backgroundColor: '#14161a',
    color: 'white',
    minHeight: '100vh',
  });

  return (
    <Router>
      <AppContainer>
        <div>
          <Header />
          <Routes>
            <Route path='/' element={<Homepage/>} exact />
            <Route path='/coins/:id' element={<CoinPage/>} />
          </Routes>
        </div>
      </AppContainer>
    </Router>
  );
}

export default App;

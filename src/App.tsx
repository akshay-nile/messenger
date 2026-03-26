import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Header from './components/Header';
import LoginUser from './components/LoginUser';
import Messenger from './components/Messenger';
import RegisterUser from './components/RegisterUser';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/login' element={<LoginUser />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/messenger' element={<Messenger />} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

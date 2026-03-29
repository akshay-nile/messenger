import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ChatThread from './components/ChatThread';
import LoginUser from './components/LoginUser';
import Messenger from './components/Messenger';
import RegisterUser from './components/RegisterUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginUser />} />
        <Route path='/register' element={<RegisterUser />} />
        <Route path='/messenger' element={<Messenger />} />
        <Route path='/chat' element={<ChatThread />} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

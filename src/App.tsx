import { HashRouter, Navigate, Route, Routes } from 'react-router';
import ChatThread from './components/ChatThread';
import LoginUser from './components/LoginUser';
import Messenger from './components/Messenger';
import RegisterUser from './components/RegisterUser';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginUser />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/messenger" element={<Messenger />} />
        <Route path="/chat" element={<ChatThread />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

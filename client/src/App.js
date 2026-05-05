import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import ChatPage from './pages/Chat/ChatPage';
import Journal from './pages/Journal/Journal';
import Progress from './pages/Progress/Progress';
import Breathing from './pages/Breathing/Breathing';
import Habits from './pages/Habits/Habits';
import Learn from './pages/Learn/Learn';
import Profile from './pages/Profile/Profile';
import Reframer from './pages/Reframer/Reframer';
import SOSButton from './components/SOSButton/SOSButton';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user && <SOSButton />}
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/" />} />
        <Route path="/journal" element={user ? <Journal /> : <Navigate to="/" />} />
        <Route path="/progress" element={user ? <Progress /> : <Navigate to="/" />} />
        <Route path="/breathing" element={user ? <Breathing /> : <Navigate to="/" />} />
        <Route path="/habits" element={user ? <Habits /> : <Navigate to="/" />} />
        <Route path="/learn" element={user ? <Learn /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/reframe" element={user ? <Reframer /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
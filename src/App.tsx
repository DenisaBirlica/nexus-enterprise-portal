import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Tools from './pages/Tools';
import ChatHistory from './pages/ChatHistory';
import Chat from './pages/Chat';
import { SearchProvider } from './contexts/SearchContext';
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      <SearchProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/chat-history" element={<ChatHistory />} />
              <Route path="/chat/:chatId" element={<Chat />} />
            </Routes>
          </MainLayout>
        </Router>
      </SearchProvider>
    </AppProvider>
  );
}

export default App;
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from '@mui/material';

import GameTable from "./pages/GameTable";
import About from './pages/About';
import OpenScene from './pages/OpenScene';
import TermsPage from './pages/TermsPage';
import Tasks from './pages/Tasks';
import AdSenseScript from './components/adSerive';


function App() {
  return (
    <Router>
      {/* <Container maxWidth="" style={{ padding: 0 }}> */}
      <Routes>
        <Route path="/" element={<OpenScene />} />
        <Route path="/game/:roomId" element={<GameTable />} />
        <Route path="/game" element={<GameTable />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
      <AdSenseScript /> 
      {/* </Container> */}
    </Router>
  );
}

export default App;

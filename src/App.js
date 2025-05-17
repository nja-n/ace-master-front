import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import GameTable from "./pages/GameTable";
import About from './pages/About';
import OpenScene from './pages/OpenScene';
import TermsPage from './pages/TermsPage';
import Tasks from './pages/Tasks';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OpenScene />} />
        <Route path="/game/:roomId" element={<GameTable />} />
        <Route path="/game" element={<GameTable />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;

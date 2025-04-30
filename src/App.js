import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import GameTable from "./pages/GameTable";
import About from './pages/About';
import OpenScene from './pages/OpenScene';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OpenScene />} />
        <Route path="/game/:roomId" element={<GameTable />} />
        <Route path="/game" element={<GameTable />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;

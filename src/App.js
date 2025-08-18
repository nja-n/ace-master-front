import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';

import LayoutWithBackground from './components/ui/LayoutWithBackground';
import About from './pages/About';
import BirthDay from './pages/BirthDay';
import ContactUs from './pages/ContactUs';
import GameTable from "./pages/GameTable";
import OpenScene from './pages/OpenScene';
import Tasks from './pages/Tasks';
import TermsPage from './pages/TermsPage';
import { LoadingProvider, useLoading } from "./components/LoadingContext";
import SpinnerOverlay from "./components/ui/SpinnerOverlay";
import ProfilePage from "./pages/Profile";
import { UserProvider } from "./components/ui/UserContext";
import Leaderboard from "./pages/LeaderBoard";

function AppContent() {
  const { loading, loadingMessage } = useLoading();

  return (
    <>
      <UserProvider>
        {loading && <SpinnerOverlay text={loadingMessage} />}
        <LayoutWithBackground>
          <Routes>
            <Route path="/" element={<OpenScene />} />
            <Route path="/game/:roomId" element={<GameTable />} />
            <Route path="/game" element={<GameTable />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/bday" element={<BirthDay />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ranking" element={<Leaderboard />} />
          </Routes>
        </LayoutWithBackground>
      </UserProvider>
    </>
  );
}

function App() {
  return (
    <Router>
      <LoadingProvider>
        <AppContent />
      </LoadingProvider>
    </Router>
  );
}

export default App;

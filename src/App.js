import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';

import { useEffect, useState } from "react";
import { LoadingProvider, useLoading } from "./components/LoadingContext";
import { versionHistory } from "./components/methods";
import { AlertProvider } from "./components/ui/CustomAlert";
import LayoutWithBackground from './components/ui/LayoutWithBackground';
import SpinnerOverlay from "./components/ui/SpinnerOverlay";
import { UserProvider } from "./components/ui/UserContext";
import { apiClient } from "./components/utils/ApIClient";
import VoiceRoom from "./components/voicechat/VoiceRoom";
import About from './pages/About';
import BirthDay from './pages/BirthDay';
import Blog from "./pages/Blog";
import ContactUs from './pages/ContactUs';
import FAQ from "./pages/Faq";
import NotFound from "./pages/fragments/NotFound";
import GameTable from "./pages/GameTable";
import Leaderboard from "./pages/LeaderBoard";
import OpenScene from './pages/OpenScene';
import ProfilePage from "./pages/Profile";
import Tasks from './pages/Tasks';
import TermsPage, { PrivacyReact, TermsReact } from './pages/TermsPage';
import GameTableDesign from "./pages/GameTable2";
import InviteRedirect from "./pages/fragments/InviteRedirect";
import AdManager from "./components/force/AdManager";

function AppContent() {
  const { loading, loadingMessage, setLoading } = useLoading();

  const [version, setVersion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        let versionApi = versionHistory.replace('/history', '');
        const response = await apiClient(versionApi, { withAuth: false });
        setVersion(response.version);
      } catch (error) {
        console.error("Error fetching version:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVersion();

    let intervalId = setInterval(fetchVersion, 60_000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!version) {
      setLoading(true);
    }
  }, [version, setLoading]);

  if (!version) {
    return <OpenScene forceSplash={true} />;
  }

  return (
    <>
      <UserProvider>
        {loading && <SpinnerOverlay text={loadingMessage} />}
        <LayoutWithBackground version={version}>
          <Routes>
            <Route path="/" element={<OpenScene />} />
            <Route path="/game/:roomId" element={<GameTable />} />
            <Route path="/game" element={<GameTable />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<TermsReact />} />
            <Route path="/privacy" element={<PrivacyReact />} />
            <Route path="/terms-privacy" element={<TermsPage />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/bday" element={<BirthDay />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ranking" element={<Leaderboard />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/vvv" element={<VoiceRoom />} />
            <Route path="/play/:match" element={<GameTableDesign />} />
            <Route path="/invite/:code" element={<InviteRedirect />} />
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
        <AlertProvider>
          <AdManager />
          <AppContent />
        </AlertProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;

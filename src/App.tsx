import { HashRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { HomePage } from './pages/HomePage';
import { CertificatePage } from './pages/CertificatePage';
import { MyCertificatesPage } from './pages/MyCertificatesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <HashRouter>
            <div className="orb orb--red" aria-hidden="true" />
            <div className="orb orb--blue" aria-hidden="true" />
            <Navbar />
            <main id="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/certificates" element={<CertificatePage />} />
                <Route path="/my-certificates" element={<MyCertificatesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </HashRouter>
        </MotionConfig>
      </ToastProvider>
    </ThemeProvider>
  );
}
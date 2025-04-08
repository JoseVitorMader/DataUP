import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from './pages/Home';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import Header from './components/Header';
import Erro from './pages/Erro';
import Contato from './pages/Contato';
import Cadastro from './pages/Registrar';
import RecuperarSenha from './pages/Recuperar';
import ResetarSenha from './pages/Resetar';
import Receitas from './pages/Receitas';
import Cardapios from './pages/Cardapio';

// Animação foda
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

// Componente para rotas com Header
const LayoutWithHeader = ({ children }) => (
  <>
    <Header />
    <AnimatedPage>{children}</AnimatedPage>
  </>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/home" element={<LayoutWithHeader><Home /></LayoutWithHeader>} />
        <Route path="/sobre" element={<LayoutWithHeader><Sobre /></LayoutWithHeader>} />
        <Route path="/contato" element={<LayoutWithHeader><Contato /></LayoutWithHeader>} />
        <Route path="/cadastro" element={<AnimatedPage><Cadastro /></AnimatedPage>} />
        <Route path="/recuperar" element={<AnimatedPage><RecuperarSenha /></AnimatedPage>} />
        <Route path="/resetar" element={<AnimatedPage><ResetarSenha /></AnimatedPage>} />
        <Route path="/receitas" element={<LayoutWithHeader><Receitas /></LayoutWithHeader>} />
        <Route path="/cardapios" element={<LayoutWithHeader><Cardapios /></LayoutWithHeader>} />
        <Route path="*" element={<AnimatedPage><Erro /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
}

function RoutesApp() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default RoutesApp;
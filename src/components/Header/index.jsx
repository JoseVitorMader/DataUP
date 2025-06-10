import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaBoxes, FaComment, FaTruck, FaBook, FaHome, FaInfoCircle, FaEnvelope, FaUserShield, FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './style.css';

const normalItems = [
  { to: "/home", icon: <FaHome />, text: "Home" },
  { to: "/cardapios", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/estoque", icon: <FaBoxes />, text: "Estoque" },
  { to: "/feedbacks", icon: <FaComment />, text: "Feedbacks" },
  { to: "/receitas", icon: <FaBook />, text: "Receitas" },
  { to: "/sobre", icon: <FaInfoCircle />, text: "Sobre" },
  { to: "/contato", icon: <FaEnvelope />, text: "Contato" },
  { to: "/chatboot", icon: <FaComment />, text: "Chatbot" }
];

const estudanteItems = [
  { to: "/cardapios", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/sobre", icon: <FaInfoCircle />, text: "Sobre" },
  { to: "/contato", icon: <FaEnvelope />, text: "Contato" },
  { to: "/chatboot", icon: <FaComment />, text: "Chatbot" }
];

const funcionarioItems = [
  { to: "/home", icon: <FaHome />, text: "Home" },
  { to: "/cardapios", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/estoque", icon: <FaBoxes />, text: "Estoque" },
  { to: "/feedbacks", icon: <FaComment />, text: "Feedbacks" },
  { to: "/recebimento", icon: <FaTruck />, text: "Recebimento" },
  { to: "/receitas", icon: <FaBook />, text: "Receitas" },
  { to: "/sobre", icon: <FaInfoCircle />, text: "Sobre" },
  { to: "/contato", icon: <FaEnvelope />, text: "Contato" },
  { to: "/usuarios", icon: <FaUserShield />, text: "Usuários" },
  { to: "/cadCardapio", icon: <FaUtensils />, text: "Cadastrar Cardápio" },
  { to: "/cadReceita", icon: <FaBook />, text: "Cadastrar Receita" },
  { to: "/recebimento", icon: <FaTruck />, text: "Recebimento" },
  
];

const admMasterItems = [
  { to: "/gerenciar-escolas", icon: <FaUserShield />, text: "Gerenciar Escolas" },
  { to: "/selecionar-tipo-ingrediente", icon: <FaBoxes />, text: "Cadastrar Ingredientes" }
];

function Header() {
  const [isADM, setIsADM] = useState(false);
  const [isADMMASTER, setIsADMMASTER] = useState(false);
  const [showADM, setShowADM] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateADM = () => {
      setIsADM(localStorage.getItem('isADM') === 'true');
      setIsADMMASTER(localStorage.getItem('isADMMASTER') === 'true');
    };
    window.addEventListener('storage', updateADM);
    updateADM();
    return () => window.removeEventListener('storage', updateADM);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (navRef.current && containerRef.current) {
        const needsScroll = navRef.current.scrollWidth > containerRef.current.clientWidth;
        setShowScrollButtons(needsScroll);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const toggleView = () => {
    setShowADM(!showADM);
  };

  const scroll = (direction) => {
    if (navRef.current) {
      const scrollAmount = 120;
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const tipoUsuario = localStorage.getItem('tipoUsuario');

  // Itens principais (sempre visíveis conforme tipo)
  let menuItems;
  if (tipoUsuario === 'estudante') {
    menuItems = estudanteItems;
  } else if (isADM && showADM) {
    menuItems = [
      ...funcionarioItems,
      // Adiciona os exclusivos do ADM Master se for ADM Master também
      ...(isADMMASTER ? admMasterItems : [])
    ];
  } else if (isADM) {
    menuItems = normalItems;
  } else {
    menuItems = normalItems;
  }

  // Fecha sidebar ao clicar em um link
  const handleSidebarLink = () => setSidebarOpen(false);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('isADM');
    localStorage.removeItem('tipoUsuario');
    window.location.href = '/';
  };

  return (
    <header>
      <div className="logo-title">
        <Link to="/">
          <img src="/favicon.ico" alt="Logo" className="favicon" />
        </Link>
        <h2>Tá Na Medida</h2>
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Sair"
          style={{
            background: 'none',
            border: 'none',
            marginLeft: '10px',
            cursor: 'pointer',
            color: '#c00',
            fontSize: '1.5rem',
            verticalAlign: 'middle'
          }}
        >
          <FaSignOutAlt />
        </button>
      </div>

      {/* Botão hamburger só no mobile */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <FaBars />
      </button>

      <div className="nav-container" ref={containerRef}>
        {showScrollButtons && (
          <button
            className="scroll-button left"
            onClick={() => scroll('left')}
            aria-label="Rolar para esquerda"
          >
            <FaChevronLeft />
          </button>
        )}

        <nav className="navbar" ref={navRef}>
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <motion.li 
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to={item.to} className="nav-link" onClick={handleSidebarLink}>
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.text}</span>
                </Link>
              </motion.li>
            ))}
            {isADM && (
              <motion.li 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="nav-item toggle-button"
                onClick={toggleView}
                style={{ cursor: 'pointer' }}
              >
                <span className="nav-icon">{showADM ? <FaMinus /> : <FaPlus />}</span>
                <span className="nav-text">{showADM ? "Fechar ADM" : "ADM"}</span>
              </motion.li>
            )}
          </ul>
        </nav>

        {showScrollButtons && (
          <button
            className="scroll-button right"
            onClick={() => scroll('right')}
            aria-label="Rolar para direita"
          >
            <FaChevronRight />
          </button>
        )}
      </div>

      {/* Sidebar mobile */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
          <FaTimes />
        </button>
        <ul className="sidebar-list">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-item">
              <Link to={item.to} className="sidebar-link" onClick={handleSidebarLink}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.text}</span>
              </Link>
            </li>
          ))}
          {isADM && (
            <li className="sidebar-item toggle-button" onClick={toggleView} style={{ cursor: 'pointer' }}>
              <span className="nav-icon">{showADM ? <FaMinus /> : <FaPlus />}</span>
              <span className="nav-text">{showADM ? "Fechar ADM" : "ADM"}</span>
            </li>
          )}
        </ul>
      </div>
      {/* Overlay para fechar sidebar ao clicar fora */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </header>
  );
}

export default Header;
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaBoxes, FaComment, FaTruck, FaBook, FaHome, FaInfoCircle, FaEnvelope, FaUserShield, FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './style.css';

const normalItems = [
  { to: "/home", icon: <FaHome />, text: "Home" },
  { to: "/cardapios", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/estoque", icon: <FaBoxes />, text: "Estoque" },
  { to: "/feedbacks", icon: <FaComment />, text: "Feedbacks" },
  { to: "/recebimento", icon: <FaTruck />, text: "Recebimento" },
  { to: "/receitas", icon: <FaBook />, text: "Receitas" },
  { to: "/sobre", icon: <FaInfoCircle />, text: "Sobre" },
  { to: "/contato", icon: <FaEnvelope />, text: "Contato" }
];

const estudanteItems = [
  { to: "/cardapios", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/sobre", icon: <FaInfoCircle />, text: "Sobre" },
  { to: "/contato", icon: <FaEnvelope />, text: "Contato" }
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
  { to: "/cadIngredientes", icon: <FaBoxes />, text: "Cadastrar Ingredientes" },
];

function Header() {
  const [isADM, setIsADM] = useState(false);
  const [showADM, setShowADM] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const adm = localStorage.getItem('isADM') === 'true';
    setIsADM(adm);
    
    const checkScroll = () => {
      if (navRef.current) {
        const needsScroll = navRef.current.scrollWidth > navRef.current.clientWidth;
        setShowScrollButtons(needsScroll);
      }
    };
    
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [showADM]);

  const toggleView = () => {
    setShowADM(!showADM);
  };

  const scroll = (direction) => {
    if (navRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const tipoUsuario = localStorage.getItem('tipoUsuario');

  let menuItems;
  if (tipoUsuario === 'estudante') {
    menuItems = estudanteItems;
  } else if (isADM && showADM) {
    menuItems = funcionarioItems;
  } else {
    // Mostra só os itens normais para funcionário comum
    menuItems = normalItems;
  }

  // Fecha sidebar ao clicar em um link
  const handleSidebarLink = () => setSidebarOpen(false);

  return (
    <header>
      <div className="logo-title">
        <Link to="/">
          <img src="/favicon.ico" alt="Logo" className="favicon" />
        </Link>
        <h2>Tá Na Medida</h2>
      </div>

      {/* Botão hamburger só no mobile */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <FaBars />
      </button>

      <div className="nav-container">
        {showScrollButtons && (
          <button className="scroll-button left" onClick={() => scroll('left')}>
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
          <button className="scroll-button right" onClick={() => scroll('right')}>
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
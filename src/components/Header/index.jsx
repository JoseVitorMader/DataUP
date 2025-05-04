import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaBoxes, FaComment, FaTruck, FaBook, FaHome, FaInfoCircle, FaEnvelope, FaUserShield, FaChartBar, FaPlus, FaMinus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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

const adminItems = [
  { to: "/usuarios", icon: <FaUserShield />, text: "Usuários" },
  { to: "/cadCardapio", icon: <FaUtensils />, text: "Cadastrar Cardápio" },
  { to: "/cadReceita", icon: <FaBook />, text: "Cadastrar Receita" }
];

function Header() {
  const [isADM, setIsADM] = useState(false);
  const [showADM, setShowADM] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
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

  const visibleItems = isADM ? (showADM ? adminItems : normalItems) : normalItems;

  return (
    <header>
      <div className="logo-title">
        <img src="/favicon.ico" alt="Logo" className="favicon" />
        <h2>Tá Na Medida</h2>
      </div>

      <div className="nav-container">
        {showScrollButtons && (
          <button className="scroll-button left" onClick={() => scroll('left')}>
            <FaChevronLeft />
          </button>
        )}
        
        <nav className="navbar" ref={navRef}>
          <ul className="nav-list">
            {visibleItems.map((item, index) => (
              <motion.li 
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-item"
              >
                <Link to={item.to} className="nav-link">
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
    </header>
  );
}

export default Header;
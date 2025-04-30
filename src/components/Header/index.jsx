import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUtensils, FaBoxes, FaComment, FaTruck, FaBook, FaHome,
  FaInfoCircle, FaEnvelope, FaUserShield, FaPlus, FaMinus
} from 'react-icons/fa';
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

  useEffect(() => {
    const adm = localStorage.getItem('isADM') === 'true';
    setIsADM(adm);
  }, []);

  const toggleView = () => {
    setShowADM(!showADM);
  };

  const visibleItems = isADM ? (showADM ? adminItems : normalItems) : normalItems;

  return (
    <aside className="sidebar-menu">
      <div className="sidebar-header">
        <img src="/favicon.ico" alt="Logo" className="favicon" />
        <h1 className="sidebar-title">Tá Na Medida</h1>
      </div>

      {visibleItems.map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to={item.to} className="sidebar-item">
            {item.icon}
            {item.text}
          </Link>
        </motion.div>
      ))}

      {isADM && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleView}
          className="sidebar-item"
          style={{ cursor: 'pointer' }}
        >
          {showADM ? <FaMinus /> : <FaPlus />} {showADM ? "Fechar ADM" : "ADM"}
        </motion.div>
      )}
    </aside>
  );
}

export default Header;

import { Link } from 'react-router-dom';
import { FaUtensils, FaBoxes, FaComment, FaTruck, FaBook, FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './style.css';

const navItems = [
  { to: "/home", icon: <FaHome />, text: "Home" },
  { to: "/cardapios", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/estoque", icon: <FaBoxes />, text: "Estoque" },
  { to: "/feedbacks", icon: <FaComment />, text: "Feedbacks" },
  { to: "/recebimento", icon: <FaTruck />, text: "Recebimento" },
  { to: "/receitas", icon: <FaBook />, text: "Receitas" },
  { to: "/sobre", icon: <FaInfoCircle />, text: "Sobre" },
  { to: "/contato", icon: <FaEnvelope />, text: "Contato" }
];

function Header() {
  return (
    <header>
      <div className="logo-title">
        <img src="/favicon.ico" alt="Logo" className="favicon" />
        <h2>Tá Na Medida</h2>
      </div>

      <nav className="navbar">
        <ul className="nav-list">
          {navItems.map((item, index) => (
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
        </ul>
      </nav>
    </header>
  );
}

export default Header;
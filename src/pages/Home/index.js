import { Link } from 'react-router-dom';
import { FaUtensils, FaBoxes, FaComment, FaTruck, FaBook } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import './style.css';

const menuItems = [
  { to: "/cardapio", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/estoque", icon: <FaBoxes />, text: "Estoque" },
  { to: "/feedbacks", icon: <FaComment />, text: "Feedbacks" },
  { to: "/recebimento", icon: <FaTruck />, text: "Recebimento" },
  { to: "/receitas", icon: <FaBook />, text: "Receitas" }
];

function Menu() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible", {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    });
  }, [controls]);

  return (
    <motion.nav 
      className="menu"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.ul
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem 
            key={index} 
            to={item.to} 
            icon={item.icon} 
            text={item.text} 
            controls={controls}
          />
        ))}
      </motion.ul>
    </motion.nav>
  );
}

const MenuItem = ({ to, icon, text, controls }) => {
  const rippleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 10, opacity: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 300 }
        },
      }}
      animate={controls}
      whileHover={{ 
        scale: 1.05,
        background: "linear-gradient(45deg, #f4ca9e, #fff)"
      }}
      whileTap={{ scale: 0.95 }}
      className="menu-item-container"
    >
      <Link to={to} className="menu-link">
        <span className="icon">{icon}</span>
        <span className="text">{text}</span>
        
        <motion.span
          className="ripple"
          variants={rippleVariants}
          initial="hidden"
          whileTap="visible"
        />
      </Link>
    </motion.li>
  );
};

export default Menu;
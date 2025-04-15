import { Link } from 'react-router-dom';
import { FaUtensils, FaBoxes, FaComment, FaTruck, FaBook } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import './style.css';

const menuItems = [
  { to: "/cardapios", icon: <FaUtensils />, text: "Cardápio" },
  { to: "/estoque", icon: <FaBoxes />, text: "Estoque" },
  { to: "/feedbacks", icon: <FaComment />, text: "Feedbacks" },
  { to: "/recebimento", icon: <FaTruck />, text: "Recebimento" },
  { to: "/receitas", icon: <FaBook />, text: "Receitas" }
];

function NavBar() {
  const controls = useAnimation();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (menuVisible) {
      controls.start("visible");
    }
  }, [menuVisible, controls]);

  return (
    <>
      <div className="logo" onClick={() => setMenuVisible(!menuVisible)}>
        <img src="/public/logo.png" alt="Logo" />
      </div>

      {menuVisible && (
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
            initial="hidden"
            animate={controls}
          >
            {menuItems.map((item, index) => (
              <MenuItem 
                key={index} 
                to={item.to} 
                icon={item.icon} 
                text={item.text} 
              />
            ))}
          </motion.ul>
        </motion.nav>
      )}
    </>
  );
}

const MenuItem = ({ to, icon, text }) => {
  const rippleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 10, opacity: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.li
      className="menu-item-container"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 300 }
        },
      }}
      whileHover={{ 
        scale: 1.05,
        background: "linear-gradient(45deg, #f4ca9e, #fff)"
      }}
      whileTap={{ scale: 0.95 }}
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

export default NavBar;

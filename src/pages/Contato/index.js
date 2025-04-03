import React from 'react';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';
import './style.css';

function Contato() {
  return (
    <div className="contato-content">
      <h1>Sobre</h1>
      <p className="contato-text">
        Se você deseja entrar em contato com o <strong>Tá Na Medida</strong>, temos o maior prazer em atender suas dúvidas, 
        ouvir suas sugestões ou estabelecer parcerias! 📩💬
        <br />
        <br />
        Seja qual for o meio, estamos ansiosos para falar com você e garantir que sua experiência com o <strong>Tá Na Medida</strong> seja incrível! 💚
      </p>

      <h3>Entre em contato:</h3>
      <div className="contato-links">
        <a 
          className="contato-button" 
          href="https://www.instagram.com/ta.na.medida?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaInstagram /> Instagram
        </a>
        <a 
          className="contato-button" 
          href="mailto:tanamedidacedup@gmail.com" 
        >
          <FaEnvelope /> Email
        </a>
      </div>
    </div>
  );
}

export default Contato;

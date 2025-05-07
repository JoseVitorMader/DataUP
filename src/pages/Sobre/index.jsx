import './style.css';
import React from 'react';
import { FaExternalLinkAlt } from "react-icons/fa";

function Sobre() {
  return (
    <div className="sobre-content">
      <h1>Sobre</h1>
      <p className="sobre-text">
        O Ta na medida é um aplicativo cujo objetivo é promover a sustentabilidade no ambiente escolar, 
        reduzindo os desperdícios na preparação de refeições por meio de uma plataforma que auxilia e orienta 
        os profissionais da cozinha quanto às quantidades adequadas. O aplicativo também conta com uma aba 
        dedicada à realização do ato de compostagem, apoiada por uma inteligência artificial para a gestão de alimentos.
      </p>
      <h3>Para mais informações acesse:</h3>
      <a 
        className="sobre-link" 
        href="https://sites.google.com/estudante.sed.sc.gov.br/tanamedida/in%C3%ADcio" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        Leia mais sobre o projeto <FaExternalLinkAlt />
      </a>
    </div>
  );
}

export default Sobre;

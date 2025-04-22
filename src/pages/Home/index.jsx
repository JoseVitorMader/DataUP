import React from 'react';
import { FiMenu, FiArrowRight } from 'react-icons/fi';
import './style.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="home-card">
          <div className="home-header">
            <div className="header-content">
              <h2 className="welcome-title">Bem-vindo ao Tá na Medida</h2>
              <div className="header-underline"></div>
              <p className="welcome-subtitle">Explore os recursos do sistema e gerencie melhor o desperdício alimentar escolar.</p>
            </div>
          </div>

          <div className="ux-guide-container">
            <div className="ux-guide">

              <div className="ux-step">
                <div className="step-number-container">
                  <span className="step-number">1</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Home</h3>
                  <p className="step-description">Esta tela é o seu ponto de partida! Aqui você aprende como usar o sistema e entende as funções disponíveis.</p>
                </div>
              </div>

              <div className="ux-step">
                <div className="step-number-container">
                  <span className="step-number">2</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Sobre e Contato</h3>
                  <p className="step-description">Descubra o objetivo do projeto em "Sobre" e tire suas dúvidas ou envie sugestões na aba "Contato".</p>
                </div>
              </div>

              <div className="ux-step">
                <div className="step-number-container">
                  <span className="step-number">3</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Cardápio e Estoque</h3>
                  <p className="step-description">Gerencie o cardápio escolar e acompanhe o estoque em tempo real, otimizando o uso de ingredientes.</p>
                </div>
              </div>

              <div className="ux-step">
                <div className="step-number-container">
                  <span className="step-number">4</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Recebimentos e Receitas</h3>
                  <p className="step-description">Registre os produtos recebidos, controle as quantidades e explore receitas sustentáveis com o que há em estoque.</p>
                </div>
              </div>

              <div className="ux-step">
                <div className="step-number-container">
                  <span className="step-number">5</span>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Feedback com Visão Computacional</h3>
                  <p className="step-description">A lixeira inteligente usa visão computacional para identificar os alimentos mais descartados, gerando feedbacks úteis para as merendeiras e gestores escolares.</p>
                </div>
              </div>

              <div className="ux-hint">
                <div className="hint-content">
                  <FiMenu className="hint-icon" size={24} />
                  <span className="hint-text">Use o menu superior para navegar entre as telas!</span>
                  <FiArrowRight className="arrow-icon" size={18} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

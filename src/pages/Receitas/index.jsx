import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import './style.css';

const firebaseConfig = {
  apiKey: "AIzaSyCLEL9RdqRoop0n2Dc2c0bqzsKagv4ZaCU",
  authDomain: "tanamedida-2e7a3.firebaseapp.com",
  databaseURL: "https://tanamedida-2e7a3-default-rtdb.firebaseio.com",
  projectId: "tanamedida-2e7a3",
  storageBucket: "tanamedida-2e7a3.appspot.com",
  messagingSenderId: "490709823146",
  appId: "1:490709823146:web:a3c389cab4954757f5aad3",
  measurementId: "G-QP4XP50HGR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function Receitas() {
  const [receitas, setReceitas] = useState([]);
  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ingredientes, setIngredientes] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "receitas"));
        if (snapshot.exists()) {
          setReceitas(Object.values(snapshot.val()));
        }

        const ingredientesSnapshot = await get(child(dbRef, "ingredientes"));
        if (ingredientesSnapshot.exists()) {
          setIngredientes(ingredientesSnapshot.val());
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const obterNomeIngrediente = (idIngrediente) => {
    return ingredientes[idIngrediente]?.nome || "Ingrediente desconhecido";
  };

  const formatarImagem = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("data:image")) return url;
    return `https://${url}`;
  };

  return (
    <div className="container">
      <h1>RECEITAS</h1>
      
      {receitaSelecionada ? (
        <div className="receita-detalhes">
          <h2>{receitaSelecionada.titulo}</h2>
          
          {receitaSelecionada.imagem && (
            <img 
              src={formatarImagem(receitaSelecionada.imagem)}
              alt={receitaSelecionada.titulo} 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          <div className="info-rapida">
            <p><strong>🍳 Categoria:</strong> {receitaSelecionada.categoria}</p>
            <p><strong>⏱ Tempo:</strong> {receitaSelecionada.tempo_preparo} min</p>
            <p><strong>🍽 Rendimento:</strong> {receitaSelecionada.rendimento}</p>
          </div>
          
          <h3>📝 Ingredientes:</h3>
          <ul>
            {Object.values(receitaSelecionada.ingredientes).map((ingrediente, index) => (
              <li key={index}>
                {obterNomeIngrediente(ingrediente.id)}: {ingrediente.quantidade}
              </li>
            ))}
          </ul>
          
          <h3>👩‍🍳 Modo de Preparo:</h3>
          <ol>
            {Object.values(receitaSelecionada.passos).map((passo, index) => (
              <li key={index}>{passo}</li>
            ))}
          </ol>
          
          <button 
            className="botao-voltar" 
            onClick={() => setReceitaSelecionada(null)}
            aria-label="Voltar para lista de receitas"
          >
            {isMobile ? '← Voltar' : 'Voltar para lista de receitas'}
          </button>
        </div>
      ) : (
        <div className="grid">
          {loading ? (
            <p className="loading">Carregando receitas...</p>
          ) : receitas.length > 0 ? (
            receitas.map((receita) => (
              <button
                key={receita.id}
                className="botao-receita"
                onClick={() => setReceitaSelecionada(receita)}
                aria-label={`Ver receita de ${receita.titulo}`}
              >
                {receita.titulo}
              </button>
            ))
          ) : (
            <p className="sem-receitas">Nenhuma receita encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Receitas;
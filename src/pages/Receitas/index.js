import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import './style.css';

const firebaseConfig = {
  apiKey: "AIzaSyCLEL9RdqRoop0n2Dc2c0bqzsKagv4ZaCU",
  authDomain: "tanamedida-2e7a3.firebaseapp.com",
  databaseURL: "https://tanamedida-2e7a3-default-rtdb.firebaseio.com",
  projectId: "tanamedida-2e7a3",
  storageBucket: "tanamedida-2e7a3.firebasestorage.app",
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

  return (
    <div className="container">
      <h1>RECEITAS</h1>
      
      {receitaSelecionada ? (
        <div className="receita-detalhes">
          <h2>{receitaSelecionada.titulo}</h2>
          {receitaSelecionada.imagem && (
            <>
              {console.log("URL da Imagem:", receitaSelecionada.imagem)}
              <img 
                src={
                  receitaSelecionada.imagem.startsWith("http") 
                    ? receitaSelecionada.imagem 
                    : `https://${receitaSelecionada.imagem}`
                }
                alt={receitaSelecionada.titulo} 
                onError={(e) => e.target.style.display = 'none'}
              />
            </>
          )}
          <p><strong>Categoria:</strong> {receitaSelecionada.categoria}</p>
          <p><strong>Tempo de Preparo:</strong> {receitaSelecionada.tempo_preparo} minutos</p>
          <p><strong>Rendimento:</strong> {receitaSelecionada.rendimento}</p>
          <h3>Ingredientes:</h3>
          <ul>
            {Object.values(receitaSelecionada.ingredientes).map(ingrediente => (
              <li key={ingrediente.id}>
                {obterNomeIngrediente(ingrediente.id)}: {ingrediente.quantidade}
              </li>
            ))}
          </ul>
          <h3>Passos de Preparo:</h3>
          <ol>
            {Object.values(receitaSelecionada.passos).map((passo, index) => (
              <li key={index}>{passo}</li>
            ))}
          </ol>
          <button className="botao-voltar" onClick={() => setReceitaSelecionada(null)}>Voltar</button>
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
              >
                {receita.titulo}
              </button>
            ))
          ) : (
            <p>Não há receitas disponíveis.</p>
          )}
        </div>
      )}
    </div>
  );
}
export default Receitas;
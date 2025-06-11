import React, { useEffect, useState } from "react";
import { getApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import './style.css';

const Cardapio = () => {
  const app = getApp(); 
  const db = getDatabase(app);

  const [cardapios, setCardapios] = useState([]);
  const [cardapioSelecionado, setCardapioSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recupera o idEscola do usuário logado
  const session = JSON.parse(localStorage.getItem('userSession'));
  const idEscola = session?.idEscola;

  useEffect(() => {
    if (!idEscola) {
      setCardapios([]);
      setLoading(false);
      return;
    }
    const fetchCardapios = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "cardapios"));
        if (snapshot.exists()) {
          let lista = Object.values(snapshot.val());
          if (session?.isSed === "true") {
            // Busca todas as escolas SED
            const escolasSnap = await get(child(dbRef, "escolas"));
            let escolasSedIds = [];
            if (escolasSnap.exists()) {
              escolasSedIds = Object.entries(escolasSnap.val())
                .filter(([_, escola]) => escola.isSed === true)
                .map(([id]) => id);
            }
            lista = lista.filter(cardapio => escolasSedIds.includes(cardapio.idEscola));
          } else {
            lista = lista.filter(cardapio => cardapio.idEscola === idEscola);
          }
          setCardapios(lista);
        } else {
          setCardapios([]);
        }
      } catch (error) {
        console.error("Erro ao buscar cardápios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardapios();
  }, [db, idEscola]);

  return (
    <div className="container">
      <h2>CARDÁPIOS</h2>

      {cardapioSelecionado ? (
        <div className="cardapio-detalhes">
          <h1>{cardapioSelecionado.nome}</h1>
          <p><strong>Escola:</strong> {cardapioSelecionado.escola}</p>
          <iframe
            src={cardapioSelecionado.url_pdf.replace("/view?usp=sharing", "/preview")}
            width="100%"
            height="500px"
            title="Cardápio PDF"
            allow="autoplay"
            frameBorder="0"
          ></iframe>
          <button className="botao-voltar" onClick={() => setCardapioSelecionado(null)}>Voltar</button>
        </div>
      ) : (
        <div className="flex-container">
          {loading ? (
            <p className="loading">Carregando cardápios...</p>
          ) : cardapios.length > 0 ? (
            cardapios.map((cardapio, index) => (
              <button
                key={index}
                className="botao-cardapio"
                onClick={() => setCardapioSelecionado(cardapio)}
              >
                {cardapio.nome}
              </button>
            ))
          ) : (
            <p>Não há cardápios disponíveis.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cardapio;

import React, { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { db } from '../../firebase';
import './style.css';

function Estoque() {
  const [estoque, setEstoque] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const recebimentosRef = ref(db, 'recebimentos');
    const estoqueRef = ref(db, 'estoque');

    
    onValue(recebimentosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          const estoqueItemRef = ref(db, `estoque/${key}`);
          set(estoqueItemRef, value); 
        });
      }
    });

    
    onValue(estoqueRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, item]) => ({ id, ...item }));
        setEstoque(lista);
      } else {
        setEstoque([]);
      }
    });
  }, []);

  const handleQuantidadeChange = (id, novaQuantidade) => {
    const novaQtdNum = parseFloat(novaQuantidade.replace(',', '.')) || 0;
    if (novaQtdNum <= 0) {
      remove(ref(db, `estoque/${id}`));
    } else {
      set(ref(db, `estoque/${id}/quantidade`), novaQuantidade);
    }
    setSuccess('Quantidade atualizada com sucesso!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="estoque-container">
      <h1>Estoque</h1>
      {success && <div className="success">{success}</div>}
      <table className="tabela-estoque">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Código</th>
            <th>Valor Unitário</th>
            <th>Quantidade (KG)</th>
            <th>Valor Total</th>
            <th>Aviso</th>
          </tr>
        </thead>
        <tbody>
          {estoque.map((item) => {
            const quantidade = parseFloat(item.quantidade.replace(',', '.')) || 0;
            const valor = parseFloat(item.valorUnitario.replace(',', '.')) || 0;
            const total = (quantidade * valor).toFixed(2);

            return (
              <tr key={item.id}>
                <td>{item.produto}</td>
                <td>{item.codigo}</td>
                <td>R$ {valor.toFixed(2)}</td>
                <td>
                  <input
                    type="text"
                    className="input-quantidade"
                    value={item.quantidade}
                    onChange={(e) => handleQuantidadeChange(item.id, e.target.value)}
                  />
                </td>
                <td>R$ {total}</td>
                <td>
                  {quantidade < 1 && quantidade > 0 ? (
                    <span className="alerta-baixo">Baixo Estoque</span>
                  ) : quantidade === 0 ? (
                    <span className="alerta-baixo">Zerado</span>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Estoque;

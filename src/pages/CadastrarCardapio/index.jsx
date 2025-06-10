import React, { useState } from 'react';
import './style.css';
import { getDatabase, ref, push, get } from 'firebase/database';

const CadastroCardapio = () => {
  const [form, setForm] = useState({
    nome: '',
    url_pdf: ''
  });

  // Recupera a sessão do usuário logado
  const session = JSON.parse(localStorage.getItem('userSession'));
  const idEscola = session?.idEscola;
  const isSed = session?.isSed === "true";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const cardapioRef = ref(db, 'cardapios');

    if (isSed) {
      // Busca todas as escolas da SED
      const escolasSnap = await get(ref(db, 'escolas'));
      if (escolasSnap.exists()) {
        const escolas = escolasSnap.val();
        const escolasSed = Object.entries(escolas).filter(([_, escola]) => escola.isSed === true);
        // Adiciona o cardápio para cada escola SED
        await Promise.all(
          escolasSed.map(async ([escolaId]) => {
            await push(cardapioRef, {
              idEscola: escolaId,
              nome: form.nome,
              url_pdf: form.url_pdf
            });
          })
        );
      }
    } else {
      // Adiciona só para a escola do usuário
      await push(cardapioRef, {
        idEscola: idEscola,
        nome: form.nome,
        url_pdf: form.url_pdf
      });
    }

    alert('Cardápio cadastrado com sucesso!');
    setForm({ nome: '', url_pdf: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Adicione um novo Cardápio!</h1>
      <label>
        Nome do Cardápio:
        <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Link do Cardápio (URL):
        <input type="url" name="url_pdf" value={form.url_pdf} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default CadastroCardapio;

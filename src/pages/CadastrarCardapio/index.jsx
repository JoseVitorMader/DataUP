import React, { useState } from 'react';
import './style.css';
import { getDatabase, ref, push } from 'firebase/database';

const CadastroCardapio = () => {
  const [form, setForm] = useState({
    escola: '',
    nome: '',
    url_pdf: ''
  });

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

    await push(cardapioRef, {
      escola: form.escola,
      nome: form.nome,
      url_pdf: form.url
    });

    alert('Cardápio cadastrado com sucesso!');
    setForm({ escola: '', nome: '', url_pdf: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <label>
        Escola:
        <input type="text" name="escola" value={form.escola} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Nome do Cardápio:
        <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Link do Cardápio (URL):
        <input type="url" name="url" value={form.url} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default CadastroCardapio;

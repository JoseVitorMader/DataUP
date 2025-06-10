import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set, remove, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase';
import './style.css';

const GerenciaEscolas = () => {
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEscola, setEditEscola] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNome, setNewNome] = useState('');
  const [newIsSed, setNewIsSed] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');
  const db = getDatabase(app);
  const navigate = useNavigate();

  useEffect(() => {
    const escolasRef = ref(db, 'escolas');
    onValue(escolasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const lista = Object.keys(data).map(id => ({
          id,
          nome: data[id].nome,
          isSed: !!data[id].isSed
        }));
        setEscolas(lista);
      } else {
        setEscolas([]);
      }
      setLoading(false);
    });
  }, [db]);

  const handleEdit = (escola) => {
    setEditEscola({ ...escola });
  };

  const handleSave = async () => {
    if (!editEscola.nome.trim()) {
      setError('O nome da escola não pode ser vazio.');
      return;
    }
    try {
      await set(ref(db, `escolas/${editEscola.id}`), {
        nome: editEscola.nome.trim(),
        isSed: !!editEscola.isSed
      });
      setEditEscola(null);
      setError('');
    } catch (err) {
      setError('Erro ao salvar escola.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta escola?')) {
      try {
        await remove(ref(db, `escolas/${id}`));
        setError('');
      } catch (err) {
        setError('Erro ao excluir escola.');
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNome.trim()) {
      setError('Informe o nome da escola.');
      return;
    }
    if (escolas.some(e => e.nome.trim().toLowerCase() === newNome.trim().toLowerCase())) {
      setError('Já existe uma escola com esse nome.');
      return;
    }
    try {
      const id = Date.now().toString();
      await set(ref(db, `escolas/${id}`), {
        nome: newNome.trim(),
        isSed: !!newIsSed
      });
      setNewNome('');
      setNewIsSed(false);
      setShowAdd(false);
      setError('');
    } catch (err) {
      setError('Erro ao adicionar escola.');
    }
  };

  const filteredEscolas = escolas.filter(e =>
    e.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Carregando escolas...</div>;

  return (
    <div className="admin-container">
      <h1>Administração de Escolas</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-user-btn" onClick={() => setShowAdd(!showAdd)}>
        {showAdd ? 'Cancelar' : 'Adicionar Escola'}
      </button>

      {showAdd && (
        <form className="add-user-form" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Nome da escola"
            value={newNome}
            onChange={e => setNewNome(e.target.value)}
            required
          />
          <label style={{ marginLeft: 10 }}>
            <input
              type="checkbox"
              checked={newIsSed}
              onChange={e => setNewIsSed(e.target.checked)}
            />
            Escola da SED
          </label>
          <button type="submit">Cadastrar</button>
        </form>
      )}

      {error && <div className="error">{error}</div>}

      <div className="users-table">
        {filteredEscolas.length === 0 ? (
          <p className="no-users">Nenhuma escola encontrada</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>SED</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEscolas.map(escola => (
                <tr key={escola.id}>
                  <td>{escola.id}</td>
                  <td>
                    {editEscola?.id === escola.id ? (
                      <input
                        type="text"
                        value={editEscola.nome}
                        onChange={e => setEditEscola({ ...editEscola, nome: e.target.value })}
                      />
                    ) : (
                      escola.nome
                    )}
                  </td>
                  <td>
                    {editEscola?.id === escola.id ? (
                      <select
                        value={editEscola.isSed ? 'true' : 'false'}
                        onChange={e => setEditEscola({ ...editEscola, isSed: e.target.value === 'true' })}
                      >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </select>
                    ) : (
                      escola.isSed ? 'Sim' : 'Não'
                    )}
                  </td>
                  <td className="actions">
                    {editEscola?.id === escola.id ? (
                      <>
                        <button onClick={handleSave} className="save">Salvar</button>
                        <button onClick={() => setEditEscola(null)} className="cancel">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(escola)} className="edit">Editar</button>
                        <button onClick={() => handleDelete(escola.id)} className="delete">Excluir</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default GerenciaEscolas;
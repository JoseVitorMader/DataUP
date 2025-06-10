import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, set, remove, push } from 'firebase/database';
import { app } from '../../firebase';
import './style.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserSenha, setNewUserSenha] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const navigate = useNavigate();
  const db = getDatabase(app);

  // Pegue o idEscola do usuário logado (ajuste conforme seu contexto de autenticação)
  const session = JSON.parse(localStorage.getItem('userSession'));
  const idEscola = session?.idEscola;

  useEffect(() => {
    const fetchUsers = () => {
      try {
        const usersRef = ref(db, 'users');
        onValue(usersRef, (snapshot) => {
          if (snapshot.exists()) {
            const usersData = snapshot.val();
            const usersList = Object.keys(usersData)
              .map(key => ({
                id: key,
                ...usersData[key]
              }))
              .filter(user => user.idEscola === idEscola); // Só mostra usuários da escola
            setUsers(usersList);
          } else {
            setUsers([]);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        setError("Erro ao carregar usuários.");
        setLoading(false);
      }
    };

    fetchUsers();
    return () => {};
  }, [db, idEscola]);

  const handleEdit = (user) => {
    setEditUser({ ...user });
  };

  const handleSave = async () => {
    if (!editUser) return;

    try {
      await set(ref(db, `users/${editUser.id}`), {
        email: editUser.email,
        senha: editUser.senha,
        ADM: editUser.ADM,
        ADMMASTER: editUser.ADMMASTER || false,
        idEscola: editUser.idEscola
      });
      setEditUser(null);
      setError('');
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      setError("Erro ao atualizar usuário.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await remove(ref(db, `users/${userId}`));
        setError('');
      } catch (err) {
        console.error("Erro ao excluir usuário:", err);
        setError("Erro ao excluir usuário.");
      }
    }
  };

  const toggleAdmin = async (user) => {
    try {
      await set(ref(db, `users/${user.id}/ADM`), !user.ADM);
      setError('');
    } catch (err) {
      console.error("Erro ao alterar status ADM:", err);
      setError("Erro ao alterar status ADM.");
    }
  };

  // Função para adicionar novo usuário
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    if (!newUserEmail || !newUserSenha) {
      setError('Preencha o email e a senha.');
      return;
    }

    // Verifica se já existe usuário com esse email na escola
    if (users.some(u => u.email === newUserEmail)) {
      setError('Já existe um usuário com esse email nesta escola.');
      return;
    }

    try {
      const newUserRef = push(ref(db, 'users'));
      await set(newUserRef, {
        email: newUserEmail.trim().toLowerCase(),
        senha: newUserSenha,
        ADM: false,
        ADMMASTER: false,
        idEscola: idEscola
      });
      setNewUserEmail('');
      setNewUserSenha('');
      setShowAddUser(false);
      setError('');
    } catch (err) {
      console.error("Erro ao adicionar usuário:", err);
      setError("Erro ao adicionar usuário.");
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Carregando usuários...</div>;

  return (
    <div className="admin-container">
      <h1>Administração de Usuários</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-user-btn" onClick={() => setShowAddUser(!showAddUser)}>
        {showAddUser ? 'Cancelar' : 'Adicionar Usuário'}
      </button>

      {showAddUser && (
        <form className="add-user-form" onSubmit={handleAddUser}>
          <input
            type="email"
            placeholder="Email do novo usuário"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={newUserSenha}
            onChange={(e) => setNewUserSenha(e.target.value)}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>
      )}

      {error && <div className="error">{error}</div>}

      <div className="users-table">
        {filteredUsers.length === 0 ? (
          <p className="no-users">Nenhum usuário encontrado</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>ADM</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {editUser?.id === user.id ? (
                      <input
                        type="email"
                        value={editUser.email}
                        onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td>
                    {editUser?.id === user.id ? (
                      <select
                        value={editUser.ADM}
                        onChange={(e) => setEditUser({...editUser, ADM: e.target.value === 'true'})}
                      >
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                      </select>
                    ) : (
                      <span className={`admin-status ${user.ADM ? 'admin' : 'user'}`}>
                        {user.ADM ? 'ADM' : 'Usuário'}
                      </span>
                    )}
                  </td>
                  <td className="actions">
                    {editUser?.id === user.id ? (
                      <>
                        <button onClick={handleSave} className="save">Salvar</button>
                        <button onClick={() => setEditUser(null)} className="cancel">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(user)} className="edit">Editar</button>
                        <button onClick={() => toggleAdmin(user)} className="toggle-admin">
                          {user.ADM ? 'Remover ADM' : 'Tornar ADM'}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="delete">Excluir</button>
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

export default AdminUsers;
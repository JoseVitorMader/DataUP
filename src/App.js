import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import RoutesApp from './routes';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail) {
        setLoading(false);
        return;
      }

      const db = getDatabase();
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userFound = Object.values(users).find(u => u.email === storedEmail);
        setUser(userFound);
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return <RoutesApp user={user} />;
}

export default App;
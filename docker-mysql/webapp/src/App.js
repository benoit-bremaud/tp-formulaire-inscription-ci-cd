import axios from 'axios';
import { useState, useEffect } from 'react';

// Le port de l'API est injecte au build/runtime via REACT_APP_SERVER_PORT
// (defini dans le docker-compose). L'appel part du NAVIGATEUR, donc on vise
// localhost:<port> : le port de l'API publie sur l'hote, pas le nom de service.
export function App() {
  const port = process.env.REACT_APP_SERVER_PORT;
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({ baseURL: `http://localhost:${port}` });
        const response = await api.get('/users');
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error(error);
      }
    }
    countUsers();
  }, [port]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Users manager</h1>
        <p>{usersCount} user(s) already registered</p>
      </header>
    </div>
  );
}

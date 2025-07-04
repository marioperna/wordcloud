import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from './customVar';

function Home() {
  const navigate = useNavigate();

  const createRoom = async () => {
    const res = await fetch(BACKEND_URL);
    const data = await res.json();
    navigate(`/room/${data.roomId}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Word Cloud Live</h1>
      <button onClick={createRoom}>Crea nuova stanza</button>
    </div>
  );
}

export default Home;

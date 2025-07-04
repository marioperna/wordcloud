import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const BACKEND_URL = 'https://wordcloud-be.marioperna.com';

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

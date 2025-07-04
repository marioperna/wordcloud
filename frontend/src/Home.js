import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const createRoom = async () => {
    const res = await fetch('https://wordcloud-be.marioperna.com/create-room');
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

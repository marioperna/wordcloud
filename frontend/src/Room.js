import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import WordCloud from 'wordcloud';

const socket = io('https://wordcloud-be.marioperna.com');

function Room() {
  const { roomId } = useParams();
  const [word, setWord] = useState('');
  const [cloud, setCloud] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    socket.emit('join-room', roomId);
    socket.on('update-cloud', (newCloud) => {
      setCloud(newCloud);
    });

    return () => socket.off('update-cloud');
  }, [roomId]);

  useEffect(() => {
    const entries = Object.entries(cloud).map(([text, count]) => [text, count]);
    const canvas = canvasRef.current;
  
    if (canvas && entries.length > 0) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.8;
  
      WordCloud(canvas, {
        list: entries,
        gridSize: 6, // parole più grandi
        weightFactor: (count) => count * 8, // aumenta dimensione in base alla frequenza
        fontFamily: 'Impact',
        color: () => `hsl(${Math.random() * 360}, 100%, 40%)`,
        rotateRatio: 0.4,
        rotationSteps: 2,
        backgroundColor: '#ffffff',
      });
    }
  }, [cloud]);

  const sendWord = () => {
    if (word.trim()) {
      socket.emit('new-word', { roomId, word: word.trim().toLowerCase() });
      setWord('');
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Stanza: {roomId}</h2>
      <input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Inserisci una parola"
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <button onClick={sendWord} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
        Invia
      </button>

      <div style={{ marginTop: '2rem' }}>
        <canvas 
          ref={canvasRef} 
          style={{ width: '800px', height: '600px', display: 'block' }}
        />
      </div>
    </div>
  );
}

export default Room;

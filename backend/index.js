require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { Pool } = require('pg');


// Ensure environment variables are set
if (!process.env.PG_USER || !process.env.PG_HOST || !process.env.PG_DATABASE || !process.env.PG_PASSWORD || !process.env.PG_PORT) {
  console.error('Missing required environment variables for PostgreSQL connection.');
  process.exit(1);
}

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://wordcloud.marioperna.com",
    methods: ["GET", "POST"]
  },
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://wordcloud.marioperna.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get('/create-room', async (req, res) => {
  const roomId = uuidv4();
  res.json({ roomId });
});

io.on('connection', (socket) => {
  socket.on('join-room', async (roomId) => {
    socket.join(roomId);

    const result = await pool.query(
      'SELECT word, count FROM word_counts WHERE room_id = $1',
      [roomId]
    );

    const wordData = {};
    result.rows.forEach(row => {
      wordData[row.word] = row.count;
    });

    socket.emit('update-cloud', wordData);
  });

  socket.on('new-word', async ({ roomId, word }) => {
    try {
      await pool.query(
        `INSERT INTO word_counts (room_id, word, count, ts)
         VALUES ($1, $2, 5, NOW())
         ON CONFLICT (room_id, word)
         DO UPDATE SET count = word_counts.count + 2, ts = NOW()`,
        [roomId, word]
      );

      const result = await pool.query(
        'SELECT word, count FROM word_counts WHERE room_id = $1',
        [roomId]
      );

      const wordData = {};
      result.rows.forEach(row => {
        wordData[row.word] = row.count;
      });

      io.to(roomId).emit('update-cloud', wordData);
    } catch (err) {
      console.error('DB error:', err);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

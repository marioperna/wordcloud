# Usa un'immagine base di Node.js
FROM node:22

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file di dipendenze
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file dell'app
COPY . .

# Espone la porta (assumendo che Express ascolti sulla 3000)
EXPOSE 3000

# Comando per avviare l'app
CMD ["npm", "start"]
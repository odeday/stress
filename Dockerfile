# Gunakan image Node.js ringan berbasis Alpine
FROM node:20-alpine

# Buat direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan (jika ada) package-lock.json
COPY package*.json ./

# Install dependency
RUN npm install

# Salin semua file project ke dalam container
COPY app .

# Jalankan server saat container start
CMD ["npm", "start"]

# Buka port 3000
EXPOSE 3000

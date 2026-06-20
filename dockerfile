# ==========================================
# Stage 1: Builder
# Membangun aplikasi TypeScript dan men-generate Prisma Client
# ==========================================
FROM node:20-alpine AS builder

# Install dependencies sistem yang dibutuhkan
RUN apk add --no-cache openssl

WORKDIR /app

# Copy file dependensi terlebih dahulu
COPY package*.json tsconfig.json prisma.config.ts ./

# Pindahkan COPY prisma ke sini agar schema.prisma tersedia saat postinstall berjalan
COPY prisma ./prisma/

# Install semua dependensi (termasuk devDependencies) yang dibutuhkan untuk build
RUN npm install

# Copy source code
COPY src ./src/

# Generate Prisma Client (jika belum otomatis dari postinstall)
RUN npx prisma generate

# Build aplikasi TypeScript menjadi JavaScript
RUN npm run build

# ==========================================
# Stage 2: Production
# Menyiapkan image final yang SANGAT RINGAN untuk menghindari Error 413 Cloudflare
# ==========================================
FROM node:20-alpine

# Set environment ke production
ENV NODE_ENV=production

WORKDIR /app

# Install openssl yang dibutuhkan oleh Prisma saat runtime
RUN apk add --no-cache openssl

# Copy file dependensi untuk install production packages
COPY package*.json prisma.config.ts ./

# Install HANYA dependensi produksi untuk menjaga ukuran image TETAP KECIL
RUN npm ci --omit=dev --ignore-scripts

# Copy artefak yang diperlukan dari stage 'builder'
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/

# (OPSIONAL TAPI PENTING): Copy juga @prisma/client jika runtime Node.js kamu membutuhkannya
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client/

# Buat folder uploads DAN ubah ownership seluruh isi /app agar menjadi milik user 'node'
# Ini adalah KUNCI untuk memperbaiki error permission Prisma
RUN mkdir -p /app/public/uploads && \
    chown -R node:node /app

# Setelah ownership aman, baru ganti ke user non-root untuk keamanan tambahan
USER node

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan kontainer
CMD ["npm", "run", "start:prod"]
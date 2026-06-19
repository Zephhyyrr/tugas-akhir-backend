# ==========================================
# Stage 1: Builder
# Membangun aplikasi TypeScript dan men-generate Prisma Client
# ==========================================
FROM node:20-alpine AS builder

# Install dependencies sistem yang dibutuhkan
RUN apk add --no-cache openssl

WORKDIR /app

# Copy file dependensi terlebih dahulu
COPY package*.json tsconfig.json ./

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
COPY package*.json ./

# Install HANYA dependensi produksi untuk menjaga ukuran image TETAP KECIL (Ini kunci agar lolos Cloudflare!)
RUN npm ci --omit=dev --ignore-scripts

# Copy artefak yang diperlukan dari stage 'builder'
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/

# Buat folder untuk file upload saat runtime
RUN mkdir -p /app/public/uploads && \
    chown -R node:node /app/public

# Ganti ke user non-root untuk keamanan tambahan
USER node

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan kontainer
CMD ["sh", "-c", "npx --yes prisma migrate deploy && node dist/server.js"]
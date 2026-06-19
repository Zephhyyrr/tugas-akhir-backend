# ==========================================
# Stage 1: Builder
# Membangun aplikasi TypeScript dan men-generate Prisma Client
# ==========================================
FROM node:20-alpine AS builder
LABEL stage="builder"

# Install dependencies sistem yang dibutuhkan
RUN apk add --no-cache openssl

WORKDIR /app

# Copy file dependensi terlebih dahulu untuk caching layer
COPY package*.json tsconfig.json ./

# Install semua dependensi yang dibutuhkan untuk build
RUN npm install

# Copy source code
COPY prisma ./prisma/
COPY src ./src/

# Generate Prisma Client berdasarkan schema.prisma
RUN npx prisma generate

# Build aplikasi TypeScript menjadi JavaScript
RUN npm run build


# ==========================================
# Stage 2: Production
# Menyiapkan image final yang ramping dan aman untuk production
# ==========================================
FROM node:20-alpine

# Set environment ke production
ENV NODE_ENV=production

WORKDIR /app

# Install openssl yang dibutuhkan oleh Prisma saat runtime
RUN apk add --no-cache openssl

# Copy file dependensi untuk install production packages
COPY package*.json ./

# Install HANYA dependensi produksi untuk menjaga ukuran image tetap kecil
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

# Perintah untuk menjalankan kontainer:
# 1. Menjalankan migrasi yang ada
# 2. Menjalankan server aplikasi
CMD ["sh", "-c", "npx --yes prisma migrate deploy && node dist/server.js"]
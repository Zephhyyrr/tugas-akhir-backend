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

# Pindahkan COPY prisma ke sini agar schema.prisma tersedia saat postinstall berjalan
COPY prisma ./prisma/

# Install semua dependensi yang dibutuhkan untuk build
# (Jika ada postinstall 'prisma generate', sekarang tidak akan error)
RUN npm install

# Copy source code
COPY src ./src/

# Generate Prisma Client berdasarkan schema.prisma (opsional jika sudah di-generate via postinstall)
RUN npx prisma generate

# Build aplikasi TypeScript menjadi JavaScript
RUN npm run build
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fotoProfile" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "gambarUrl" TEXT,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeteranganTransaksi" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "KeteranganTransaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL,
    "kredit" DOUBLE PRECISION NOT NULL,
    "debet" DOUBLE PRECISION NOT NULL,
    "uraian" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "keteranganTransaksiId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" SERIAL NOT NULL,
    "prediksiPemasukan" DOUBLE PRECISION NOT NULL,
    "prediksiPengeluaran" DOUBLE PRECISION NOT NULL,
    "tanggalTarget" TIMESTAMP(3) NOT NULL,
    "rmse" DOUBLE PRECISION NOT NULL,
    "wmape" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_keteranganTransaksiId_fkey" FOREIGN KEY ("keteranganTransaksiId") REFERENCES "KeteranganTransaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

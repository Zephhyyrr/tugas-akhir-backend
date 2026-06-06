import os
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables dari file .env di folder Backend
load_dotenv()

# ================= KONFIGURASI =================

# 1. URL Database akan diambil otomatis dari file .env (Prisma)
DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di file .env. Pastikan file .env ada dan berisi DATABASE_URL.")

# 2. Path ke file Excel Kas TPQ - Uang Keluar
#    Ganti nama file berikut sesuai nama file Excel Anda yang sudah ditempatkan di folder Backend
EXCEL_FILE_PATH = r"D:\Laporan Kuliah Semester 8\CODE\Backend\Rekapitulasi_TPQ_Keluar_Clean.xlsx"

# 3. Konfigurasi Default ID
USER_ID = 1               # ID User (Admin) di tabel User
JENIS_KAS_ID = 3          # ID "Kas TPQ" di tabel JenisKas
MEDIA_PEMBAYARAN_ID = 1   # ID Media Pembayaran default (misal "Tunai") di tabel MediaPembayaran

# ===============================================

def import_data():
    if not os.path.exists(EXCEL_FILE_PATH):
        print(f"❌ File excel tidak ditemukan di path: {EXCEL_FILE_PATH}")
        print("   Pastikan nama file benar dan sudah ditempatkan di folder Backend.")
        return

    print(f"📂 Membaca file Excel: {EXCEL_FILE_PATH}...")
    try:
        df = pd.read_excel(EXCEL_FILE_PATH)
    except Exception as e:
        print(f"❌ Gagal membaca file Excel: {e}")
        return

    # Bersihkan nama kolom dari spasi berlebih
    df.columns = df.columns.str.strip().str.upper()
    print(f"   Kolom yang ditemukan: {df.columns.tolist()}")

    print("🔌 Menghubungkan ke database...")
    try:
        conn = psycopg2.connect(DB_URL)
        cursor = conn.cursor()
        print("   Berhasil terhubung ke database.")
    except Exception as e:
        print(f"❌ Gagal terhubung ke database: {e}")
        return

    data_to_insert = []
    skipped = 0

    # Loop setiap baris di Excel
    for index, row in df.iterrows():
        tanggal = row.get('TANGGAL')
        uraian = row.get('URAIAN')

        # Melewati baris yang kosong / tidak valid
        if pd.isna(tanggal) or pd.isna(uraian):
            skipped += 1
            continue

        # Konversi tanggal ke format Python datetime
        try:
            tanggal = pd.to_datetime(tanggal).to_pydatetime()
        except Exception:
            print(f"   ⚠️  Format tanggal tidak valid di baris {index + 2}: '{tanggal}', baris dilewati.")
            skipped += 1
            continue

        # Jenis transaksi untuk skrip ini adalah UANG KELUAR
        tipe_transaksi = 'uang_keluar'

        nominal = 0
        # Mencari nominal dari kolom yang mungkin ada di Excel (fleksibel)
        if 'KREDIT' in df.columns and not pd.isna(row.get('KREDIT')):
            nominal = float(row.get('KREDIT', 0))
        elif 'PENGELUARAN' in df.columns and not pd.isna(row.get('PENGELUARAN')):
            nominal = float(row.get('PENGELUARAN', 0))
        elif 'KELUAR' in df.columns and not pd.isna(row.get('KELUAR')):
            nominal = float(row.get('KELUAR', 0))
        elif 'NOMINAL' in df.columns and not pd.isna(row.get('NOMINAL')):
            nominal = float(row.get('NOMINAL', 0))
        elif 'DEBET' in df.columns and not pd.isna(row.get('DEBET')):
            # Fallback jika angka ada di kolom DEBET walaupun ini pengeluaran
            nominal = float(row.get('DEBET', 0))

        if nominal <= 0:
            skipped += 1
            continue

        # Uang keluar: kredit terisi, debit = 0
        debit_val = 0
        kredit_val = nominal

        current_time = datetime.now()
        data_to_insert.append((
            str(uraian).strip(),   # uraian
            tipe_transaksi,        # tipe
            nominal,               # nominal
            debit_val,             # debit
            kredit_val,            # kredit
            tanggal,               # tanggal
            False,                 # isDeleted
            current_time,          # createdAt
            current_time,          # updatedAt
            USER_ID,               # userId
            JENIS_KAS_ID,          # jenisKasId (3 = Kas TPQ)
            MEDIA_PEMBAYARAN_ID    # mediaPembayaranId
        ))

    if not data_to_insert:
        print(f"⚠️  Tidak ada data pengeluaran valid yang dapat dimasukkan. (Baris dilewati: {skipped})")
        cursor.close()
        conn.close()
        return

    print(f"✅ Ditemukan {len(data_to_insert)} baris transaksi pengeluaran valid.")
    if skipped > 0:
        print(f"   (Dilewati: {skipped} baris karena kosong atau nominal tidak valid)")
    print("📥 Memulai proses insert ke database...")

    insert_query = """
        INSERT INTO "Transaction" (
            uraian, tipe, nominal, debit, kredit, tanggal, "isDeleted", "createdAt", "updatedAt", "userId", "jenisKasId", "mediaPembayaranId"
        ) VALUES %s
    """

    try:
        execute_values(cursor, insert_query, data_to_insert)
        conn.commit()
        print(f"✅ Berhasil! {len(data_to_insert)} data Uang Keluar Kas TPQ dimasukkan ke database.")
    except Exception as e:
        conn.rollback()
        print(f"❌ Terjadi kesalahan saat memasukkan data: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("  IMPORT UANG KELUAR - KAS TPQ (jenisKasId=3)")
    print("=" * 50)
    import_data()

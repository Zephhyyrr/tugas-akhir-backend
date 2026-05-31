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

# 2. Path ke file Excel Anda (Pastikan file excel Anda berada di folder yang sama atau tulis path lengkapnya)
EXCEL_FILE_PATH = r"D:\Laporan Kuliah Semester 8\CODE\Backend\Rekapitulasi_KAS_Uang_Masuk_Clean.xlsx" 

# 3. Konfigurasi Default ID (Berdasarkan relasi tabel di database Prisma Anda)
USER_ID = 1               # ID User (Admin) di tabel User
JENIS_KAS_ID = 1          # ID "Kas Umum" di tabel JenisKas
MEDIA_PEMBAYARAN_ID = 1   # ID Media Pembayaran default (misal "Tunai") di tabel MediaPembayaran

# ===============================================

def import_data():
    if not os.path.exists(EXCEL_FILE_PATH):
        print(f"File excel tidak ditemukan di path: {EXCEL_FILE_PATH}")
        print("Pastikan nama file benar dan ada di folder Backend.")
        return

    print(f"Membaca file Excel: {EXCEL_FILE_PATH}...")
    try:
        df = pd.read_excel(EXCEL_FILE_PATH)
    except Exception as e:
        print(f"Gagal membaca file Excel: {e}")
        return

    # Bersihkan nama kolom dari spasi berlebih
    df.columns = df.columns.str.strip().str.upper()

    print("Menghubungkan ke database...")
    try:
        # psycopg2 dapat membaca format connection string URL dengan baik
        conn = psycopg2.connect(DB_URL)
        cursor = conn.cursor()
    except Exception as e:
        print(f"Gagal terhubung ke database: {e}")
        return

    data_to_insert = []
    
    # Loop setiap baris di Excel
    for index, row in df.iterrows():
        tanggal = row.get('TANGGAL')
        uraian = row.get('URAIAN')
        keterangan = str(row.get('KETERANGAN')).strip().lower()
        
        # Melewati baris yang kosong / tidak valid
        if pd.isna(tanggal) or pd.isna(uraian):
            continue

        # Konversi tanggal otomatis menjadi format native Python datetime
        # (psycopg2 akan otomatis menerjemahkannya ke format PostgreSQL yang benar)
        try:
            tanggal = pd.to_datetime(tanggal).to_pydatetime()
        except Exception:
            print(f"Format tanggal tidak valid: {tanggal}, melewati baris ini.")
            continue
            
        # Karena ini file khusus UANG MASUK, tipenya pasti uang_masuk
        tipe_transaksi = 'uang_masuk'

        nominal = 0
        # Mencari nominal uang masuk dari kolom DEBET atau NOMINAL
        if 'DEBET' in df.columns and not pd.isna(row.get('DEBET')):
            nominal = float(row.get('DEBET', 0))
        elif 'NOMINAL' in df.columns and not pd.isna(row.get('NOMINAL')):
            nominal = float(row.get('NOMINAL', 0))

        if nominal <= 0:
            continue

        # LOGIKA PASTI UANG MASUK:
        # Debit diisi angkanya, Kredit diisi 0
        debit_val = nominal
        kredit_val = 0

        current_time = datetime.now()
        data_to_insert.append((
            str(uraian),           # uraian
            tipe_transaksi,        # tipe
            nominal,               # nominal
            debit_val,             # debit
            kredit_val,            # kredit
            tanggal,               # tanggal
            False,                 # isDeleted
            current_time,          # createdAt
            current_time,          # updatedAt
            USER_ID,               # userId
            JENIS_KAS_ID,          # jenisKasId
            MEDIA_PEMBAYARAN_ID    # mediaPembayaranId
        ))

    if not data_to_insert:
        print("Tidak ada data valid yang dapat dimasukkan.")
        return

    print(f"Ditemukan {len(data_to_insert)} baris transaksi valid. Memulai proses insert ke database...")

    insert_query = """
        INSERT INTO "Transaction" (
            uraian, tipe, nominal, debit, kredit, tanggal, "isDeleted", "createdAt", "updatedAt", "userId", "jenisKasId", "mediaPembayaranId"
        ) VALUES %s
    """

    try:
        execute_values(cursor, insert_query, data_to_insert)
        conn.commit()
        print("✅ Data berhasil dimasukkan ke database!")
    except Exception as e:
        conn.rollback()
        print(f"❌ Terjadi kesalahan saat memasukkan data: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    import_data()

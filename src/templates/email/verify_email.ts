export function verifyEmailTemplate(nama: string, verifyUrl: string): string {
    return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verifikasi Email - Aplikasi Donasi Masjid</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    /* Mengubah tema menjadi gradien hijau islami */
                    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
                    padding: 40px 20px;
                    text-align: center;
                    color: white;
                }
                .header h1 {
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                .header p {
                    font-size: 15px;
                    opacity: 0.95;
                }
                .content {
                    padding: 40px 30px;
                }
                .greeting {
                    font-size: 18px;
                    color: #333;
                    margin-bottom: 20px;
                    font-weight: 500;
                }
                .message {
                    font-size: 15px;
                    color: #555;
                    line-height: 1.8;
                    margin-bottom: 30px;
                }
                .cta-container {
                    text-align: center;
                    margin: 30px 0;
                }
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
                    color: white;
                    padding: 14px 40px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 16px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
                }
                .cta-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
                }
                .alternative {
                    margin-top: 25px;
                    padding-top: 25px;
                    border-top: 1px solid #eee;
                    text-align: center;
                }
                .alternative-text {
                    font-size: 13px;
                    color: #888;
                    margin-bottom: 10px;
                }
                .alternative-link {
                    display: inline-block;
                    font-size: 12px;
                    color: #10b981;
                    text-decoration: none;
                    word-break: break-all;
                    font-family: monospace;
                    padding: 10px;
                    background: #f0fdf4; /* Latar belakang hijau sangat muda */
                    border-radius: 4px;
                    max-width: 100%;
                    border: 1px solid #bbf7d0;
                }
                .footer {
                    background: #f9f9f9;
                    padding: 20px 30px;
                    border-top: 1px solid #eee;
                    text-align: center;
                    font-size: 12px;
                    color: #888;
                }
                .footer p {
                    margin: 5px 0;
                    line-height: 1.6;
                }
                .warning {
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 12px 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🕌 Verifikasi Akun</h1>
                    <p>Pendaftaran Donatur Masjid</p>
                </div>

                <div class="content">
                    <div class="greeting">Assalamu'alaikum, <strong>${nama}</strong>.</div>
                    
                    <p class="message">
                        Jazakumullah khairan telah mendaftar. Untuk mulai menyalurkan niat baik Anda dan menyelesaikan proses pendaftaran, 
                        silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda.
                    </p>

                    <div class="cta-container">
                        <a href="${verifyUrl}" class="cta-button">Verifikasi Email Saya</a>
                    </div>

                    <div class="alternative">
                        <p class="alternative-text">Atau salin tautan di bawah ini ke browser Anda:</p>
                        <a href="${verifyUrl}" class="alternative-link">${verifyUrl}</a>
                    </div>

                    <div class="warning">
                        <strong>⏰ Perhatian:</strong> Tautan verifikasi ini akan berlaku selama 24 jam. 
                        Jika tautan sudah kadaluarsa, silakan lakukan pendaftaran ulang.
                    </div>
                </div>

                <div class="footer">
                    <p>Jika Anda merasa tidak melakukan pendaftaran ini, mohon abaikan email ini.</p>
                    <p>&copy; 2026 Aplikasi Donasi Masjid. Semoga menjadi amal jariyah.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
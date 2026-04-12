export function resetPasswordTemplate(nama: string, resetUrl: string): string {
    return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password - Aplikasi Donasi Masjid</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
                    background: #f0fdf4;
                    border-radius: 4px;
                    max-width: 100%;
                    border: 1px solid #bbf7d0;
                }
                .security-note {
                    background: #e7f3ff;
                    border-left: 4px solid #2196F3;
                    padding: 12px 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #0c5aa0;
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
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Reset Kata Sandi</h1>
                    <p>Perbarui kata sandi akun Donatur Anda</p>
                </div>

                <div class="content">
                    <div class="greeting">Assalamu'alaikum, <strong>${nama}</strong>.</div>
                    
                    <p class="message">
                        Kami menerima permintaan untuk mengatur ulang kata sandi akun donasi Anda. 
                        Silakan klik tombol di bawah ini untuk membuat kata sandi baru.
                    </p>

                    <div class="cta-container">
                        <a href="${resetUrl}" class="cta-button">Reset Kata Sandi Saya</a>
                    </div>

                    <div class="alternative">
                        <p class="alternative-text">Atau salin tautan di bawah ini ke browser Anda:</p>
                        <a href="${resetUrl}" class="alternative-link">${resetUrl}</a>
                    </div>

                    <div class="security-note">
                        <strong>ℹ️ Info Keamanan:</strong> Tautan reset kata sandi ini hanya berlaku selama 1 jam dan hanya dapat digunakan satu kali. 
                        Mohon tidak membagikan tautan ini kepada siapa pun demi keamanan akun Anda.
                    </div>

                    <div class="warning">
                        <strong>⚠️ Jika Anda tidak meminta reset kata sandi:</strong> Mohon abaikan email ini. 
                        Akun Anda tetap aman. Jika Anda merasa ada aktivitas mencurigakan, segera hubungi tim bantuan kami.
                    </div>
                </div>

                <div class="footer">
                    <p>&copy; 2026 Aplikasi Donasi Masjid. Semoga menjadi amal jariyah.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
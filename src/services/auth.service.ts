import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { verifyHash, hashing } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { transporter } from "../config/mail";
import { resetPasswordTemplate } from "../templates/email/reset_password";

export async function loginService(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new AppError("Email atau password salah.");
    }

    if (!user.isVerified) {
        throw new AppError("Email belum diverifikasi. Cek inbox email Anda.");
    }

    const isPasswordMatch = await verifyHash(password, user.password);
    if (!isPasswordMatch) {
        throw new AppError("Email atau password salah.");
    }

    const token = await generateToken({ 
        id: user.id, 
        email: user.email,
        role: user.role,
        nama: user.nama
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token
    };
}

export async function logoutService() {
    return {
        message: "Logout berhasil."
    };
}
export async function verifyEmailService(token: string) {
    const userToken = await prisma.userToken.findUnique({
        where: { token }
    });

    if (!userToken || new Date() > userToken.expiresAt) {
        throw new AppError("Token tidak valid atau sudah kedaluwarsa.");
    }

    const user = await prisma.user.findUnique({
        where: { id: userToken.userId }
    });

    if (!user) {
        throw new AppError("User tidak ditemukan.");
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            userToken: {
                deleteMany: {}
            }
        }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
}

export async function forgotPasswordService(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new AppError("Email tidak terdaftar.");
    }

    const token = await generateToken({ id: user.id, email: user.email });

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.userToken.create({
        data: {
            userId: user.id,
            token: token,
            expiresAt: expiresAt
        }
    });

    try {
        await sendResetPasswordEmail(user.email, user.nama, token);
    } catch (error) {
        console.error("Error sending reset password email:", error);
    }

    return {
        message: "Link reset password telah dikirim ke email Anda."
    };
}

export async function resetPasswordService(token: string, newPassword: string) {
    const userToken = await prisma.userToken.findUnique({
        where: { token }
    });

    if (!userToken || new Date() > userToken.expiresAt) {
        throw new AppError("Token tidak valid atau sudah kedaluwarsa.");
    }

    const user = await prisma.user.findUnique({
        where: { id: userToken.userId }
    });

    if (!user) {
        throw new AppError("User tidak ditemukan.");
    }

    const hashedPassword = await hashing(newPassword);
    if (!hashedPassword) {
        throw new AppError("Terjadi kesalahan saat memproses password.");
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            userToken: {
                deleteMany: {}
            }
        }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return {
        message: "Password berhasil direset. Silakan login dengan password baru.",
        user: userWithoutPassword
    };
}

const sendResetPasswordEmail = async (email: string, nama: string, token: string) => {
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/reset-password?token=${token}`;
    const htmlContent = resetPasswordTemplate(nama, resetUrl);
    const mailOptions = {
        from: `"Aplikasi Saya" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Reset Password - Aplikasi Saya",
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};
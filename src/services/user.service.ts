import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { RoleUser } from "@prisma/client";
import { getPagination, getPagingData } from "../utils/pagination";
import { hashing } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { transporter } from "../config/mail";
import { verifyEmailTemplate } from "../templates/email/verify_email";
export async function getAllUserService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const users = await prisma.user.findMany({
        skip,
        take,
        where: { isDeleted: false }
    });

    const totalItems = await prisma.user.count({
        where: { isDeleted: false }
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: users,
        meta: meta
    };
}

export async function createUserService(
    email: string,
    nama: string,
    password: string,
    role: RoleUser,
    fotoProfile?: string
) {
    const existingUser = await existsEmail(email);
    if (existingUser) {
        throw new AppError("Email sudah digunakan.");
    }

    const hashedPassword = await hashing(password);
    if (!hashedPassword) {
        throw new AppError("Terjadi kesalahan saat memproses password.");
    }

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email,
                nama,
                password: hashedPassword,
                role,
                fotoProfile
            }
        });

        const token = await generateToken({ 
            id: user.id, 
            email: user.email,
            role: user.role,
            nama: user.nama
        });

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await tx.userToken.create({
            data: {
                userId: user.id,
                token: token,
                expiresAt: expiresAt
            }
        });

        return { user, token };
    });

    try {
        await sendVerificationEmail(result.user.email, result.user.nama, result.token);
    } catch (error) {
        console.error(error);
    }

    const { password: _, ...userWithoutPassword } = result.user;
    return userWithoutPassword;
}

export async function updateUserService(
    id: number,
    email: string,
    nama: string,
    role: string,
    password?: string
) {
    const parsedRole = role as RoleUser;

    if (!Object.values(RoleUser).includes(parsedRole)) {
        throw new Error("Role tidak valid.");
    }

    const data: {
        email: string;
        nama: string;
        role: RoleUser;
        password?: string;
    } = {
        email,
        nama,
        role: parsedRole,
    };

    if (password) {
        const hashedPassword = await hashing(password);
        if (hashedPassword) {
            data.password = hashedPassword;
        }
    }

    const updated = await prisma.user.update({
        where: { id },
        data,
    });

    return updated;
}

export async function deleteUserService(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
        throw new AppError(`User dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !user.isDeleted;
    
    const result = await prisma.user.update({
        where: { id },
        data: { isDeleted: newDeletedStatus }
    });

    if (!newDeletedStatus) {
        const token = await generateToken({ 
            id: user.id, 
            email: user.email,
            role: user.role,
            nama: user.nama
        });
        
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await prisma.userToken.deleteMany({ where: { userId: id } });
        
        await prisma.userToken.create({
            data: {
                userId: user.id,
                token: token,
                expiresAt: expiresAt
            }
        });

        try {
            await sendVerificationEmail(result.email, result.nama, token);
        } catch (error) {
            // Log error jika pengiriman email gagal
        }
    }

    return {
        user: result,
        action: newDeletedStatus ? 'delete' : 'undelete'
    };
}

const findUserById = async (id: number) => {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user || user.isDeleted) throw new AppError(`User dengan id: ${id}, tidak tersedia.`)

    return user
}

export async function updatePhotoProfileService(params: { id: number; fotoProfile: string }) {
    const { id, fotoProfile } = params;
    await findUserById(id);
    const updated = await prisma.user.update({
        where: { id },
        data: { fotoProfile }
    });
    return updated;
}

const sendVerificationEmail = async (email: string, nama: string, token: string) => {
    const verifyUrl = `${process.env.PORT || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
    const htmlContent = verifyEmailTemplate(nama, verifyUrl);
    const mailOptions = {
        from: `"Aplikasi Saya" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verifikasi Email - Aplikasi Saya",
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};

export async function existsEmail(email: string, ignoreId?: number) {
    const whereClause: any = { email }

    if (ignoreId) { whereClause.id = { not: ignoreId } }

    const existtingEmail = await prisma.user.findFirst({
        where: whereClause
    })

    return existtingEmail
}

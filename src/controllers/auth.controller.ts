import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import { loginService, logoutService, verifyEmailService, forgotPasswordService, resetPasswordService } from "../services/auth.service";
import { getUserByIdService } from "../services/user.service";
import { handlerAnyError } from "../errors/api_errors";

export async function loginController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 hari
        };

        res.cookie('token', result.token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Berhasil login.",
            data: {
                user: result.user,
                token: result.token
            }
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function logoutController(req: Request, res: Response<ResponseApiType>) {
    try {
        const result = await logoutService();
        const isSecure = process.env.FRONTEND_URL?.startsWith("https");

        res.clearCookie("token", {
            httpOnly: true,
            secure: isSecure,
            sameSite: isSecure ? "none" : "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function meController(req: Request, res: Response<ResponseApiType>) {
    try {
        res.set("Cache-Control", "no-store");

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Token dibutuhkan."
            });
        }

        const user = await getUserByIdService(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User tidak ditemukan."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan data user login.",
            data: user
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function verifyEmailController(req: Request, res: Response) {
    try {
        const { token } = req.query;
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";

        if (!token || typeof token !== "string") {
            return res.redirect(`${frontendUrl}/auth/login?verify=invalid&message=Token+tidak+ditemukan`);
        }

        try {
            const user = await verifyEmailService(token);
            
            return res.redirect(`${frontendUrl}/auth/login?verify=success&email=${encodeURIComponent(user.email)}`);

        } catch (serviceError: any) {
            throw serviceError;
        }

    } catch (error: any) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
        const errorMsg = error.message || "Gagal memverifikasi email.";
        
        console.error("[Verify Email Error]", {
            error: errorMsg
        });

        let verifyStatus = "failed";
        if (errorMsg.includes("kedaluwarsa")) {
            verifyStatus = "expired";
        } else if (errorMsg.includes("tidak valid")) {
            verifyStatus = "invalid";
        }

        return res.redirect(`${frontendUrl}/auth/login?verify=${verifyStatus}&message=${encodeURIComponent(errorMsg)}`);
    }
}

export async function forgotPasswordController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { email } = req.body;

        const result = await forgotPasswordService(email);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function resetPasswordController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { token } = req.body;
        const { newPassword } = req.body;

        if (!token || typeof token !== "string") {
            return res.status(400).json({
                success: false,
                message: "Token tidak ditemukan."
            });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password minimal 6 karakter."
            });
        }

        const result = await resetPasswordService(token, newPassword);

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.user
        });

    } catch (error: any) {
        const errorMsg = error.message || "Gagal mereset password.";

        console.error("[Reset Password Error]", {
            error: errorMsg
        });

        return res.status(400).json({
            success: false,
            message: errorMsg
        });
    }
}

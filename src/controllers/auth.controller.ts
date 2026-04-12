import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import { loginService, verifyEmailService, forgotPasswordService, resetPasswordService } from "../services/auth.service";
import { handlerAnyError } from "../errors/api_errors";

export async function loginController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 hari
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

export async function verifyEmailController(req: Request, res: Response) {
    try {
        const { token } = req.query;
        const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("0.0");

        if (!token || typeof token !== "string") {
            if (isLocalhost) {
                return res.status(400).json({
                    success: false,
                    message: "Token verifikasi tidak ditemukan."
                });
            }
            
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
            return res.redirect(`${frontendUrl}/verify-error?message=Token+tidak+ditemukan`);
        }

        try {
            const user = await verifyEmailService(token);

            if (isLocalhost) {
                return res.status(200).json({
                    success: true,
                    message: "Email berhasil diverifikasi!",
                    data: user
                });
            }

            const frontendLoginUrl = process.env.FRONTEND_URL
                ? `${process.env.FRONTEND_URL}/login?verified=true`
                : "http://localhost:3001/login?verified=true";

            return res.redirect(frontendLoginUrl);

        } catch (serviceError: any) {
            throw serviceError;
        }

    } catch (error: any) {
        const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("0.0");
        const errorMsg = error.message || "Gagal memverifikasi email.";
        
        console.error("[Verify Email Error]", {
            hostname: req.hostname,
            isLocalhost,
            error: errorMsg
        });
        
        if (isLocalhost) {
            return res.status(400).json({
                success: false,
                message: errorMsg
            });
        }

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
        const errorMessage = encodeURIComponent(errorMsg);
        return res.redirect(`${frontendUrl}/verify-error?message=${errorMessage}`);
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
        const { token } = req.query;
        const { newPassword } = req.body;
        const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("0.0");

        if (!token || typeof token !== "string") {
            if (isLocalhost) {
                return res.status(400).json({
                    success: false,
                    message: "Token tidak ditemukan."
                });
            }

            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
            return res.redirect(`${frontendUrl}/reset-error?message=Token+tidak+ditemukan`);
        }

        if (!newPassword || newPassword.length < 6) {
            if (isLocalhost) {
                return res.status(400).json({
                    success: false,
                    message: "Password minimal 6 karakter."
                });
            }

            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
            return res.redirect(`${frontendUrl}/reset-error?message=Password+minimal+6+karakter`);
        }

        const result = await resetPasswordService(token, newPassword);

        if (isLocalhost) {
            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.user
            });
        }

        const frontendLoginUrl = process.env.FRONTEND_URL
            ? `${process.env.FRONTEND_URL}/login?reset=success`
            : "http://localhost:3001/login?reset=success";

        return res.redirect(frontendLoginUrl);

    } catch (error: any) {
        const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || req.hostname.startsWith("0.0");
        const errorMsg = error.message || "Gagal mereset password.";

        console.error("[Reset Password Error]", {
            hostname: req.hostname,
            isLocalhost,
            error: errorMsg
        });

        if (isLocalhost) {
            return res.status(400).json({
                success: false,
                message: errorMsg
            });
        }

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
        const errorMessage = encodeURIComponent(errorMsg);
        return res.redirect(`${frontendUrl}/reset-error?message=${errorMessage}`);
    }
}
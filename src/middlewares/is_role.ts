import { $Enums } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";

declare global {
    namespace Express {
        interface Request {
            user?: { id: number, nama: string, email: string, role: $Enums.RoleUser, [key: string]: any }
        }
    }
}

export function isRole(allowedRoles: $Enums.RoleUser[]) {
    return (req: Request, res: Response<ResponseApiType>, next: NextFunction) => {
        const user = req.user
        if (!allowedRoles.includes(user?.role!)) {
            return res.status(403).json({
                success: false,
                message: "Akses ditolak"
            })
        }
        next()
    }
}

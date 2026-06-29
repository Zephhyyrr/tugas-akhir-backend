import * as cron from 'node-cron';
import prisma from './prisma';
import fs from 'fs/promises';
import path from 'path';

export const initCronJobs = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const thirtyDaysAgo = new Date();
            // set jika besar 30 hari
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const expiredContents = await prisma.content.findMany({
                where: {
                    isDeleted: true,
                    updatedAt: {
                        lt: thirtyDaysAgo
                    }
                }
            });

            if (expiredContents.length > 0) {
                const idsToDelete = expiredContents.map((c: any) => c.id);

                // Hapus file fisik gambar dan video dari server
                const uploadDir = path.join(process.cwd(), 'public/uploads');

                for (const content of expiredContents as any[]) {
                    const filesToDelete: string[] = [];
                    
                    if (Array.isArray(content.gambarUrl)) {
                        content.gambarUrl.forEach((url: string) => {
                            if (url) filesToDelete.push(path.basename(url));
                        });
                    }
                    if (content.videoUrl) {
                        filesToDelete.push(path.basename(content.videoUrl));
                    }

                    for (const filename of filesToDelete) {
                        if (!filename) continue;
                        const filePath = path.join(uploadDir, filename);
                        try {
                            await fs.unlink(filePath);
                        } catch (err: any) {
                            // Abaikan jika file sudah tidak ada atau error izin
                        }
                    }
                }

                await prisma.content.deleteMany({
                    where: {
                        id: {
                            in: idsToDelete
                        }
                    }
                });
            }

        } catch (error) {
            // Silently fail, avoiding log clutter
        }
    });
};

import * as cron from 'node-cron';
import prisma from './prisma';

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

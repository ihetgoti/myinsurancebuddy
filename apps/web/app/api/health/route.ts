import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        const health = {
            status: "ok",
            timestamp: new Date().toISOString(),
            services: {
                database: "up",
                app: "up",
            },
        };

        return NextResponse.json(health);
    } catch (error) {
        const health = {
            status: "error",
            timestamp: new Date().toISOString(),
            services: {
                database: "down",
                app: "up",
            },
            error: error instanceof Error ? error.message : "Unknown error",
        };

        return NextResponse.json(health, { status: 503 });
    }
}

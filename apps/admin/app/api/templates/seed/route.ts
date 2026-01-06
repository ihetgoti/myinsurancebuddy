
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedAdvancedTemplates } from '@/lib/seed-templates';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        await seedAdvancedTemplates(prisma);
        return NextResponse.json({ success: true, message: 'Advanced templates seeded successfully' });
    } catch (error: any) {
        console.error('Failed to seed templates:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await seedAdvancedTemplates(prisma);
        return NextResponse.json({ success: true, message: 'Advanced templates seeded successfully' });
    } catch (error: any) {
        console.error('Failed to seed templates:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

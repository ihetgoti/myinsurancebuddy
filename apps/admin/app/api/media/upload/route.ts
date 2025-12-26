import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';



// POST /api/media/upload - Upload media file
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Get file details
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'bin';
        const uniqueName = `${randomUUID()}.${ext}`;

        // Determine file type
        const mimeType = file.type;
        let fileType = 'OTHER';
        if (mimeType.startsWith('image/')) fileType = 'IMAGE';
        else if (mimeType.startsWith('video/')) fileType = 'VIDEO';
        else if (mimeType.includes('pdf') || mimeType.includes('document')) fileType = 'DOCUMENT';

        // Create upload directory
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Save file
        const filePath = join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);

        // Create database record
        const media = await prisma.media.create({
            data: {
                filename: file.name,
                path: `/uploads/${uniqueName}`,
                sizeBytes: buffer.length,
                altText: file.name.replace(/\.[^/.]+$/, ''),
                uploadedBy: session.user.id,
            },
        });

        return NextResponse.json(media, { status: 201 });
    } catch (error) {
        console.error('POST /api/media/upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.formData();
    const files = data.getAll('files') as unknown as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const urls = [];
    
    for (const file of files) {
      // Get the original extension
      const extension = file.name.split('.').pop() || 'bin';
      
      // Prevent uploading potentially dangerous files
      if (['exe', 'sh', 'bat', 'cmd'].includes(extension.toLowerCase())) {
        continue;
      }
      
      // Upload directly to Vercel Blob Storage
      const blob = await put(file.name, file, {
        access: 'public',
      });
      
      urls.push(blob.url);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contentType = request.headers.get('content-type');
    let data: any;
    let photoPath = '';
    const { id } = params;
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('photo') as File;
      
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name}`;
        const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
        
        await writeFile(filepath, buffer);
        photoPath = `/uploads/${filename}`;
      }
      
      data = {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        description: formData.get('description') as string,
        photo: photoPath
      };
    } else {
      // Handle JSON data
      data = await request.json();
    }
    
    await db.run(
      `UPDATE landing SET title = ?, subtitle = ?, description = ?, photo = ?
       WHERE id = ?`,
      [data.title, data.subtitle, data.description, data.photo, id]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error updating landing:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await db.run('DELETE FROM landing WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting landing:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

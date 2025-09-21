import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contentType = request.headers.get('content-type');
    let data: any;
    let photoUrl = '';
    const { id } = params;

    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('photo') as File;
      
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create unique filename
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
        
        // Save file
        await writeFile(filepath, buffer);
        photoUrl = `/uploads/${filename}`;
      }
      
      data = {
        author: formData.get('author') as string,
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        post: formData.get('post') as string,
        photo: photoUrl,
        visible: formData.get('visible') === 'true',
        movie: formData.get('movie') === 'true'
      };
    } else {
      // Handle JSON data
      data = await request.json();
    }
    
    await db.run(
      `UPDATE news SET author = ?, title = ?, subtitle = ?, post = ?, photo = ?, visible = ?, movie = ?
       WHERE id = ?`,
      [data.author, data.title, data.subtitle, data.post, data.photo, data.visible, data.movie, id]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await db.run('DELETE FROM news WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

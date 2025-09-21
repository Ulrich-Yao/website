import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const news = await db.query('SELECT * FROM news ORDER BY add_date DESC');
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let data: any;
    let photoUrl = '';

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
    
    const id = uuidv4();
    
    await db.run(
      `INSERT INTO news (id, author, title, subtitle, post, photo, visible, movie)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.author, data.title, data.subtitle, data.post, data.photo, data.visible, data.movie]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

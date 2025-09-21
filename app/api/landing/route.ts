import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const landings = await db.query('SELECT * FROM landing ORDER BY title ASC');
    return NextResponse.json(landings);
  } catch (error) {
    console.error('Error fetching landings:', error); 
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let data: any;
    let photoPath = '';
    
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
    
    const id = uuidv4();
    
    await db.run(
      `INSERT INTO landing (id, title, subtitle, description, photo)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.title, data.subtitle, data.description, data.photo]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error creating landing:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

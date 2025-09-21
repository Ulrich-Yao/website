import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database'; 
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
    return NextResponse.json(categories); 
  } catch (error) {
    console.error('Error fetching categories:', error); 
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, photo } = body;

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
    }

    const id = uuidv4();
    await db.run(
      'INSERT INTO categories (id, name, photo) VALUES (?, ?, ?)',
      [id, name, photo || '']
    );

    const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', [id]);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await db.get('SELECT * FROM categories WHERE id = ?', [params.id]);
    
    if (!category) {
      return NextResponse.json({ error: 'Catégorie non trouvée' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, photo } = body;

    if (!name) {
      return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 });
    }

    await db.run(
      'UPDATE categories SET name = ?, photo = ? WHERE id = ?',
      [name, photo || '', params.id]
    );

    const updatedCategory = await db.get('SELECT * FROM categories WHERE id = ?', [params.id]);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.run('DELETE FROM categories WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Catégorie supprimée' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

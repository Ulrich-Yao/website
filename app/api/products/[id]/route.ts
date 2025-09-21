import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [params.id]);
    
    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    
    await db.run(
      `UPDATE products SET 
       name = ?, description = ?, prix = ?, prix_tva = ?, 
       categorie = ?, photo = ?, principales_caracteristiques = ?, disponible = ?
       WHERE id = ?`,
      [data.name, data.description, data.prix, data.prix_tva, data.categorie, data.photo, data.principales_caracteristiques, data.disponible, params.id]
    );

    return NextResponse.json({ id: params.id, ...data });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.run('DELETE FROM products WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

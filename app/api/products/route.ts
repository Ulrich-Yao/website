import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database'; 
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const products = await db.query('SELECT * FROM products ORDER BY name ASC');
    return NextResponse.json(products); 
  } catch (error) {
    console.error('Error fetching products:', error); 
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = uuidv4();
    
    await db.run(
      `INSERT INTO products (id, name, description, prix, prix_tva, categorie, photo, principales_caracteristiques, disponible)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.description, data.prix, data.prix_tva, data.categorie, data.photo, data.principales_caracteristiques, data.disponible]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

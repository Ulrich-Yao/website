import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const transactions = await db.query('SELECT * FROM transactions ORDER BY add_date DESC');
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = uuidv4();
    
    await db.run(
      `INSERT INTO transactions (id, user, piece, status, montant, transaction_type, profil, reseau)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.user, data.piece, data.status, data.montant, data.transaction_type, data.profil, data.reseau]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

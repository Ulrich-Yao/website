import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { id } = params;
    
    await db.run(
      `UPDATE transactions SET user = ?, piece = ?, status = ?, montant = ?, transaction_type = ?, profil = ?, reseau = ?
       WHERE id = ?`,
      [data.user, data.piece, data.status, data.montant, data.transaction_type, data.profil, data.reseau, id]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

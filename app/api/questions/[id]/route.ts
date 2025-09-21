import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { id } = params;
    
    await db.run(
      `UPDATE questions SET question = ?, propo_une = ?, propo_deux = ?, propo_trois = ?, propo_quatre = ?, propo_cinq = ?, response = ?
       WHERE id = ?`,
      [data.question, data.propo_une, data.propo_deux, data.propo_trois, data.propo_quatre, data.propo_cinq, data.response, id]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await db.run('DELETE FROM questions WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

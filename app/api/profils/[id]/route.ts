import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { id } = params;
    
    await db.run(
      `UPDATE profils SET name = ?, photo = ?, description = ?, color = ?, time = ?, additionale = ?, can_win = ?, ordre = ?, active = ?
       WHERE id = ?`,
      [data.name, data.photo, data.description, data.color, data.time, data.additionale, data.can_win, data.ordre, data.active, id]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error updating profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await db.run('DELETE FROM profils WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const profils = await db.query('SELECT * FROM profils ORDER BY ordre ASC');
    return NextResponse.json(profils);
  } catch (error) {
    console.error('Error fetching profils:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = uuidv4();
    
    await db.run(
      `INSERT INTO profils (id, name, photo, description, color, time, additionale, can_win, ordre, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.photo, data.description, data.color, data.time, data.additionale, data.can_win, data.ordre, data.active]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error creating profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const questions = await db.query('SELECT * FROM questions ORDER BY question ASC');
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = uuidv4();
    
    await db.run(
      `INSERT INTO questions (id, question, propo_une, propo_deux, propo_trois, propo_quatre, propo_cinq, response)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, data.question, data.propo_une, data.propo_deux, data.propo_trois, data.propo_quatre, data.propo_cinq, data.response]
    );

    return NextResponse.json({ id, ...data });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  const dateStr = request.nextUrl.searchParams.get('date_str');
  const userId = request.nextUrl.searchParams.get('user_id');

  if (!dateStr || !userId) {
    return NextResponse.json({ error: 'date_str and user_id are required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('date_str', dateStr)
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Decrypt text field for each activity
  const decryptedData = (data || []).map((item) => ({
    ...item,
    text: decrypt(item.text),
  }));

  return NextResponse.json({ data: decryptedData });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date_str, text } = body;

  if (!date_str || !text) {
    return NextResponse.json({ error: 'date_str and text are required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encryptedText = encrypt(text);

  const { data, error } = await supabase
    .from('activities')
    .insert({ user_id: user.id, date_str, text: encryptedText, done: false })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return with decrypted text for UI
  return NextResponse.json({ data: { ...data, text } });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, done } = body;

  if (!id || done === undefined) {
    return NextResponse.json({ error: 'id and done are required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('activities')
    .update({ done })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

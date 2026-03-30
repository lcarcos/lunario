import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { encrypt, decrypt } from '@/lib/crypto';

export async function GET(request: NextRequest) {
  const phaseId = request.nextUrl.searchParams.get('phase_id');
  if (!phaseId) {
    return NextResponse.json({ error: 'phase_id is required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('intentions')
    .select('value')
    .eq('phase_id', phaseId)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const value = data ? decrypt(data.value) : '';
  return NextResponse.json({ value });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { phase_id, value } = body;

  if (!phase_id || value === undefined) {
    return NextResponse.json({ error: 'phase_id and value are required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const encryptedValue = encrypt(value);

  const { error } = await supabase
    .from('intentions')
    .upsert(
      { user_id: user.id, phase_id, value: encryptedValue },
      { onConflict: 'user_id, phase_id' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

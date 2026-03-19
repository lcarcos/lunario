import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Se o paramédro 'next' existir, usamos como rota de redirecionamento final.
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host'); // host original antes de balanceadores de carga
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        // Redirecionamento seguro para localhost
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // Redirecionamento seguro em produção (hospedado no Vercel/etc)
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Redireciona de volta em caso de erro
  return NextResponse.redirect(`${origin}/login?error=No+se+pudo+completar+el+login+con+OAuth`);
}

/**
 * Migration script: Encrypt existing plain-text records in Supabase.
 *
 * Run once with:
 *   npx tsx --env-file=.env.local scripts/migrate-encrypt.ts
 *
 * Requires ENCRYPTION_SECRET, NEXT_PUBLIC_SUPABASE_URL, and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY for
 * bypassing RLS) in .env.local.
 */
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ── Encryption helpers (same logic as src/lib/crypto.ts) ──────
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET;
  if (!secret) throw new Error('ENCRYPTION_SECRET is not set');
  return Buffer.from(secret, 'hex');
}

function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

function isAlreadyEncrypted(value: string): boolean {
  const parts = value.split(':');
  if (parts.length !== 3) return false;
  // Check if all three parts are valid hex strings
  return parts.every((p) => /^[0-9a-f]+$/i.test(p));
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // ── Migrate intentions ────────────────────────────────────
  console.log('\n🔐 Migrating intentions...');
  const { data: intentions, error: intErr } = await supabase
    .from('intentions')
    .select('id, value');

  if (intErr) {
    console.error('  ❌ Error fetching intentions:', intErr.message);
  } else if (intentions && intentions.length > 0) {
    let migrated = 0;
    let skipped = 0;
    for (const row of intentions) {
      if (isAlreadyEncrypted(row.value)) {
        skipped++;
        continue;
      }
      const encrypted = encrypt(row.value);
      const { error } = await supabase
        .from('intentions')
        .update({ value: encrypted })
        .eq('id', row.id);
      if (error) {
        console.error(`  ❌ Failed to encrypt intention ${row.id}:`, error.message);
      } else {
        migrated++;
      }
    }
    console.log(`  ✅ ${migrated} encrypted, ${skipped} already encrypted, ${intentions.length} total`);
  } else {
    console.log('  ℹ️  No intentions found');
  }

  // ── Migrate activities ────────────────────────────────────
  console.log('\n🔐 Migrating activities...');
  const { data: activities, error: actErr } = await supabase
    .from('activities')
    .select('id, text');

  if (actErr) {
    console.error('  ❌ Error fetching activities:', actErr.message);
  } else if (activities && activities.length > 0) {
    let migrated = 0;
    let skipped = 0;
    for (const row of activities) {
      if (isAlreadyEncrypted(row.text)) {
        skipped++;
        continue;
      }
      const encrypted = encrypt(row.text);
      const { error } = await supabase
        .from('activities')
        .update({ text: encrypted })
        .eq('id', row.id);
      if (error) {
        console.error(`  ❌ Failed to encrypt activity ${row.id}:`, error.message);
      } else {
        migrated++;
      }
    }
    console.log(`  ✅ ${migrated} encrypted, ${skipped} already encrypted, ${activities.length} total`);
  } else {
    console.log('  ℹ️  No activities found');
  }

  console.log('\n🎉 Migration complete!\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

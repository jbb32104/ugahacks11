import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/utils/supabase/admin";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { createHmac } from "crypto";

const SIGN_MESSAGE = "Sign in to Squirt Car";

function derivePassword(publicKey: string): string {
  const secret = process.env.WALLET_AUTH_SECRET!;
  return createHmac("sha256", secret).update(publicKey).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { publicKey, signature } = await request.json();

    if (!publicKey || !signature) {
      return NextResponse.json(
        { error: "Missing publicKey or signature" },
        { status: 400 }
      );
    }

    // Verify the signature
    const messageBytes = new TextEncoder().encode(SIGN_MESSAGE);
    const publicKeyBytes = bs58.decode(publicKey);
    const signatureBytes = bs58.decode(signature);

    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Deterministic credentials
    const walletEmail = `${publicKey}@wallet.squirtcar`;
    const walletPassword = derivePassword(publicKey);

    // Create user if not exists (admin API)
    const { error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: walletEmail,
      password: walletPassword,
      email_confirm: true,
      user_metadata: {
        wallet_address: publicKey,
        auth_provider: "solana_wallet",
      },
    });

    // Ignore "already registered" errors
    if (createError && !createError.message.includes("already been registered")) {
      console.error("Create user error:", createError);
      return NextResponse.json(
        { error: "Failed to create wallet user" },
        { status: 500 }
      );
    }

    // Sign in using server Supabase client to set session cookies
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error: signInError } = await supabase.auth.signInWithPassword(
      {
        email: walletEmail,
        password: walletPassword,
      }
    );

    if (signInError) {
      console.error("Sign in error:", signInError);
      return NextResponse.json(
        { error: "Failed to sign in wallet user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    console.error("Wallet auth error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

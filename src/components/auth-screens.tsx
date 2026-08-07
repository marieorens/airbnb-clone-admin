import { ArrowRight, Ban, BedDouble, LockKeyhole, Mail } from "lucide-react";

const authErrors: Record<string, string> = {
  invalid_credentials: "Email ou mot de passe incorrect.",
  missing_credentials: "Renseigne ton email et ton mot de passe.",
};

export function LoginScreen({ authError }: { authError?: string | null }) {
  const errorMessage = authError ? authErrors[authError] : null;

  return (
    <main className="grid min-h-screen bg-[#071116] text-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-r border-white/10 bg-[#0D1A20] lg:block">
        <div className="admin-login-grid absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(90deg,rgba(7,17,22,0.12),rgba(7,17,22,0.8))]" />

        <div className="relative z-10 flex min-h-screen flex-col justify-between p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/15 bg-white/5 text-[#22D3EE]">
              <BedDouble size={22} />
            </div>
            <span className="text-lg font-bold tracking-normal">Skybnb</span>
          </div>

          <div className="max-w-[760px] pb-10">
            <p className="text-2xl font-semibold leading-[1.45] text-white">
              Ce backoffice donne une vue claire sur les annonces, les
              reservations, les paiements et les utilisateurs. Tout ce qui compte
              pour piloter Skybnb est au meme endroit.
            </p>
            <p className="mt-6 text-sm font-semibold text-[#8FB4C6]">
              Equipe Operations Skybnb
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-[500px]">
          <div className="overflow-hidden rounded-[14px] border border-[#263A45] bg-[#1A2A33] shadow-[0_30px_80px_rgba(0,0,0,0.32)]">
            <div className="px-10 pb-9 pt-10">
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-normal">
                  Sign in to Skybnb Backoffice
                </h1>
                <p className="mt-2 text-sm text-[#9CB6C4]">
                  Welcome back. Please sign in to continue.
                </p>
              </div>

              <a
                href="/auth/google"
                className="mt-8 inline-flex h-11 w-full items-center justify-center gap-3 rounded-[8px] border border-[#28404B] bg-[#20333D] text-sm font-bold text-[#C8D8E0] transition hover:border-[#22D3EE]/50 hover:bg-[#243B47]"
              >
                <span className="text-base font-black text-[#4285F4]">G</span>
                Google
              </a>

              <div className="my-8 flex items-center gap-4 text-sm text-[#8EA9B8]">
                <span className="h-px flex-1 bg-[#2B414C]" />
                or
                <span className="h-px flex-1 bg-[#2B414C]" />
              </div>

              <form action="/auth/password" method="post" className="grid gap-5">
                <label className="grid gap-2 text-sm font-bold text-white">
                  Email address
                  <span className="flex h-12 items-center gap-3 rounded-[8px] bg-[#2A3E49] px-4 text-[#8EA9B8] ring-1 ring-transparent transition focus-within:ring-[#13B89D]">
                    <Mail size={17} />
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#A5B7C1]"
                      placeholder="admin@skybnb.com"
                    />
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-bold text-white">
                  Password
                  <span className="flex h-12 items-center gap-3 rounded-[8px] bg-[#2A3E49] px-4 text-[#8EA9B8] ring-1 ring-transparent transition focus-within:ring-[#13B89D]">
                    <LockKeyhole size={17} />
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#A5B7C1]"
                      placeholder="Your password"
                    />
                  </span>
                </label>

                {errorMessage ? (
                  <p className="rounded-[8px] border border-[#7F1D1D] bg-[#3A161A] px-3 py-2 text-sm font-semibold text-[#FCA5A5]">
                    {errorMessage}
                  </p>
                ) : null}

                <button className="mt-2 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[8px] bg-[#13B89D] text-sm font-bold text-[#031B17] transition hover:bg-[#16CFAF]">
                  Continue
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ForbiddenScreen({ email }: { email?: string | null }) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#172033]">
      <section className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
        <div className="rounded-[8px] border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F97316] text-white">
            <Ban size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-normal">Acces admin requis</h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Le compte {email ?? "connecte"} existe, mais son profil Supabase ne
            possede pas encore le role <span className="font-semibold">admin</span>.
          </p>
          <form action="/auth/logout" method="post">
            <button className="mt-6 rounded-[8px] border border-[#CBD5E1] px-4 py-2 text-sm font-semibold">
              Se deconnecter
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

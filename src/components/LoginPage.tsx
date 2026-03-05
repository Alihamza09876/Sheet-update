import React, { useState, FormEvent } from "react";

interface LoginPageProps {
  onLogin: (email: string) => void;
}
export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    setTimeout(() => {
      if (email === "mrsalihamza@gmail.com" && password === "mrsalihamza") {
        onLogin(email);
      } else {
        setError("Invalid email or password. Please try again.");
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 overflow-hidden relative">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600 opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-800 opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="relative flex items-center justify-center" style={{ width: 650, height: 750 }}>

        <div className="absolute right-0 top-0 bottom-0 flex flex-col items-center" style={{ width: 240 }}>

          <div className="w-16 h-4 rounded-t-lg bg-amber-500 mt-6 shadow-lg" />

          <div className="w-3 h-14 bg-amber-600" />

          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "80px solid transparent",
              borderRight: "80px solid transparent",
              borderBottom: "120px solid #d97706",
              filter: "drop-shadow(0 10px 32px rgba(245,158,11,0.6))",
            }}
          />

          <div className="w-40 h-2.5 bg-amber-400 opacity-50 rounded-full blur-md -mt-1" />

          <div className="w-4 flex-1 bg-amber-800 rounded-sm relative flex items-center justify-center">

            <div
              onClick={() => setIsOpen(!isOpen)}
              className="absolute cursor-pointer select-none"
              style={{
                width: 200,
                height: 420,
                right: 0,
                top: "50%",
                transform: `translateY(-50%) perspective(600px) rotateY(${isOpen ? "-70deg" : "0deg"})`,
                transformOrigin: "right center",
                transition: "transform 0.85s cubic-bezier(0.4,0,0.2,1)",
                background: "linear-gradient(135deg, #1c1208 0%, #2d1f08 60%, #1c1208 100%)",
                border: "2.5px solid #78450a",
                borderRadius: "80px 80px 16px 16px",
                boxShadow: "inset 0 0 32px rgba(0,0,0,0.7), 4px 0 20px rgba(0,0,0,0.8)",
                zIndex: 20,
              }}
            >
              <div
                className="absolute"
                style={{
                  top: 24, left: 22, right: 22, height: 110,
                  border: "1px solid #4a2d06",
                  borderRadius: "70px 70px 6px 6px",
                }}
              />

              <div
                className="absolute"
                style={{
                  top: 154, left: 22, right: 22, bottom: 24,
                  border: "1px solid #4a2d06",
                  borderRadius: 8,
                }}
              />

              <div
                className="absolute rounded-lg"
                style={{
                  left: 22,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 18,
                  height: 52,
                  background: "radial-gradient(circle at 40% 30%, #f0c040, #92620c)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.8), inset 0 1px 3px rgba(255,220,100,0.5)",
                }}
              />

              <div
                className="absolute"
                style={{
                  right: 30,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 14,
                  height: 20,
                  background: "#000",
                  borderRadius: "7px 7px 0 0",
                  boxShadow: "0 0 8px rgba(255,160,30,0.4)",
                }}
              />

              <div
                className="absolute top-0 bottom-0 transition-all duration-700"
                style={{
                  right: -2,
                  width: 3,
                  background: isOpen
                    ? "linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.85) 30%, rgba(252,211,77,0.95) 50%, rgba(251,191,36,0.85) 70%, transparent 100%)"
                    : "linear-gradient(180deg, transparent 0%, rgba(251,191,36,0.12) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>

          {!isOpen && (
            <p className="text-amber-800 text-xs tracking-widest mt-2 animate-pulse select-none">
              ↑ open door
            </p>
          )}

          <div className="w-56 h-2 rounded-full bg-amber-950 opacity-60 blur-md mt-1" />
        </div>

        <div
          className="absolute left-0"
          style={{
            width: 380,
            top: "50%",
            transform: "translateY(-50%)",
            opacity: isOpen ? 1 : 0,
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
            pointerEvents: isOpen ? "all" : "none",
          }}
        >
          <div className="absolute inset-0 bg-amber-600/10 blur-[100px] rounded-full animate-pulse pointer-events-none" />

          <div className="relative bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-amber-500/30 rounded-tl-[2rem]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-amber-500/30 rounded-br-[2rem]" />

            <div className="mb-8 text-center">
              <h1 className="text-4xl font-serif text-amber-100 tracking-tight leading-none mb-2">
                Login
              </h1>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-3" />
              <p className="text-amber-800/80 text-[10px] uppercase tracking-[0.3em] font-medium">
                Identity Verification Required
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5 group">
                <label className="block text-amber-700/60 text-[10px] uppercase tracking-[0.2em] font-bold ml-1 transition-colors group-focus-within:text-amber-500">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="E-mail Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-950/50 border border-white/5 rounded-xl px-5 py-4 text-amber-50 placeholder-neutral-700 text-sm focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-900/30 transition-all backdrop-blur-sm"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/0 to-transparent transition-all duration-500 group-focus-within:via-amber-500/50" />
                </div>
              </div>

              <div className="space-y-1.5 group">
                <label className="block text-amber-700/60 text-[10px] uppercase tracking-[0.2em] font-bold ml-1 transition-colors group-focus-within:text-amber-500">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-950/50 border border-white/5 rounded-xl px-5 py-4 text-amber-50 placeholder-neutral-700 text-sm focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-900/30 transition-all tracking-[0.5em] backdrop-blur-sm"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/0 to-transparent transition-all duration-500 group-focus-within:via-amber-500/50" />
                </div>
              </div>

              {error && (
                <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-[11px] text-center py-3 px-4 rounded-xl tracking-wide backdrop-blur-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full mt-4 bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 disabled:from-neutral-800 disabled:to-neutral-900 text-neutral-950 font-black text-[11px] uppercase tracking-[0.25em] py-4.5 rounded-xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(180,83,9,0.5)] active:scale-[0.98] active:shadow-none"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <span className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Authenticating
                    </>
                  ) : (
                    <>
                      Grant Access
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

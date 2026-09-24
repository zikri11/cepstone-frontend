"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInputWithStrength } from "@/components/reui/password-input-with-strength";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Interaction states
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isLogin) {
      if (password.length < 8) {
        setErrorMessage("Kata sandi minimal 8 karakter.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi tidak cocok.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 900);
  };

  // Success view (Vercel style clean confirmation)
  if (isSuccess) {
    return (
      <div className="w-full text-center space-y-4 py-4 animate-in fade-in-50 duration-300">
        <div className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2Icon className="size-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {isLogin ? "Autentikasi Berhasil" : "Akun Siap Digunakan"}
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {isLogin
              ? "Sesi pengujian Anda telah diaktifkan."
              : `Selamat datang, ${name || email}. Akses simulasi steganografi video telah dibuka.`}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button asChild className="h-9 w-full rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-1.5">
              Buka Dashboard Workspace
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setPassword("");
              setConfirmPassword("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer"
          >
            Kembali ke form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {isLogin ? "Masuk ke akun" : "Buat akun baru"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {isLogin
            ? "Masukkan kredensial Anda untuk melanjutkan."
            : "Akses modul simulasi steganografi video animasi 2D."}
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive" className="mt-3 py-2 px-3 text-xs rounded-lg">
          <AlertCircleIcon className="size-3.5" />
          <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {!isLogin && (
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-foreground">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nama Anda"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-xs rounded-lg border-border/60 bg-background/50 focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 transition-colors"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-foreground">
            Alamat Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 text-xs rounded-lg border-border/60 bg-background/50 focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 transition-colors"
          />
        </div>

        {/* Minimal Password Input (Strength indicator only shown on Signup) */}
        <PasswordInputWithStrength
          id="password"
          name="password"
          label="Kata Sandi"
          placeholder={isLogin ? "Masukkan kata sandi Anda" : "Minimal 8 karakter"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          showStrength={!isLogin}
          rightAction={
            isLogin ? (
              <button
                type="button"
                onClick={() => {
                  alert("Fitur pemulihan kata sandi dapat dihubungkan ke endpoint backend.");
                }}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Lupa kata sandi?
              </button>
            ) : null
          }
        />

        {/* Confirm Password (Signup only) */}
        {!isLogin && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                Konfirmasi Kata Sandi
              </Label>
              {confirmPassword.length > 0 && (
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    password === confirmPassword
                      ? "text-emerald-500"
                      : "text-rose-500"
                  )}
                >
                  {password === confirmPassword ? "Cocok" : "Belum cocok"}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={isConfirmVisible ? "text" : "password"}
                placeholder="Ulangi kata sandi"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 pe-9 text-xs rounded-lg border-border/60 bg-background/50 focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/40 transition-colors"
              />
              <button
                type="button"
                onClick={() => setIsConfirmVisible((prev) => !prev)}
                tabIndex={-1}
                aria-label={isConfirmVisible ? "Sembunyikan" : "Tampilkan"}
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/60 transition-colors hover:text-foreground focus:outline-none"
              >
                {isConfirmVisible ? (
                  <EyeOffIcon className="size-3.5" />
                ) : (
                  <EyeIcon className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Submit & Social Buttons */}
        <div className="pt-1 space-y-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Memproses...
              </span>
            ) : isLogin ? (
              "Masuk"
            ) : (
              "Daftar Akun"
            )}
          </button>

          <div className="relative flex items-center justify-center text-[10px] text-muted-foreground/60 py-0.5">
            <div className="w-full border-t border-border/50" />
            <span className="absolute bg-background px-2">atau</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setName("Pengguna Google");
                setEmail("user@gmail.com");
                setIsLoading(false);
                setIsSuccess(true);
              }, 800);
            }}
            className="w-full h-9 rounded-lg text-xs font-medium border border-border/70 bg-background/50 hover:bg-muted/40 transition-colors flex items-center justify-center gap-2 cursor-pointer text-foreground"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
              />
            </svg>
            Lanjutkan Dengan Google
          </button>
        </div>

        {/* Subtle disclaimer */}
        {!isLogin && (
          <p className="text-[11px] text-muted-foreground/80 text-center leading-relaxed pt-1">
            Dengan mendaftar, Anda menyetujui penggunaan etis sistem steganografi video untuk keperluan akademis.
          </p>
        )}
      </form>

      {/* Switch Link */}
      <p className="mt-5 text-center text-xs text-muted-foreground">
        {isLogin ? (
          <>
            Belum memiliki akun?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Daftar
            </Link>
          </>
        ) : (
          <>
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

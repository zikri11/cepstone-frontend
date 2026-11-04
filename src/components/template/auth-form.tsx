"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  MailCheckIcon,
  RefreshCwIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInputWithStrength } from "@/components/reui/password-input-with-strength";
import {
  loginUser,
  registerUser,
  verifyEmailApi,
  resendCodeApi,
  forgotPasswordApi,
  verifyResetCodeApi,
  resetPasswordApi,
} from "@/lib/api";

type FormView = "login" | "signup" | "verify" | "forgot" | "verify_reset" | "new_password";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode: initialMode }: AuthFormProps) {
  const [view, setView] = useState<FormView>(() => {
    if (typeof window !== "undefined") {
      const token = new URLSearchParams(window.location.search).get("token");
      if (token) return "new_password";
    }
    return initialMode;
  });

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Interaction states
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ title: string; desc: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    // 1. Verify Email OTP Flow
    if (view === "verify") {
      if (!otpCode.trim() || otpCode.trim().length !== 6) {
        setErrorMessage("Masukkan 6-digit kode verifikasi yang tertera di email Anda.");
        return;
      }
      setIsLoading(true);
      try {
        await verifyEmailApi(email.trim(), otpCode.trim());
        setIsLoading(false);
        setSuccessInfo({
          title: "Email Berhasil Diverifikasi",
          desc: "Akun Anda telah aktif dan siap digunakan untuk simulasi steganografi.",
        });
      } catch (err: unknown) {
        setIsLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "Kode verifikasi tidak cocok.");
      }
      return;
    }

    // 2. Forgot Password Flow (Sends 6-digit OTP via Brevo)
    if (view === "forgot") {
      if (!email.trim()) {
        setErrorMessage("Silakan masukkan alamat email Anda.");
        return;
      }
      setIsLoading(true);
      try {
        const res = await forgotPasswordApi(email.trim());
        setIsLoading(false);
        setView("verify_reset");
        setOtpCode("");
        setInfoMessage(res.message || "Kode 6-digit telah dikirim ke email Anda.");
      } catch (err: unknown) {
        setIsLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "Gagal memproses pemulihan kata sandi.");
      }
      return;
    }

    // 3. Verify Reset OTP Flow (Step 2: Validate OTP before showing password fields)
    if (view === "verify_reset") {
      if (!email.trim()) {
        setErrorMessage("Alamat email tidak ditemukan. Silakan ulangi proses lupa kata sandi.");
        return;
      }
      if (!otpCode.trim() || otpCode.trim().length !== 6) {
        setErrorMessage("Masukkan 6-digit kode pemulihan yang dikirim ke email.");
        return;
      }
      setIsLoading(true);
      try {
        const res = await verifyResetCodeApi(email.trim(), otpCode.trim());
        setIsLoading(false);
        setView("new_password");
        setPassword("");
        setConfirmPassword("");
        setInfoMessage(res.message || "Kode verifikasi valid. Silakan buat kata sandi baru Anda.");
      } catch (err: unknown) {
        setIsLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "Kode verifikasi tidak cocok atau kedaluwarsa.");
      }
      return;
    }

    // 4. Set New Password Flow (Step 3: Only accessible after OTP is verified)
    if (view === "new_password") {
      if (password.length < 6) {
        setErrorMessage("Kata sandi baru minimal 6 karakter.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi tidak cocok.");
        return;
      }
      setIsLoading(true);
      try {
        await resetPasswordApi({
          email: email.trim(),
          code: otpCode.trim(),
          newPassword: password,
        });
        setIsLoading(false);
        setSuccessInfo({
          title: "Kata Sandi Berhasil Diperbarui",
          desc: "Kata sandi akun Anda telah diperbarui. Silakan masuk menggunakan kata sandi baru Anda.",
        });
      } catch (err: unknown) {
        setIsLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "Gagal mereset kata sandi.");
      }
      return;
    }

    // 4. Signup Validations & Trigger Brevo Verification
    if (view === "signup") {
      if (password.length < 8) {
        setErrorMessage("Kata sandi minimal 8 karakter.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Konfirmasi kata sandi tidak cocok.");
        return;
      }
      setIsLoading(true);
      try {
        const username = name.trim() || email.split("@")[0] || "user";
        const res = await registerUser(username, email.trim(), password, adminCode.trim() || undefined);
        setIsLoading(false);
        if (res.requiresVerification) {
          setView("verify");
          setOtpCode("");
          setInfoMessage("Kode verifikasi 6 digit telah dikirim ke email Anda via Brevo.");
        } else {
          setSuccessInfo({
            title: "Pendaftaran Berhasil",
            desc: `Selamat datang, ${username}. Akun Anda telah siap.`,
          });
        }
      } catch (err: unknown) {
        setIsLoading(false);
        setErrorMessage(err instanceof Error ? err.message : "Pendaftaran gagal");
      }
      return;
    }

    // 5. Login Flow
    if (view === "login") {
      setIsLoading(true);
      try {
        await loginUser(email.trim(), password);
        setIsLoading(false);
        setSuccessInfo({
          title: "Autentikasi Berhasil",
          desc: "Sesi pengujian steganografi Anda telah aktif.",
        });
      } catch (err: unknown) {
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : "Gagal melakukan autentikasi";
        // Check if unverified account
        if (msg.includes("belum diverifikasi")) {
          setView("verify");
          setErrorMessage(msg);
          return;
        }
        setErrorMessage(msg);
      }
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) return;
    setIsResending(true);
    setErrorMessage(null);
    try {
      const type = (view === "verify_reset" || view === "new_password") ? "reset" : "verify";
      const res = await resendCodeApi(email.trim(), type);
      setIsResending(false);
      setInfoMessage(res.message || "Kode 6 digit baru telah dikirim.");
      setOtpCode("");
    } catch (err: unknown) {
      setIsResending(false);
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengirim ulang kode");
    }
  };

  // Success Confirmation Screen
  if (successInfo) {
    return (
      <div className="w-full text-center space-y-4 py-4 animate-in fade-in-50 duration-300">
        <div className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <CheckCircle2Icon className="size-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {successInfo.title}
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {successInfo.desc}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          {view === "new_password" ? (
            <Button
              type="button"
              onClick={() => {
                setSuccessInfo(null);
                setView("login");
                setPassword("");
                setConfirmPassword("");
                setOtpCode("");
              }}
              className="h-9 w-full rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Masuk Dengan Kata Sandi Baru
            </Button>
          ) : (
            <Button asChild className="h-9 w-full rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-1.5">
                Buka Dashboard Workspace
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
          )}

          <button
            type="button"
            onClick={() => {
              setSuccessInfo(null);
              setPassword("");
              setConfirmPassword("");
              setOtpCode("");
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
          {view === "login" && "Masuk ke akun"}
          {view === "signup" && "Buat akun baru"}
          {view === "verify" && "Verifikasi Kode Email"}
          {view === "forgot" && "Pulihkan Kata Sandi"}
          {view === "verify_reset" && "Verifikasi Kode OTP"}
          {view === "new_password" && "Setel Kata Sandi Baru"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {view === "login" && "Masukkan kredensial Anda untuk melanjutkan."}
          {view === "signup" && "Akses modul simulasi steganografi video animasi 2D."}
          {view === "verify" && `Kode verifikasi 6-digit telah dikirim ke ${email || "email Anda"}.`}
          {view === "forgot" && "Masukkan email terdaftar untuk menerima 6-digit kode OTP via Brevo."}
          {view === "verify_reset" && `Masukkan 6-digit kode OTP pemulihan yang dikirim ke ${email || "email Anda"}.`}
          {view === "new_password" && "Kode OTP terverifikasi. Masukkan kata sandi baru untuk akun Anda."}
        </p>
      </div>

      {/* Info Alert */}
      {infoMessage && (
        <Alert className="mt-3 py-2 px-3 text-xs rounded-lg border-primary/40 bg-primary/5 text-primary">
          <MailCheckIcon className="size-3.5" />
          <AlertDescription className="text-xs">{infoMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="destructive" className="mt-3 py-2 px-3 text-xs rounded-lg">
          <AlertCircleIcon className="size-3.5" />
          <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {/* Full Name (Signup only) */}
        {view === "signup" && (
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

        {/* Email Field (Login, Signup, Forgot only) */}
        {(view === "login" || view === "signup" || view === "forgot") && (
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
        )}

        {/* 6-Digit OTP Code Input for Verify Email & Verify Reset views */}
        {(view === "verify" || view === "verify_reset") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label htmlFor="otpCode" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <KeyRoundIcon className="size-3.5 text-primary" />
                Kode Verifikasi 6-Digit (OTP)
              </Label>
              <button
                type="button"
                disabled={isResending}
                onClick={handleResendOtp}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCwIcon className={cn("size-3", isResending && "animate-spin")} />
                Kirim Ulang
              </button>
            </div>
            <Input
              id="otpCode"
              name="otpCode"
              type="text"
              maxLength={6}
              placeholder="Contoh: 849201"
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="h-11 text-center font-mono text-lg font-bold tracking-[6px] rounded-lg border-border/70 bg-background/50"
            />
            <p className="text-[11px] text-muted-foreground">
              Periksa kotak masuk (Inbox) atau folder Spam pada email <strong>{email}</strong>.
            </p>
          </div>
        )}

        {/* Password Field (Login, Signup, New Password) */}
        {(view === "login" || view === "signup" || view === "new_password") && (
          <PasswordInputWithStrength
            id="password"
            name="password"
            label={view === "new_password" ? "Kata Sandi Baru" : "Kata Sandi"}
            placeholder={view === "login" ? "Masukkan kata sandi Anda" : "Minimal 8 karakter"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            showStrength={view === "signup" || view === "new_password"}
            rightAction={
              view === "login" ? (
                <button
                  type="button"
                  onClick={() => {
                    setView("forgot");
                    setErrorMessage(null);
                    setInfoMessage(null);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              ) : null
            }
          />
        )}

        {/* Confirm Password (Signup & New Password) */}
        {(view === "signup" || view === "new_password") && (
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

        {/* Optional Admin Passcode (Signup only) */}
        {view === "signup" && (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="adminCode" className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
              <span>Passcode Admin (Opsional)</span>
              <span className="text-[10px] text-muted-foreground/70">Untuk hak akses Admin</span>
            </Label>
            <Input
              id="adminCode"
              name="adminCode"
              type="password"
              placeholder="Kosongkan jika pengguna biasa"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              className="h-8 text-xs font-mono rounded-lg border-dashed border-border/60 bg-background/30"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-1 space-y-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/25 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Memproses...
              </span>
            ) : (
              <>
                {view === "login" && "Masuk"}
                {view === "signup" && "Daftar Akun"}
                {view === "verify" && "Verifikasi & Aktifkan Akun"}
                {view === "forgot" && "Kirim Kode OTP Pemulihan"}
                {view === "verify_reset" && "Verifikasi Kode OTP"}
                {view === "new_password" && "Simpan Kata Sandi Baru"}
              </>
            )}
          </button>
        </div>

        {/* Subtle disclaimer */}
        {view === "signup" && (
          <p className="text-[11px] text-muted-foreground/80 text-center leading-relaxed pt-1">
            Dengan mendaftar, Anda menyetujui penggunaan etis sistem steganografi video untuk keperluan akademis.
          </p>
        )}
      </form>

      {/* Switch Links */}
      <div className="mt-5 text-center text-xs text-muted-foreground space-y-1">
        {view === "login" && (
          <p>
            Belum memiliki akun?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Daftar
            </Link>
          </p>
        )}
        {view === "signup" && (
          <p>
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </p>
        )}
        {(view === "verify" || view === "forgot" || view === "verify_reset" || view === "new_password") && (
          <button
            type="button"
            onClick={() => {
              setView("login");
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            Kembali ke Halaman Masuk (Login)
          </button>
        )}
      </div>
    </div>
  );
}

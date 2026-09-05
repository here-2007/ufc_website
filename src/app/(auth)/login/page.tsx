'use client';

import { useState } from 'react';
import { GithubIcon } from '@/components/ui/social-icons';
import { useAuth } from '@/features/auth/auth-provider';

export default function LoginPage() {
  const { loginWithGitHub } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLogin = async () => {
    setIsRedirecting(true);
    await loginWithGitHub();
  };

  return (
    <section className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-wide text-[#0B874F] md:text-4xl">
          // SIGN IN
        </h1>
        <p className="text-sm text-[#F5A623]">
          Authenticate securely with your GitHub account.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void handleLogin()}
        disabled={isRedirecting}
        className="flex w-full items-center justify-center gap-3 border border-[#0B874F] bg-[#0B874F] px-4 py-3 font-bold text-black transition hover:bg-[#0ea85f] disabled:cursor-wait disabled:opacity-60"
      >
        <GithubIcon className="h-5 w-5" />
        {isRedirecting ? 'REDIRECTING TO GITHUB…' : 'CONTINUE WITH GITHUB'}
      </button>

      <p className="text-xs text-gray-400">
        Your GitHub access token is kept server-side and is used only for your account’s GitHub data.
      </p>
    </section>
  );
}

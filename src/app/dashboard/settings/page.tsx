'use client';

import { Settings } from 'lucide-react';
import { useAuth } from '@/features/auth/auth-provider';
import { GithubIcon } from '@/components/ui/social-icons';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <header className="rounded-xl border border-[#0B874F]/30 bg-gradient-to-r from-black/60 to-[#0B874F]/10 p-8">
        <h1 className="flex items-center gap-4 text-4xl font-bold text-white">
          <Settings className="h-10 w-10 text-[#0B874F]" />
          Settings
        </h1>
        <p className="mt-2 text-lg text-gray-300">Account and integration status.</p>
      </header>

      <section className="rounded-lg border border-[#0B874F]/30 bg-black/40 p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <GithubIcon className="h-5 w-5" />
          GitHub Integration
        </h2>
        <p className="mt-4 text-gray-300">
          {user?.githubUsername
            ? `Connected as @${user.githubUsername}.`
            : 'No GitHub account is currently connected.'}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          GitHub data syncs automatically through the background pipeline after sign-in and scheduled refreshes. There is no manual sync action.
        </p>
      </section>
    </div>
  );
}

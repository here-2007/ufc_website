"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";
import PageTransition from "@/app/Components/page-transition";
import { events, chintans } from "@/data/events";
import { Timeline } from "./components/Timeline";
import { ChintanAccordion } from "./components/ChintanAccordion";

export default function EventsPage() {
  const [selectedChintan, setSelectedChintan] = useState<number | null>(null);
  const active = selectedChintan !== null ? chintans[selectedChintan] : null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
        <div className="fixed inset-0 bg-gradient-to-br from-black via-[#001F1D] to-black opacity-50 z-0" />
        <div className="fixed inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(11,135,79,0.08)_25%,rgba(11,135,79,0.08)_26%,transparent_27%,transparent_74%,rgba(11,135,79,0.08)_75%,rgba(11,135,79,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(11,135,79,0.08)_25%,rgba(11,135,79,0.08)_26%,transparent_27%,transparent_74%,rgba(11,135,79,0.08)_75%,rgba(11,135,79,0.08)_76%,transparent_77%,transparent)] bg-[size:80px_80px] opacity-40 z-0" />

        {/* STAY IN THE LOOP — fixed left sidebar, only on xl+ */}
        <div className="hidden xl:flex fixed left-0 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-4 w-56 px-5 py-6 mx-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
          <p className="text-white text-sm font-bold uppercase tracking-widest text-center">
            Stay in the loop
          </p>
          <p className="text-gray-400 text-sm leading-relaxed text-center">
            Event details and meet links drop on WhatsApp. Updates on Instagram.
          </p>
          <div className="flex flex-col gap-2.5 w-full pt-1">
            <a
              href="https://chat.whatsapp.com/CyN8KlKDUfh8zmzp5VYGSh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-emerald-300 border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 rounded-xl hover:bg-emerald-500/25 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              WhatsApp
            </a>
            <a
              href="https://www.instagram.com/foss_usar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-pink-300 border border-pink-500/40 bg-pink-500/15 px-4 py-2.5 rounded-xl hover:bg-pink-500/25 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              Instagram
            </a>
          </div>
        </div>

        {/* CHINTAN DETAIL — fixed right panel on xl+, bottom sheet on mobile */}
        <AnimatePresence>
          {active && (
            <>
              {/* Mobile bottom sheet */}
              <motion.div
                key={`mobile-${active.episode}`}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="xl:hidden fixed bottom-0 left-0 right-0 z-40 flex flex-col max-h-[85vh] rounded-t-2xl border-t border-violet-400/20 bg-black/98 backdrop-blur-xl overflow-hidden shadow-[0_-20px_60px_rgba(139,92,246,0.2)]"
              >
                {/* drag handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>
                <button
                  onClick={() => setSelectedChintan(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
                <div
                  className="overflow-y-auto flex-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={active.flyer}
                      alt={active.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    <div>
                      <p className="text-white font-bold text-base leading-snug">
                        {active.title}
                      </p>
                      <p className="text-violet-300 text-sm mt-1">
                        {active.speaker}
                      </p>
                      <p className="text-violet-400/70 text-xs mt-0.5">
                        {active.date}
                      </p>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {active.speakerBio}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {active.topic}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 pb-6">
                      {active.links?.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-violet-300 border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 rounded-full hover:bg-violet-500/20 transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {l.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              {/* Mobile backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="xl:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedChintan(null)}
              />

              {/* Desktop right panel */}
              <motion.div
                key={`desktop-${active.episode}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hidden xl:flex fixed right-0 top-0 bottom-0 z-30 flex-col w-[26rem] border-l border-violet-400/20 bg-black/95 backdrop-blur-xl overflow-hidden shadow-[-20px_0_60px_rgba(139,92,246,0.15)]"
              >
                <div className="relative w-full aspect-[2/3] shrink-0">
                  <Image
                    src={active.flyer}
                    alt={active.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                  <button
                    onClick={() => setSelectedChintan(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
                <div
                  className="overflow-y-auto px-5 py-4 space-y-3 flex-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  <div>
                    <p className="text-white font-bold text-lg leading-snug">
                      {active.title}
                    </p>
                    <p className="text-violet-300 text-sm mt-1">
                      {active.speaker}
                    </p>
                    <p className="text-violet-400/70 text-xs mt-0.5">
                      {active.date}
                    </p>
                  </div>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {active.speakerBio}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {active.topic}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {active.links?.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-violet-300 border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 rounded-full hover:bg-violet-500/20 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <section className="pt-28 pb-24 px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* HEADER */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1
                className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-wider"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                EVENTS
              </h1>
              <p className="text-green-400/60 text-xs tracking-[0.3em] uppercase mb-8 font-medium">
                A few good ones beat many forgettable ones.
              </p>

              <div className="rounded-2xl border border-green-500/20 bg-black/50 backdrop-blur-md p-6 text-left space-y-4 shadow-[0_0_40px_rgba(34,197,94,0.06)]">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Offline events teach less and occupy more time. We know that.
                  So we don't run many — just enough to keep the community alive
                  and the bonds real. A few events a semester, done well, matter
                  more than a packed calendar done for optics.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We don't chase sponsors to fund a tech club either. Skilled
                  people can self-sustain — and that's what we're building
                  toward. This club runs for those who are genuinely interested.
                  If you're not, that's fine, but this space is built for the
                  ones who are.
                </p>
              </div>
            </motion.div>

            {/* OPEN COMMUNITY CHINTANS — UPCOMING */}
            <ChintanAccordion
              chintans={chintans}
              selected={selectedChintan}
              onSelect={setSelectedChintan}
            />

            {/* TIMELINE */}
            <Timeline events={events} />
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { ChintanEvent } from "@/data/events";

interface ChintanAccordionProps {
  chintans: ChintanEvent[];
  selected: number | null;
  onSelect: (index: number | null) => void;
}

export function ChintanAccordion({
  chintans,
  selected,
  onSelect,
}: ChintanAccordionProps) {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      className="mt-20"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 rounded-2xl"
      >
        <div className="rounded-2xl border border-violet-500/30 bg-black/70 backdrop-blur-md px-6 py-5 hover:border-violet-400/50 hover:bg-violet-500/5 transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full border border-violet-400/30 bg-violet-500/10 text-violet-300 text-[11px] tracking-widest uppercase">
                  Series
                </span>
                <span className="px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[11px] tracking-widest uppercase">
                  Upcoming
                </span>
                <span className="px-2 py-0.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400/60 text-[11px]">
                  Online
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white group-hover:text-violet-300 transition-colors duration-200"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Open Community Chintans
              </h2>
              <p className="text-white/40 text-sm mt-1">
                Online talks · Real ideas · Different speakers · No gatekeeping
              </p>
            </div>
            <div className="ml-4 shrink-0 w-9 h-9 rounded-full border border-violet-500/30 bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-all duration-300">
              <ChevronDown
                className={`w-4 h-4 text-violet-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl border border-violet-500/20 bg-black/60 backdrop-blur-md p-6 space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                A series of online community talks — different topics, different
                speakers, real conversations. No polished corporate panels, just
                people with ideas worth sharing.
              </p>

              <div className="flex flex-col gap-3">
                {chintans.map((c, i) => (
                  <button
                    key={c.episode}
                    onClick={() => onSelect(selected === i ? null : i)}
                    className={`group/card text-left rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer ${
                      selected === i
                        ? "border-violet-400/60 shadow-[0_0_32px_rgba(139,92,246,0.3)] scale-[1.01]"
                        : "border-violet-500/15 hover:border-violet-400/40 hover:shadow-[0_0_24px_rgba(139,92,246,0.15)] hover:scale-[1.01]"
                    } bg-violet-500/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50`}
                  >
                    {c.flyer && (
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <Image
                          src={c.flyer}
                          alt={`${c.title} flyer`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                        {/* Click me hint */}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${selected === i ? "opacity-0" : "opacity-0 group-hover/card:opacity-100"}`}
                        >
                          <span className="px-3 py-1.5 rounded-full bg-violet-500/80 backdrop-blur-sm text-white text-xs font-semibold tracking-wide shadow-lg">
                            {selected === i ? "Close" : "View details →"}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 p-4">
                      <span
                        className="text-2xl font-black text-violet-400/50 shrink-0 leading-none group-hover/card:text-violet-400/80 transition-colors duration-200"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                      >
                        {c.episode}
                      </span>
                      <div>
                        <p className="text-white font-bold text-sm group-hover/card:text-violet-200 transition-colors duration-200">
                          {c.title}
                        </p>
                        <p className="text-violet-300 text-xs mt-0.5">
                          {c.speaker} · {c.date}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-violet-400/40 text-xs tracking-widest uppercase pt-2">
                More episodes coming
              </p>

              {/* Stay in the loop — inline for mobile, hidden on xl where sidebar shows */}
              <div className="xl:hidden pt-2 border-t border-violet-500/15 space-y-2">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">
                  Stay in the loop
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Event details and meet links drop on WhatsApp. Updates on
                  Instagram.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="https://chat.whatsapp.com/CyN8KlKDUfh8zmzp5VYGSh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 rounded-full hover:bg-emerald-500/25 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    WhatsApp Community
                  </a>
                  <a
                    href="https://www.instagram.com/foss_usar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-300 border border-pink-500/40 bg-pink-500/15 px-3 py-1.5 rounded-full hover:bg-pink-500/25 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

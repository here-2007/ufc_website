"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ExternalLink, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { EventVisual } from "./EventVisual";
import type { ClubEvent } from "@/data/events";

interface EventCardProps {
  event: ClubEvent;
}

export function EventCard({ event }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasVisual = event.bg === "gitgud" || event.bg === "fossforge";

  return (
    <motion.div
      className="rounded-2xl border border-white/8 bg-black/70 backdrop-blur-md overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/50"
      style={{
        boxShadow: expanded
          ? "0 0 50px rgba(34,197,94,0.1), 0 0 0 1px rgba(34,197,94,0.15)"
          : "0 4px 24px rgba(0,0,0,0.4)",
      }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => setExpanded((v) => !v)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded((v) => !v); } }}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
    >
      {/* Gradient top accent */}
      <div
        className={`h-px w-full bg-gradient-to-r ${event.accent.replace("/20", "/60").replace("/5", "/0")}`}
      />

      {/* Visual strip */}
      {hasVisual && (
        <div className="relative h-40 w-full overflow-hidden">
          <EventVisual bg={event.bg} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${event.accent} opacity-40`}
          />
          <span
            className="absolute bottom-4 right-5 text-[72px] leading-none font-black select-none pointer-events-none"
            style={{
              fontFamily: "var(--font-orbitron)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            }}
          >
            {event.number}
          </span>
        </div>
      )}

      <div className="p-5 md:p-6">
        {/* Meta row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/20 text-[10px] font-mono tracking-[0.2em] uppercase">
              {event.number}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${event.labelColor}`}
            >
              {event.category}
            </span>
            <span className="px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-[11px]">
              completed
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white/30 text-[11px] shrink-0">
            <Calendar className="w-3 h-3" />
            {event.displayDate}
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-2xl md:text-3xl font-black text-white mb-1 group-hover:text-green-300 transition-colors duration-200"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          {event.title}
        </h2>
        <p className="text-white/40 text-sm mb-4">{event.subtitle}</p>

        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[11px] border border-white/8 bg-white/4 text-white/40"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/6">
          <button
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-green-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
            {expanded ? "Less" : "More"}
          </button>
          <div className="flex items-center gap-3">
            {event.registrationUrl && (
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[11px] text-green-400/70 border border-green-500/25 px-3 py-1 rounded-full hover:bg-green-500/10 hover:text-green-300 transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                Register
              </a>
            )}
            <Link
              href={`/events/${event.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white transition-colors"
            >
              Full details <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={`mx-5 md:mx-6 mb-5 rounded-xl border border-white/6 bg-gradient-to-br ${event.accent} p-4`}
            >
              <p className="text-gray-300 text-sm leading-relaxed">
                {event.detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

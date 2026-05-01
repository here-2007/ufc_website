"use client";

import { motion } from "framer-motion";
import { EventCard } from "./EventCard";
import type { ClubEvent } from "@/data/events";

interface TimelineProps {
  events: ClubEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative mt-20">
      <div className="absolute left-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-green-400/80 via-green-500/30 to-transparent" />
      <div className="space-y-12">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            className="relative pl-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Dot */}
            <div
              className={`absolute left-0 top-5 w-[23px] h-[23px] rounded-full border-2 ${event.dotColor} bg-black flex items-center justify-center shadow-lg`}
            >
              <div
                className={`w-[7px] h-[7px] rounded-full ${event.dotColor.split(" ")[0]}`}
              />
            </div>

            {/* Card */}
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
      <div className="relative pl-10 pt-8">
        <div className="absolute left-[7px] top-8 w-[9px] h-[9px] rounded-full border border-green-500/30 bg-black" />
        <p className="text-green-500/30 text-xs tracking-widest uppercase">
          More coming
        </p>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface MemoryItem {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface ImageChoiceQuestionProps {
  memories: MemoryItem[];
  onSelect: (memoryId: string, caption: string) => void;
}

export default function ImageChoiceQuestion({ memories, onSelect }: ImageChoiceQuestionProps) {
  if (!memories || memories.length === 0) {
    return (
      <div className="text-center py-6 text-gray-600 font-bold text-sm">
        No memory photos uploaded for this question yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {memories.map((mem, index) => (
        <motion.button
          key={mem.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          onClick={() => onSelect(mem.id, mem.caption || "Memory")}
          className="group relative rounded-2xl overflow-hidden border-2 border-rose-200 hover:border-[#E07A5F] shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95 text-left cursor-pointer bg-white"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-rose-50">
            <Image
              src={mem.imageUrl}
              alt={mem.caption || "Memory"}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-80" />
            {mem.caption && (
              <div className="absolute bottom-3 left-3 right-3 text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {mem.caption}
              </div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

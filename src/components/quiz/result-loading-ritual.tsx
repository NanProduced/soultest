"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, Fingerprint, Database } from "lucide-react";

const loadingStates = [
  {
    text: "正在整理你的作答结果...",
    icon: <Fingerprint className="size-6 text-fuchsia-500" />,
  },
  {
    text: "对比 16 种人格原型...",
    icon: <BrainCircuit className="size-6 text-violet-500" />,
  },
  {
    text: "生成完整结果页内容...",
    icon: <Sparkles className="size-6 text-sky-500" />,
  },
  {
    text: "正在同步数据至 D1...",
    icon: <Database className="size-6 text-emerald-500" />,
  },
];

export const ResultLoadingRitual = ({ onComplete }: { onComplete?: () => void }) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (currentState < loadingStates.length - 1) {
      const timer = setTimeout(() => {
        setCurrentState((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentState, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
      <div className="relative size-24 mb-10">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-fuchsia-500/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-white rounded-full shadow-[0_0_40px_rgba(217,70,239,0.15)]"
          key={currentState}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
        >
          {loadingStates[currentState].icon}
        </motion.div>
      </div>

      <div className="h-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentState}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-lg font-medium text-slate-700 tracking-tight"
          >
            {loadingStates[currentState].text}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex gap-2">
        {loadingStates.map((_, idx) => (
          <motion.div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx <= currentState ? "w-8 bg-slate-900" : "w-2 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};


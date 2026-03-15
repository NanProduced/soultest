import { motion } from "framer-motion"
import tarot1 from "@/assets/tarot/tarot-1.png"
import tarot2 from "@/assets/tarot/tarot-2.png"
import tarot3 from "@/assets/tarot/tarot-3.png"

const CARDS = [
  {
    id: 1,
    url: tarot1,
    rotate: -15,
    y: 30,
    x: -60,
    z: 10,
  },
  {
    id: 2,
    url: tarot2,
    rotate: 0,
    y: 0,
    x: 0,
    z: 20,
  },
  {
    id: 3,
    url: tarot3,
    rotate: 15,
    y: 30,
    x: 60,
    z: 10,
  }
]

export function TarotShowcase() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[3/4.2] flex items-center justify-center">
      {CARDS.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute w-[220px] sm:w-[260px] aspect-[2.5/4] rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 origin-bottom cursor-pointer"
          style={{ zIndex: card.z }}
          initial={{ rotate: 0, y: 150, opacity: 0 }}
          animate={{ rotate: card.rotate, y: card.y, x: card.x, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.2 + index * 0.15, 
            type: "spring", 
            bounce: 0.3 
          }}
          whileHover={{ 
            y: card.y - 40, 
            rotate: card.rotate * 0.5, 
            scale: 1.05, 
            zIndex: 30,
            transition: { duration: 0.3 }
          }}
        >
          <img 
            src={card.url} 
            alt={`Tarot card ${card.id}`} 
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-2xl pointer-events-none" />
        </motion.div>
      ))}

      {/* Ambient floating lights */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
    </div>
  )
}

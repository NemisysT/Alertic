"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Home,
  AlertTriangle,
  Map,
  FileText,
  Bot,
  Settings,
  CloudSun,
} from "lucide-react";
import { useRef } from "react";

const links = [
  { href: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
  { href: "/map", icon: <Map className="w-5 h-5" />, label: "Map" },
  { href: "/reports", icon: <FileText className="w-5 h-5" />, label: "Reports" },
  { href: "/weather", icon: <CloudSun className="w-5 h-5" />, label: "Weather" },
  { href: "/ai-help", icon: <Bot className="w-5 h-5" />, label: "Help" },
  
];

export default function Sidebar() {
  const pathname = usePathname();
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const magnification = 70;
  const baseItemSize = 50;
  const distance = 200;

  return (
    <motion.div
      className="fixed right-2 top-1/2 -translate-y-1/2 flex flex-col items-center z-50"
      onMouseMove={(e) => {
        isHovered.set(1);
        mouseY.set(e.pageY);
      }}
      onMouseLeave={() => {
        isHovered.set(0);
        mouseY.set(Infinity);
      }}
    >
      <div className="flex flex-col gap-6 rounded-2xl border-2 border-neutral-700 bg-black/20 backdrop-blur-lg px-4 py-6">
        {links.map((link, index) => {
          const ref = useRef<HTMLDivElement>(null);

          const mouseDistance = useTransform(mouseY, (val) => {
            const rect = ref.current?.getBoundingClientRect() ?? {
              y: 0,
              height: baseItemSize,
            };
            return val - rect.y - baseItemSize / 2;
          });

          const targetSize = useTransform(
            mouseDistance,
            [-distance, 0, distance],
            [baseItemSize, magnification, baseItemSize]
          );

          const size = useSpring(targetSize, spring);

          const isActive = pathname === link.href;

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <motion.div
                ref={ref}
                style={{
                  width: size,
                  height: size,
                }}
                onClick={() => (window.location.href = link.href)}
                className={`flex items-center justify-center rounded-full border-2 border-neutral-700 bg-[#060606] shadow-md cursor-pointer ${
                  isActive ? "shadow-glow" : "hover:bg-white/5"
                }`}
              >
                {link.icon}
              </motion.div>
              <span className="text-xs text-white whitespace-nowrap">
                {link.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
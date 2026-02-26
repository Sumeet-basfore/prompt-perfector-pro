"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DropdownMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
    destructive?: boolean;
  }[];
  children?: React.ReactNode;
  triggerClassName?: string;
  menuClassName?: string;
  showChevron?: boolean;
};

const AnimatedDropdown = ({
  options,
  children,
  triggerClassName,
  menuClassName = "right-0 w-48",
  showChevron = true
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className={triggerClassName || "px-4 py-2 bg-background/80 hover:bg-muted shadow-sm border border-border/50 rounded-xl backdrop-blur-sm transition-colors text-foreground"}
      >
        {children ?? "Menu"}
        {showChevron && (
          <motion.span
            className="ml-2"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut", type: "spring" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -5, scale: 0.95, filter: "blur(10px)", opacity: 0 }}
            animate={{ y: 0, scale: 1, filter: "blur(0px)", opacity: 1 }}
            exit={{ y: -5, scale: 0.95, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "circInOut", type: "spring" }}
            className={`absolute z-[100] mt-2 p-1 bg-popover border border-border rounded-xl shadow-xl flex flex-col gap-1 text-popover-foreground ${menuClassName}`}
          >
            {options && options.length > 0 ? (
              options.map((option, index) => (
                <motion.button
                  initial={{
                    opacity: 0,
                    x: 10,
                    scale: 0.95,
                    filter: "blur(4px)",
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    x: 10,
                    scale: 0.95,
                    filter: "blur(4px)",
                  }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeInOut",
                    type: "spring",
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "hsl(var(--muted))",
                    transition: {
                      duration: 0.2,
                      ease: "easeInOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      duration: 0.2,
                      ease: "easeInOut",
                    },
                  }}
                  key={option.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    option.onClick();
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer text-sm rounded-lg w-full text-left flex items-center gap-x-2 transition-colors ${
                    option.destructive ? "text-destructive hover:text-destructive" : ""
                  }`}
                >
                  {option.Icon}
                  {option.label}
                </motion.button>
              ))
            ) : (
              <div className="px-4 py-2 text-muted-foreground text-xs">No options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AnimatedDropdown };

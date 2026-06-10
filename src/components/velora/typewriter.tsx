"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface TypewriterProps extends React.HTMLAttributes<HTMLSpanElement> {
  words: string[];
  /** ms per typed character */
  typeSpeed?: number;
  /** ms per deleted character */
  deleteSpeed?: number;
  /** ms to hold a completed word */
  holdTime?: number;
  loop?: boolean;
  cursor?: boolean;
}

export function Typewriter({
  words,
  typeSpeed = 70,
  deleteSpeed = 40,
  holdTime = 1800,
  loop = true,
  cursor = true,
  className,
  ...props
}: TypewriterProps) {
  const reducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion || words.length === 0) return;
    const word = words[wordIndex % words.length];

    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < word.length) {
      timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), typeSpeed);
    } else if (!deleting && text.length === word.length) {
      const isLast = wordIndex === words.length - 1;
      if (loop || !isLast) {
        timeout = setTimeout(() => setDeleting(true), holdTime);
      }
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(word.slice(0, text.length - 1)), deleteSpeed);
    } else if (deleting) {
      timeout = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, deleteSpeed);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, holdTime, loop, reducedMotion]);

  if (reducedMotion) {
    return (
      <span className={cn(className)} {...props}>
        {words[0]}
      </span>
    );
  }

  return (
    <span data-slot="typewriter" className={cn(className)} {...props}>
      {text}
      {cursor && (
        <span aria-hidden className="animate-pulse font-light">
          |
        </span>
      )}
    </span>
  );
}

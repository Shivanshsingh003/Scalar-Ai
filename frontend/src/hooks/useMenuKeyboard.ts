"use client";

import { RefObject, useEffect } from "react";

interface UseMenuKeyboardOptions {
  open: boolean;
  menuRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  itemCount: number;
  onClose: () => void;
}

export function useMenuKeyboard({
  open,
  menuRef,
  triggerRef,
  itemCount,
  onClose,
}: UseMenuKeyboardOptions) {
  useEffect(() => {
    if (!open || itemCount === 0) return;

    const menu = menuRef.current;
    if (!menu) return;

    const items = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
    );

    items[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          items[(currentIndex + 1) % items.length]?.focus();
          break;
        case "ArrowUp":
          event.preventDefault();
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
          break;
        case "Home":
          event.preventDefault();
          items[0]?.focus();
          break;
        case "End":
          event.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case "Tab":
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, itemCount, menuRef, triggerRef, onClose]);
}

import { flushSync } from "react-dom";

// Runs a state update inside a same-document view transition when the browser supports it,
// and plainly otherwise (no support, or reduced motion). Returns the transition, or null.
export const withViewTransition = (update) => {
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        update();
        return null;
    }
    return document.startViewTransition(() => flushSync(update));
};

// The element that morphs between the project card and the modal gallery.
// Only one element may hold the name at a time, so callers hand it over inside the update.
export const HERO_NAME = "project-hero";

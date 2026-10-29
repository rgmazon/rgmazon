// Feeds the pointer position to the glass specular highlight and its lean (index.css reads --mx / --my and --lx / --ly).
// One delegated listener; hover-capable devices only.
export const initGlassLight = () => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let latest = null;

    document.addEventListener("pointermove", (e) => {
        const glass = e.target.closest?.(".glass-regular, .glass-clear, .glass-prominent");
        if (!glass) return;
        latest = { glass, x: e.clientX, y: e.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            const rect = latest.glass.getBoundingClientRect();
            latest.glass.style.setProperty("--mx", `${latest.x - rect.left}px`);
            latest.glass.style.setProperty("--my", `${latest.y - rect.top}px`);
            // -1..1 from the glass centre: the glass leans toward the pointer by up to --lean
            latest.glass.style.setProperty("--lx", ((latest.x - rect.left) / rect.width) * 2 - 1);
            latest.glass.style.setProperty("--ly", ((latest.y - rect.top) / rect.height) * 2 - 1);
        });
    }, { passive: true });
};

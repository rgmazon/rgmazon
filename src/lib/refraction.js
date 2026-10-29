// Opt in to the SVG-filter refraction layer. `backdrop-filter: url(#...)` only renders in Chromium
// (elsewhere it can drop the whole backdrop effect), so this is a deliberate engine check rather than
// a CSS @supports test, and it is limited to hover-capable desktops.
export const initRefraction = () => {
    const chromium = navigator.userAgentData?.brands?.some((b) => b.brand === "Chromium");
    if (chromium && matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.documentElement.dataset.refract = "";
    }
};

import { useEffect, useRef } from "react";

// Refraction for the `.refract` element (index.css `[data-refract]`, Chromium desktop only).
// The displacement map is drawn from the element's real size, so the bend follows the pill outline:
// inside a bezel along the edge the backdrop is pulled in from further inside the glass, strongest at the
// rim and fading to nothing (a thick convex lens). Red, green and blue are displaced by slightly different
// amounts, which gives the coloured fringe real glass shows at its edge.
const BEZEL = 18; // px of edge that acts as the lens
const MAX = 24; // px the backdrop shifts at the very edge
const DISPERSION = [1, 0.93, 0.86]; // R, G, B share of the shift

const drawMap = (w, h) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(w, h);
    const hw = w / 2;
    const hh = h / 2;
    const r = Math.min(hw, hh);

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const px = x + 0.5 - hw;
            const py = y + 0.5 - hh;
            // signed distance to the rounded rect and its outward normal
            const qx = Math.abs(px) - (hw - r);
            const qy = Math.abs(py) - (hh - r);
            const ox = Math.max(qx, 0);
            const oy = Math.max(qy, 0);
            const len = Math.hypot(ox, oy);
            const depth = r - len - Math.min(Math.max(qx, qy), 0); // distance in from the edge
            let nx = 0;
            let ny = 0;
            if (len > 0) {
                nx = (ox / len) * Math.sign(px);
                ny = (oy / len) * Math.sign(py);
            } else if (qx > qy) nx = Math.sign(px);
            else ny = Math.sign(py);

            const t = Math.min(Math.max(depth, 0) / BEZEL, 1);
            const m = (1 - t) ** 2; // 1 at the rim, 0 once past the bezel
            const i = (y * w + x) * 4;
            // sample from the inside: opposite the outward normal
            img.data[i] = 128 - 127 * nx * m;
            img.data[i + 1] = 128 - 127 * ny * m;
            img.data[i + 2] = 128;
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
    return canvas.toDataURL();
};

export const GlassDefs = () => {
    const root = useRef(null);

    useEffect(() => {
        const target = document.querySelector(".refract");
        if (!target || !("refract" in document.documentElement.dataset)) return;

        const feImage = root.current.querySelector("feImage");
        const displace = root.current.querySelectorAll("feDisplacementMap");
        const update = () => {
            const { width, height } = target.getBoundingClientRect();
            const w = Math.round(width);
            const h = Math.round(height);
            if (!w || !h) return;
            feImage.setAttribute("width", w);
            feImage.setAttribute("height", h);
            feImage.setAttribute("href", drawMap(w, h));
            displace.forEach((d, i) => d.setAttribute("scale", MAX * 2 * DISPERSION[i]));
        };

        const observer = new ResizeObserver(update);
        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    // keep one channel of each displaced copy, then add them back together
    const only = (r, g, b) => `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`;

    return (
        <svg ref={root} aria-hidden="true" width="0" height="0" className="absolute">
            <filter id="glass-refract" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
                <feImage x="0" y="0" preserveAspectRatio="none" result="map" />
                <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="dr" />
                <feColorMatrix in="dr" type="matrix" values={only(1, 0, 0)} result="r" />
                <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="dg" />
                <feColorMatrix in="dg" type="matrix" values={only(0, 1, 0)} result="g" />
                <feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="db" />
                <feColorMatrix in="db" type="matrix" values={only(0, 0, 1)} result="b" />
                <feBlend in="r" in2="g" mode="screen" result="rg" />
                <feBlend in="rg" in2="b" mode="screen" />
            </filter>
        </svg>
    );
};

// Layer 0: a fixed field of three slow colour orbs behind the whole page, so the glass above has
// colour to refract. Replaces the ~200 per-section dots. Colours and opacity live in index.css.
const orbs = [
    { "--orb-color": "var(--orb-1)", left: "-18%", top: "-20%", "--dx": "14vw", "--dy": "12vh", "--orb-dur": "55s" },
    { "--orb-color": "var(--orb-2)", right: "-22%", top: "18%", "--dx": "-12vw", "--dy": "14vh", "--orb-dur": "70s" },
    { "--orb-color": "var(--orb-3)", left: "8%", bottom: "-30%", "--dx": "16vw", "--dy": "-12vh", "--orb-dur": "62s" },
];

export const Backdrop = () => (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {orbs.map((style, i) => (
            <div key={i} className="orb" style={style} />
        ))}
    </div>
);

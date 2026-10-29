import { useEffect, useRef, useState } from "react";
import { Sun, Moon, User, LayoutGrid, Briefcase, CircleHelp, Mail } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// `icon` marks the items that also appear in the mobile dock (a tab bar holds about five).
const navLinks = [
    { href: "#about", label: "About", icon: User },
    { href: "#projects", label: "Projects", icon: LayoutGrid },
    { href: "#experience", label: "Experience", icon: Briefcase },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ", icon: CircleHelp },
    { href: "#contact", label: "Contact", icon: Mail },
];

const sectionIds = ["hero", ...navLinks.map((link) => link.href.slice(1))];

// The mobile dock's content is obscured by a fade so the glass sits over a predictable backdrop.
// (The top controls use no fade or scroll state: they stay the same translucent glass so content visibly passes under them.)
const dockFade = "linear-gradient(to top, color-mix(in srgb, var(--color-background) 96%, transparent) 55%, transparent)";

export const Navbar = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState(null);
    const [lens, setLens] = useState(null);
    const linksRef = useRef(null);
    const { isDarkMode, toggleTheme } = useTheme();

    // One scroll handler drives the dock's minimise-on-scroll and the active section.
    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;

        const update = () => {
            ticking = false;
            const y = window.scrollY;
            if (Math.abs(y - lastY) > 8) {
                setCollapsed(y > lastY && y > 120);
                lastY = y;
            }
            const line = window.innerHeight * 0.4;
            let current = null;
            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        const first = requestAnimationFrame(update);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            cancelAnimationFrame(first);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    // Slide the lens under the active desktop link. Re-measure on resize and once web fonts load.
    useEffect(() => {
        let raf;
        const measure = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const link = active && linksRef.current?.querySelector(`a[href="#${active}"]`);
                setLens(link ? { x: link.offsetLeft, w: link.offsetWidth } : null);
            });
        };
        measure();
        document.fonts?.ready.then(measure);
        window.addEventListener("resize", measure);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", measure);
        };
    }, [active]);

    const themeLabel = isDarkMode ? "Switch to light mode" : "Switch to dark mode";
    const ThemeIcon = isDarkMode ? Sun : Moon;

    return <>
        <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:px-5 focus:py-3 focus:rounded-full glass-prominent font-medium"
        >
            Skip to content
        </a>

        <div
            aria-hidden="true"
            className="md:hidden fixed inset-x-0 bottom-0 h-32 z-40 pointer-events-none"
            style={{ background: dockFade }}
        />

        <header className="fixed top-4 inset-x-0 z-50 pointer-events-none">

            {/* Desktop: one floating glass capsule */}
            <nav
                aria-label="Primary"
                className="hidden md:flex glass-live [--lean:2px] [--press:0.99] glass-regular glass-flat refract rounded-full pointer-events-auto w-fit mx-auto items-center gap-1 p-1.5 pl-6"
            >
                <a href="#hero" className="text-xl font-bold tracking-tight mr-3 rounded-full hover:text-primary">
                    RG<span className="text-primary">.</span>
                </a>

                <div ref={linksRef} className="relative flex items-center">
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 rounded-full bg-foreground/10 transition-[transform,width,opacity] duration-300 ease-out motion-reduce:transition-none"
                        style={{
                            width: lens?.w ?? 0,
                            transform: `translateX(${lens?.x ?? 0}px)`,
                            opacity: lens ? 1 : 0,
                        }}
                    />
                    {navLinks.map((link) => (
                        <a
                            href={link.href}
                            key={link.href}
                            aria-current={active === link.href.slice(1) ? "location" : undefined}
                            className={`relative px-4 py-2.5 text-sm rounded-full transition-colors ${active === link.href.slice(1) ? "text-foreground" : "text-foreground/80 hover:text-foreground"}`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <button
                    onClick={toggleTheme}
                    className="ml-1 size-11 grid place-items-center rounded-full hover:bg-foreground/10 transition-colors"
                    aria-label={themeLabel}
                >
                    <ThemeIcon className="w-5 h-5" />
                </button>
            </nav>

            {/* Mobile: logo and theme toggle on top, section nav in the bottom dock */}
            <div className="md:hidden flex items-center justify-between px-4">
                <a
                    href="#hero"
                    className="pointer-events-auto glass-regular glass-flat h-11 px-4 flex items-center text-xl font-bold tracking-tight rounded-full"
                >
                    RG<span className="text-primary">.</span>
                </a>
                <button
                    onClick={toggleTheme}
                    className="pointer-events-auto glass-regular glass-flat size-11 grid place-items-center rounded-full"
                    aria-label={themeLabel}
                >
                    <ThemeIcon className="w-5 h-5" />
                </button>
            </div>
        </header>

        <nav
            aria-label="Sections"
            className="md:hidden fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center pointer-events-none"
        >
            <div className={`glass-live [--lean:2px] [--press:0.98] glass-regular rounded-full pointer-events-auto flex items-center gap-1 transition-[padding,transform] duration-300 motion-reduce:transition-none ${collapsed ? "p-1" : "p-1.5"}`}>
                {navLinks.filter((link) => link.icon).map((link) => {
                    const isActive = active === link.href.slice(1);
                    return (
                        <a
                            href={link.href}
                            key={link.href}
                            aria-label={link.label}
                            aria-current={isActive ? "location" : undefined}
                            className={`min-w-11 min-h-11 px-3 flex flex-col items-center justify-center gap-0.5 rounded-full transition-colors ${isActive ? "bg-foreground/10 text-foreground" : "text-muted-foreground"}`}
                        >
                            <link.icon className="w-5 h-5" aria-hidden="true" />
                            <span
                                aria-hidden="true"
                                className={`text-[10px] leading-none overflow-hidden transition-all duration-300 motion-reduce:transition-none ${collapsed ? "max-h-0 opacity-0" : "max-h-3 opacity-100"}`}
                            >
                                {link.label}
                            </span>
                        </a>
                    );
                })}
            </div>
        </nav>
    </>
};

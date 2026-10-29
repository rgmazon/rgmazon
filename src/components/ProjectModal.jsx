import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { HERO_NAME } from "../lib/viewTransition";

// Native <dialog> + showModal(): the browser traps focus, makes the page inert, closes on Esc,
// and the top layer keeps it above everything. We only add scroll lock and focus restore.
const useModalDialog = () => {
    const ref = useRef(null);
    // Captured during the first render, while focus is still on whatever opened the dialog.
    const [opener] = useState(() => document.activeElement);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog.open) dialog.showModal();
        return () => opener?.focus?.();
    }, [opener]);

    return ref;
};

const mediaButton = "grid place-items-center rounded-full glass-clear";

const Lightbox = ({ media, index, title, onPrev, onNext, onClosed }) => {
    const ref = useModalDialog();
    const current = media[index];
    const close = () => ref.current.close();

    return (
        <dialog
            ref={ref}
            aria-label={`${title} gallery`}
            onClose={onClosed}
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
            className="fixed inset-0 m-0 p-0 w-screen h-screen max-w-none max-h-none bg-black text-white open:flex items-center justify-center"
        >
            <button
                onClick={close}
                data-tone="dark"
                className={`absolute top-4 right-4 size-12 z-10 ${mediaButton}`}
                aria-label="Close gallery"
            >
                <X className="w-6 h-6" aria-hidden="true" />
            </button>

            {media.length > 1 && (
                <>
                    <button onClick={onPrev} data-tone="dark" className={`absolute left-4 top-1/2 -translate-y-1/2 size-12 z-10 ${mediaButton}`} aria-label="Previous image">
                        <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <button onClick={onNext} data-tone="dark" className={`absolute right-4 top-1/2 -translate-y-1/2 size-12 z-10 ${mediaButton}`} aria-label="Next image">
                        <ChevronRight className="w-6 h-6" aria-hidden="true" />
                    </button>
                </>
            )}

            {current.type === "video" ? (
                <video src={current.src} autoPlay muted loop playsInline className="max-w-[95vw] max-h-[95vh] object-contain" />
            ) : (
                <img src={current.src} alt={`${title}, image ${index + 1} of ${media.length}`} className="max-w-[95vw] max-h-[95vh] object-contain" />
            )}

            {media.length > 1 && (
                <div data-tone="dark" className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-clear rounded-full px-4 py-2 text-sm" aria-live="polite">
                    {index + 1} / {media.length}
                </div>
            )}
        </dialog>
    );
};

const Carousel = ({ project }) => {
    const base = project.image ? [{ type: 'image', src: project.image }] : [];
    const extra = Array.isArray(project.moreImages)
        ? project.moreImages.map(src => ({ type: 'image', src }))
        : [];
    const video = project.video ? [{ type: 'video', src: project.video }] : [];
    const media = [...base, ...video, ...extra];
    const [index, setIndex] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + media.length) % media.length);
            if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % media.length);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [media.length]);

    if (!media.length) return null;

    const prev = (e) => { e.stopPropagation(); setIndex((i) => (i - 1 + media.length) % media.length); };
    const next = (e) => { e.stopPropagation(); setIndex((i) => (i + 1) % media.length); };
    const openFullscreen = (e) => { e.stopPropagation(); setFullscreen(true); };

    return (
        <>
            <div className="h-full w-full flex flex-col items-center justify-center">
                <div className="relative w-full h-full bg-black/5 rounded-lg overflow-hidden flex items-center justify-center group">
                    {media.map((item, i) => (
                        item.type === 'video' ? (
                            <video
                                key={i}
                                src={item.src}
                                autoPlay
                                muted
                                loop
                                playsInline
                                onClick={openFullscreen}
                                className={`absolute inset-0 m-auto max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out cursor-pointer ${
                                    i === index ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        ) : (
                            <img
                                key={i}
                                src={item.src}
                                alt={`${project.title} — image ${i + 1}`}
                                onClick={openFullscreen}
                                className={`absolute inset-0 m-auto max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out cursor-pointer ${
                                    i === index ? "opacity-100" : "opacity-0"
                                }`}
                                draggable={false}
                            />
                        )
                    ))}

                    {/* Controls float over the media as clear glass */}
                    <button
                        onClick={openFullscreen}
                        data-tone="dark"
                        className={`absolute top-3 right-3 size-11 ${mediaButton} opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity`}
                        aria-label="View fullscreen"
                    >
                        <Maximize2 className="w-4 h-4" aria-hidden="true" />
                    </button>

                    {media.length > 1 && (
                        <>
                            <button onClick={prev} data-tone="dark" className={`absolute left-3 top-1/2 -translate-y-1/2 size-11 z-10 ${mediaButton}`} aria-label="Previous image">
                                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button onClick={next} data-tone="dark" className={`absolute right-3 top-1/2 -translate-y-1/2 size-11 z-10 ${mediaButton}`} aria-label="Next image">
                                <ChevronRight className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {media.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto w-full">
                        {media.map((item, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                                aria-label={`Show image ${i + 1}`}
                                aria-current={i === index || undefined}
                                className={`flex-none w-20 rounded overflow-hidden border inline-flex items-center justify-center ${i === index ? 'ring-2 ring-primary' : 'border-border/40'}`}
                            >
                                {item.type === 'video' ? (
                                    <video src={item.src} className="max-h-12 max-w-full object-contain" muted />
                                ) : (
                                    <img src={item.src} alt="" className="max-h-12 max-w-full object-contain" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {fullscreen && (
                <Lightbox
                    media={media}
                    index={index}
                    title={project.title}
                    onPrev={prev}
                    onNext={next}
                    onClosed={() => setFullscreen(false)}
                />
            )}
        </>
    );
};

const ProjectModal = ({ project, onClose }) => {
    const { isDarkMode } = useTheme();
    const ref = useModalDialog();

    // Prevent background scrolling. Locking on <html> (not <body>) lets the scrollbar-gutter in index.css
    // keep the layout and viewport width unchanged, which a view transition needs.
    useEffect(() => {
        const rootStyle = document.documentElement.style;
        const prevOverflow = rootStyle.overflow;

        rootStyle.overflow = "hidden";
        document.body.classList.add("modal-hide-scrollbar");

        return () => {
            rootStyle.overflow = prevOverflow;
            document.body.classList.remove("modal-hide-scrollbar");
        };
    }, []);

    if (!project) return null;

    return (
        <dialog
            ref={ref}
            aria-labelledby="project-modal-title"
            // React's onClose bubbles through the component tree (the native event doesn't), so a gallery
            // closing inside this dialog would otherwise close the project too.
            onClose={(e) => { if (e.target === e.currentTarget) onClose(); }}
            // Take Esc over so the close runs as a view transition while the dialog is still open.
            onCancel={(e) => { if (e.target !== e.currentTarget) return; e.preventDefault(); onClose(); }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
            className={`fixed inset-0 m-0 p-6 w-full h-full max-w-none max-h-none bg-transparent text-foreground open:grid place-items-center backdrop:backdrop-blur-sm ${isDarkMode ? "backdrop:bg-black/50" : "backdrop:bg-white/40"}`}
        >
            {/* Matte panel: the glass lives on the controls floating over the media */}
            <div className="surface shadow-2xl w-full max-w-[1200px] max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-(--hairline) flex-none">
                    <h2 id="project-modal-title" className="text-lg font-semibold">{project.title}</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="size-11 grid place-items-center rounded-full bg-surface hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-4">
                    <div className="w-full rounded-lg overflow-hidden relative" style={{aspectRatio: '16/9', viewTransitionName: HERO_NAME}}>
                        <Carousel key={project.title} project={project} />
                    </div>

                    <p className="text-muted-foreground mt-2">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((t, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-surface text-sm border border-border/50 text-muted-foreground">
                                {t}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                        {project.link && project.link !== "#" && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 min-h-11 rounded-full glass-regular transition-transform motion-safe:hover:scale-105"
                            >
                                Live
                                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                                <span className="sr-only">(opens in a new tab)</span>
                            </a>
                        )}
                        {project.github && project.github !== "#" && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 min-h-11 rounded-full glass-regular transition-transform motion-safe:hover:scale-105"
                            >
                                Code
                                <Github className="w-4 h-4" aria-hidden="true" />
                                <span className="sr-only">(opens in a new tab)</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </dialog>
    );
};

export default ProjectModal;

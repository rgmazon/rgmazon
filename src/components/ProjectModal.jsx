import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Github, ChevronDown, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
        setIndex(0);
    }, [project]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + media.length) % media.length);
            if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % media.length);
            if (e.key === 'Escape' && fullscreen) setFullscreen(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [media.length, fullscreen]);

    if (!media.length) return null;

    const prev = (e) => { e.stopPropagation(); setIndex((i) => (i - 1 + media.length) % media.length); };
    const next = (e) => { e.stopPropagation(); setIndex((i) => (i + 1) % media.length); };
    const openFullscreen = (e) => { e.stopPropagation(); setFullscreen(true); };
    const closeFullscreen = (e) => { e.stopPropagation(); setFullscreen(false); };

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
                    
                    {/* Fullscreen button */}
                    <button 
                        onClick={openFullscreen}
                        className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" 
                        aria-label="Fullscreen"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Prev/Next controls */}
                    {media.length > 1 && (
                        <>
                            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full shadow-lg z-10" aria-label="Previous">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full shadow-lg z-10" aria-label="Next">
                                <ChevronRight className="w-4 h-4" />
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
                                className={`flex-none w-20 rounded overflow-hidden border inline-flex items-center justify-center ${i === index ? 'ring-2 ring-primary' : 'border-border/40'}`}
                            >
                                {item.type === 'video' ? (
                                    <video src={item.src} className="max-h-12 max-w-full object-contain" muted />
                                ) : (
                                    <img src={item.src} alt={`${project.title} — thumbnail ${i + 1}`} className="max-h-12 max-w-full object-contain" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {fullscreen && createPortal(
                <div 
                    className="fixed inset-0 bg-black z-[99999] flex items-center justify-center"
                    onClick={closeFullscreen}
                >
                    {/* Close button */}
                    <button 
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg z-10 backdrop-blur-sm transition-all"
                        aria-label="Close fullscreen"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Navigation in fullscreen */}
                    {media.length > 1 && (
                        <>
                            <button 
                                onClick={prev}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg z-10 backdrop-blur-sm transition-all"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={next}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg z-10 backdrop-blur-sm transition-all"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Current media item */}
                    {media[index].type === 'video' ? (
                        <video
                            src={media[index].src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-[95vw] max-h-[95vh] object-contain"
                        />
                    ) : (
                        <img
                            src={media[index].src}
                            alt={`${project.title} — fullscreen`}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-[95vw] max-h-[95vh] object-contain"
                        />
                    )}

                    {/* Index indicator */}
                    {media.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                            {index + 1} / {media.length}
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};

const ProjectModal = ({ project, onClose }) => {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Prevent background scrolling and avoid layout shift by compensating scrollbar
    useEffect(() => {
        const bodyStyle = document.body.style;
        const prevOverflow = bodyStyle.overflow;
        const prevPaddingRight = bodyStyle.paddingRight;
        const scrollBarCompensation = window.innerWidth - document.documentElement.clientWidth;

        bodyStyle.overflow = "hidden";
        document.body.classList.add("modal-hide-scrollbar");
        if (scrollBarCompensation > 0) {
            bodyStyle.paddingRight = `${scrollBarCompensation}px`;
        }

        return () => {
            bodyStyle.overflow = prevOverflow;
            bodyStyle.paddingRight = prevPaddingRight;
            document.body.classList.remove("modal-hide-scrollbar");
        };
    }, []);

    if (!project) return null;

    const modalContent = (
        <div
            className="fixed inset-0 flex items-center justify-center p-6"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
            style={{ zIndex: 9999 }}
        >
            <div
                className={`absolute inset-0 backdrop-blur-sm transition-colors ${isDarkMode ? 'bg-black/50' : 'bg-white/40'}`}
                style={{ zIndex: 9998 }}
            />


            <div
                className={`relative rounded-2xl shadow-2xl w-full max-w-[1200px] max-h-[90vh] flex flex-col ${
                    isDarkMode ? "bg-surface text-secondary-foreground" : "bg-white text-secondary-foreground"
                }`}
                style={{ transition: "width .25s, height .25s", zIndex: 10000 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal header (not in scrollable area) */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 rounded-t-2xl flex-none">
                    <div className="text-lg font-semibold">{project.title}</div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="bg-surface glass rounded-full p-2 shadow-lg hover:scale-105 transform transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal body - scrollable only */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                        {/* Carousel: uses project.moreImages if present, otherwise shows project.image */}
                        <div className="w-full rounded-lg overflow-hidden relative" style={{aspectRatio: '16/9'}}>
                            <Carousel project={project} />
                        </div>

                    <div>
                        <p className="text-muted-foreground mt-2">{project.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((t, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-surface-2 text-sm border">
                                {t}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                Live
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        )}
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                Code
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
            
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ProjectModal;

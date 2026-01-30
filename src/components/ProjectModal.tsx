import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Github, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Define the shape of your Project data
export interface Project {
  title: string;
  description: string;
  image?: string;
  moreImages?: string[];
  tags: string[];
  link?: string;
  github?: string;
}

interface CarouselProps {
  project: Project;
}

const Carousel: React.FC<CarouselProps> = ({ project }) => {
  const base = project.image ? [project.image] : [];
  const extra = Array.isArray(project.moreImages) ? project.moreImages : [];
  const images = [...base, ...extra];
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    setIndex(0);
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [images.length]);

  if (!images.length) return null;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="relative w-full h-full bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${project.title} — image ${i + 1}`}
            className={`absolute inset-0 m-auto max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full shadow-lg" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full shadow-lg" aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto w-full">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setIndex(i); }}
              className={`flex-none w-20 rounded overflow-hidden border inline-flex items-center justify-center ${i === index ? 'ring-2 ring-primary' : 'border-border/40'}`}
            >
              <img src={src} alt={`${project.title} — thumbnail ${i + 1}`} className="max-h-12 max-w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
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

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="w-full rounded-lg overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
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
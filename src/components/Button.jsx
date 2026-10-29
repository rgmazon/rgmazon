export const Button = ({ className = "", size = "default", children, ...prop }) => {

    // Brand-tinted glass: the one prominent control per view. Keyboard focus uses the global outline.
    const baseClasses = "relative inline-block [--press:1] text-center overflow-hidden rounded-full font-medium glass-prominent transition-transform motion-safe:hover:scale-105 motion-safe:active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";

    const sizeClasses = {
        sm: "px-4 py-2 text-sm",
        default: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;

    // Renders a link when given an href, so we never nest a button inside an anchor.
    const Tag = prop.href ? "a" : "button";

    return (
        <Tag className={classes} {...prop}>
            <span className="relative flex items-center justify-center gap-2">
                {children}
            </span>
        </Tag>
    );
};
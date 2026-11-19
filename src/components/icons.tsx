import type { ReactNode, SVGProps } from "react";

/**
 * The site's one icon set: 24px grid, 1.5px stroke, square caps and mitred
 * joins to match the square components. Icons size to the text (1em) and take
 * the text colour, so `className="h-4 w-4 text-vermillion"` works as expected.
 * Pass `title` when an icon carries meaning on its own; otherwise it is hidden
 * from screen readers.
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const ArrowUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20V5M6 11l6-6 6 6" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Upload = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 16V5M7 10l5-5 5 5M5 20h14" />
  </Svg>
);

export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </Svg>
);

/** Rating star. Filled by default because a row of them reads as a score. */
export const Star = ({ fill = "currentColor", ...p }: IconProps) => (
  <Svg fill={fill} {...p}>
    <path d="M12 3.5l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L12 16.8l-5.3 2.9 1.2-5.9-4.5-4.1 6-.7z" />
  </Svg>
);

/** The studio's mark: used for suggestions in the try-on and for empty image slots. */
export const Sparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c.7 4.7 3.3 7.3 8 8-4.7.7-7.3 3.3-8 8-.7-4.7-3.3-7.3-8-8 4.7-.7 7.3-3.3 8-8z" />
  </Svg>
);

export const MapPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-7-6-7-11.5a7 7 0 0114 0C19 15 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 5.5h17v15h-17zM3.5 10h17M8 3v4M16 3v4" />
  </Svg>
);

export const Bag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12.5H6zM9 8V6.5a3 3 0 016 0V8" />
  </Svg>
);

export const ImageIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 4.5h17v15h-17z" />
    <circle cx="9" cy="10" r="1.75" />
    <path d="M20.5 15.5l-5-5-9.5 9" />
  </Svg>
);

const INLINE = "inline-block h-[1em] w-[1em] align-[-0.15em]";

/** Arrow that trails link text ("Read more", "View collection"). */
export const TrailingArrow = () => <ArrowRight className={`ml-1.5 ${INLINE}`} />;

/** Arrow that leads back-link text ("Back to shop"). */
export const LeadingArrow = () => <ArrowLeft className={`mr-1.5 ${INLINE}`} />;

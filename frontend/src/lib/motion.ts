export const MOTION_DURATION = 0.28;
export const MOTION_DURATION_PAGE = 0.35;
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export const transition = {
  duration: MOTION_DURATION,
  ease: MOTION_EASE,
};

export const pageTransition = {
  duration: MOTION_DURATION_PAGE,
  ease: MOTION_EASE,
};

export const pageSlide = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 32 : -32,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -24 : 24,
  }),
};

export const pageSlideReduced = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition,
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const hoverLift = {
  whileHover: { y: -3, transition: { duration: 0.25 } },
  whileTap: { scale: 0.985, transition: { duration: 0.2 } },
};

export const pressable = {
  whileHover: { scale: 1.01, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98, transition: { duration: 0.15 } },
};

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.94, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.94, y: 16 },
  transition,
};

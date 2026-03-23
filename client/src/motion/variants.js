// Page entry — every page uses this
export const pageVariants = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0,
              transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:     { opacity: 0, y: -8,
              transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }
};

// Card / list item stagger
export const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

// Modal / drawer pop
export const modalVariants = {
  initial:  { opacity: 0, scale: 0.95, y: 8 },
  animate:  { opacity: 1, scale: 1,    y: 0,
              transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } },
  exit:     { opacity: 0, scale: 0.95, y: 8,
              transition: { duration: 0.15 } }
};

// Sidebar slide-in
export const sidebarVariants = {
  closed: { x: -220, opacity: 0 },
  open:   { x: 0,    opacity: 1,
            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

// Number counter (for stat cards)
export const countVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1,
             transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }
};

// Toast slide-in from right
export const toastVariants = {
  initial: { opacity: 0, x: 60,  scale: 0.95 },
  animate: { opacity: 1, x: 0,   scale: 1,
             transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, x: 40,  scale: 0.95,
             transition: { duration: 0.2 } }
};

// Chat bubble pop-in
export const bubbleVariants = {
  initial: { opacity: 0, scale: 0.85, y: 6 },
  animate: { opacity: 1, scale: 1,    y: 0,
             transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] } }
};

// Simple fade-in and up for Pricing Cards
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, 
             transition: { duration: 0.5, ease: "easeOut" } }
};

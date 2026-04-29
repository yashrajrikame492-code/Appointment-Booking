// Professional animation system using Framer Motion

// =======================
// 🟢 Fade + Slide (Cards, Sections)
// =======================
export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// =======================
// 🟢 Fade In (Simple)
// =======================
export const fadeIn = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// =======================
// 🟢 Stagger Container (Parent)
// =======================
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// =======================
// 🟢 Card Hover Effect (Premium UI)
// =======================
export const cardHover = {
  scale: 1.04,
  y: -5,
  boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.15)",
  transition: {
    type: "spring",
    stiffness: 300
  }
};

// =======================
// 🟢 Button Hover + Tap
// =======================
export const buttonHover = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 400
  }
};

export const buttonTap = {
  scale: 0.95
};

// =======================
// 🟢 Page Transition (Route Change)
// =======================
export const pageTransition = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

// =======================
// 🟢 Scale In (Modals, Cards)
// =======================
export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// =======================
// 🟢 Slide from Left (Sidebar)
// =======================
export const slideInLeft = {
  hidden: {
    x: -100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

// =======================
// 🟢 Slide from Right
// =======================
export const slideInRight = {
  hidden: {
    x: 100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};



// =======================
// 🟢 Floating Effect (Subtle UI)
// =======================
export const floating = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
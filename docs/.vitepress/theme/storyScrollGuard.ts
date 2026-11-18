let guardUntil = 0;
let readerMoved = false;
let lastScrollY = 0;
let listening = false;

const markReader = () => (readerMoved = true);

const onScroll = () => {
  if (!readerMoved && Date.now() < guardUntil) window.scrollTo(0, lastScrollY);
  else lastScrollY = window.scrollY;
};

export const armScrollGuard = () => {
  if (window.location.hash || Date.now() < guardUntil) return;
  guardUntil = Date.now() + 5000;
  readerMoved = false;
  lastScrollY = window.scrollY;
  if (listening) return;
  listening = true;
  for (const type of ["wheel", "touchmove", "keydown", "pointerdown"])
    window.addEventListener(type, markReader, { passive: true, capture: true });
  window.addEventListener("scroll", onScroll, { passive: true });
};

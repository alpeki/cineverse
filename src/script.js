import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".category-list li");

  if (!items.length) {
    console.warn("⚠️ No .category-list items found — skipping GSAP animation");
    return;
  }

  const customEase = CustomEase.create("custom", "M0,0 C0.548,0.032 0.63,1 1,1");

  const introTween = gsap.timeline({ defaults: { duration: 0.48 } })
    .to(items, {
      "--stop-active": "100%",
      stagger: { each: 0.1, ease: customEase }
    })
    .to(items, {
      "--stop-hover": "100%",
      stagger: { each: 0.1 }
    })
    .to(items, {
      "--stop-hover": "0%",
      stagger: { each: -0.1 }
    }, "-=0.1");

  gsap.set(items, { "--stop-hover": "0%" });

  // Hover animasyonu
  items.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      gsap.to(this, { "--stop-hover": "100%", ease: customEase, duration: 0.36 });
    });

    item.addEventListener("mouseleave", function () {
      gsap.to(this, { "--stop-hover": "0%", ease: customEase, duration: 0.36 });
    });

    // Smooth scroll
    item.addEventListener("click", () => {
      const target = item.getAttribute("data-target");
      if (target) document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
  });
});

import "../App.css";
import bgImage from "../assets/hero.png";
import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
const cards = [
  {
    title: "Upload Your Report",
    desc: "Securely upload your medical report.",
    color: "rgba(200, 247, 184, 0.55)",
  },
  {
    title: "Analysis",
    desc: "Extract and analyze health parameters.",
    color: "rgba(255, 197, 197, 0.55)",
  },
  {
    title: "Personalized Guidance",
    desc: "Understand results with clear recommendations.",
    color: "rgba(255, 247, 168, 0.55)",
  },
  {
    title: "Visual Insights",
    desc: "View health scores and interactive charts.",
    color: "rgba(191, 226, 255, 0.55)",
  },
];
export default function LandingPage() {
 const [selectedIndex, setSelectedIndex] = useState(0);

const [emblaRef, emblaApi] = useEmblaCarousel({
  loop: false,
  align: "center",
  containScroll: "keepSnaps",
  dragFree: false,
});

const onSelect = useCallback(() => {
  if (!emblaApi) return;
  setSelectedIndex(emblaApi.selectedScrollSnap());
}, [emblaApi]);

useEffect(() => {
  if (!emblaApi) return;

  onSelect();
  emblaApi.on("select", onSelect);

  return () => emblaApi.off("select", onSelect);
}, [emblaApi, onSelect]);

const carouselRef = useRef(null);

const scrollToCarousel = () => {
  carouselRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

useEffect(() => {
  if (!emblaApi) return;

  let interval;

  const startAutoPlay = () => {
    interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 2500);
  };

  startAutoPlay();

  return () => clearInterval(interval);
}, [emblaApi]);
  return (
    
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
          backgroundImage: `linear-gradient(
      rgba(255,255,255,0.88),
      rgba(255,255,255,0.88)
    ),
    url(${bgImage})`,
}}
    >
      {/* Navbar */}
      <nav className="flex justify-between items-center px-[60px] pt-8 pb-4">
        <h1 className="text-3xl font-semibold text-[#183B2D]">LabLens</h1>

        <div className="flex gap-10 text-[#183B2D] font-medium">
          <Link to="/login">LOGIN</Link>

<Link to="/signup">SIGNUP</Link>
        </div>
      </nav>

      <hr className="mx-12 border-[#183B2D]" />

      {/* Hero */}
      <section className="relative px-[60px] pt-[90px] pb-[140px]">

  {/* Heading */}
  <h1 className="anton-heading text-[80px] leading-[0.9] tracking-tight text-[#1E382B] max-w-[900px]">
    Understand your medical
    <br />
    reports in seconds.
  </h1>

  {/* Description */}
  <p className="mt-8 pr-[20px] text-[24px] leading-[1.45] text-[#6A847B]">
    Understanding your health shouldn’t be complicated. Upload your reports and
    receive clear explanations, visual summaries, and personalized insights in
    seconds.
  </p>

<div className="mt-12 flex items-center justify-start gap-[100px] w-full pr-[80px]">

  {/* How it works */}

  {/* Get Started */}
  <button
    className="w-[260px] h-[60px]
               rounded
               bg-[#1E382B]
               text-white
               text-[18px]
               font-semibold
               shadow-md
               hover:bg-[#93B09E]
               transition"
  >
    GET STARTED
  </button>

  <button
    onClick={scrollToCarousel}
    className="w-[240px] h-[58px]
               rounded-full
               border border-[#183B2D]
               text-[18px]
               font-medium
               text-[#183B2D]
               flex items-center justify-center gap-4
               hover:bg-[#183B2D]
               hover:text-white
               transition"
  >
    How it works?
    <span className="text-[22px]">→</span>
  </button>

  

</div>

</section>

<section
  ref={carouselRef}
  className="mt-24 pb-6"
>

  <div className="overflow-hidden" ref={emblaRef}>
    <div className="flex">

      {cards.map((card, index) => {

        const active = index === selectedIndex;

        return (

          <div
            key={index}
            className="flex-[0_0_100%] flex justify-center"
          >

            <motion.div
            
  className={`
    ${card.bg}
    w-[700px]
    h-[360px]
    rounded-[32px]
    border border-white/30
    backdrop-blur-2xl
    shadow-2xl
    flex
    flex-col
    justify-center
    items-center
    px-16
  `}

              animate={{
                scale: active ? 1 : 0.82,
                opacity: active ? 1 : 0.25,
                filter: active ? "blur(0px)" : "blur(3px)",
              }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
              }}
              className="w-[580px] h-[300px] rounded-[px] shadow-xl flex flex-col justify-center items-center px-12"
              style={{
                backgroundColor: card.color,
              }}
            >
              <h2 className="text-[28px] font-bold text-[#183B2D]">
  {card.title}
</h2>

<p className="mt-5 text-[18px] text-center text-[#6A847B] max-w-[420px] leading-relaxed">
  {card.desc}
</p>

            </motion.div>

          </div>

        );
      })}

    </div>
  </div>

</section>
<div className="flex justify-center gap-3 mt-4 mb-4">
  {cards.map((_, index) => (
    <button
      key={index}
      onClick={() => emblaApi?.scrollTo(index)}
      className={`h-3 rounded-full transition-all ${
        selectedIndex === index
          ? "w-10 bg-[#183B2D]"
          : "w-3 bg-gray-300"
      }`}
    />
  ))}
</div>


      {/* Footer */}
      <footer className="bg-[#183B2D] text-white px-16 py-14">

  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">

    {/* Logo & About */}
    <div className="max-w-sm">
      <h2 className="text-3xl font-semibold">LabLens</h2>

      <p className="mt-5 text-[#C8D7D0] leading-relaxed">
        Simplifying medical reports with AI-powered insights,
        clear explanations, and personalized health guidance.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-5">
        Quick Links
      </h3>

      <ul className="space-y-3 text-[#C8D7D0]">
        <li>
          <a href="#" className="hover:text-white transition">
            Home
          </a>
        </li>

        <li>
          <a href="#" className="hover:text-white transition">
            How it Works
          </a>
        </li>

        <li>
          <a href="#" className="hover:text-white transition">
            Login
          </a>
        </li>

        <li>
          <a href="#" className="hover:text-white transition">
            Sign Up
          </a>
        </li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-lg font-semibold mb-5">
        Contact
      </h3>

      <p className="text-[#C8D7D0]">
        hello@lablens.ai
      </p>

      <p className="mt-2 text-[#C8D7D0]">
        Pune, India
      </p>
    </div>

  </div>

  <hr className="my-10 border-white/20" />

  <div className="flex flex-col md:flex-row justify-between items-center text-[#AFC1B9] text-sm">

    <p>
      © 2026 LabLens. All rights reserved.
    </p>

    <div className="flex gap-6 mt-4 md:mt-0">
      <a href="#" className="hover:text-white transition">
        Privacy
      </a>

      <a href="#" className="hover:text-white transition">
        Terms
      </a>

      <a href="#" className="hover:text-white transition">
        GitHub
      </a>
    </div>

  </div>

</footer>
    </div>
  );
}
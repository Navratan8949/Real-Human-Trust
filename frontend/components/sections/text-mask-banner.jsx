"use client"

import { Reveal } from "@/components/shared/reveal"

export function TextMaskBanner() {
  return (
    <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-[#040914] py-10">
      <Reveal>
        <div className="mx-auto w-full max-w-[100vw] px-4 text-center">
          {/* 
            Using a massive, thick sans-serif font is crucial for text-mask effects 
            so the image inside is actually visible. 
          */}
          <h2
            className="bg-[url('/hero-community-education-india.png')] bg-cover bg-fixed bg-center bg-no-repeat bg-clip-text font-sans text-[18vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent md:text-[16vw]"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.5))"
            }}
          >
            HUMANITY
          </h2>

          <p className="mt-8 font-sans text-sm font-bold uppercase tracking-[0.4em] text-accent sm:text-lg">
            Empowering Lives • Shaping Futures
          </p>
        </div>
      </Reveal>
    </section>
  )
}



// "use client"

// import { useRef } from "react"
// import { motion, useScroll, useTransform } from "framer-motion"
// import { Reveal } from "@/components/shared/reveal"

// export function TextMaskBanner() {
//   const containerRef = useRef(null)
  
//   // Track scroll progress of this specific section
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"]
//   })

//   // Create smooth scroll-driven values
//   const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1])
//   const y = useTransform(scrollYProgress, [0, 1], [100, -100])
//   const letterSpacing = useTransform(scrollYProgress, [0, 1], ["-0.05em", "0.05em"])

//   return (
//     <section ref={containerRef} className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#040914] py-16">
//       <div className="mx-auto w-full max-w-[100vw] px-4 text-center">
//         <motion.div style={{ y, scale }}>
//           <motion.h2
//             className="bg-[url('/hero-community-education-india.png')] bg-cover bg-fixed bg-center bg-no-repeat bg-clip-text font-sans text-[18vw] font-black uppercase leading-[0.85] text-transparent md:text-[16vw]"
//             style={{ 
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.7))",
//               letterSpacing
//             }}
//           >
//             HUMANITY
//           </motion.h2>
//         </motion.div>
        
//         <Reveal>
//           <p className="mt-8 font-sans text-sm font-bold uppercase tracking-[0.4em] text-accent sm:text-lg">
//             Empowering Lives • Shaping Futures
//           </p>
//         </Reveal>
//       </div>
//     </section>
//   )
// }

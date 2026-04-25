"use client";

import { FC, useRef } from "react";
import { asText, Content } from "@prismicio/client";
import {
  PrismicRichText,
  PrismicText,
  SliceComponentProps,
} from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import { PrismicNextImage } from "@prismicio/next";
import { FadeIn } from "@/components/FadeIn";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, Draggable, ScrollTrigger);

export type BentoBoxProps = SliceComponentProps<Content.BentoBoxSlice>;

const CARD_SPACING = 0.16;

const BentoBox: FC<BentoBoxProps> = ({ slice }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsFrameRef = useRef<HTMLUListElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLLIElement[]>([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const gallery = galleryRef.current;
      const cardsFrame = cardsFrameRef.current;
      const dragProxy = dragProxyRef.current;

      if (!section || !gallery || !cardsFrame || !dragProxy) {
        return;
      }

      const nextButtons = section.querySelectorAll<HTMLButtonElement>(
        "[data-bento-nav='next']",
      );
      const prevButtons = section.querySelectorAll<HTMLButtonElement>(
        "[data-bento-nav='prev']",
      );
      const cards = cardRefs.current.filter(Boolean);

      if (
        nextButtons.length === 0 ||
        prevButtons.length === 0 ||
        cards.length === 0
      ) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(cardsFrame, { perspective: 1200 });
        gsap.set(cards, {
          xPercent: 280,
          opacity: 0,
          scale: 0,
          rotateY: -28,
          rotateX: 10,
          transformOrigin: "50% 50% -320px",
        });

        const animateCard = (element: HTMLElement) => {
          const image = element.querySelector(".bento-slider-image");
          const glow = element.querySelector(".bento-slider-glow");
          const copy = element.querySelector(".bento-slider-copy");
          const tl = gsap.timeline();

          tl.fromTo(
            element,
            {
              scale: 0.72,
              opacity: 0,
              rotateY: -30,
              rotateX: 12,
              z: -260,
            },
            {
              scale: 1,
              opacity: 1,
              rotateY: 0,
              rotateX: 0,
              z: 0,
              zIndex: 100,
              duration: 0.55,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
              immediateRender: false,
            },
          ).fromTo(
            element,
            { xPercent: 260 },
            {
              xPercent: -260,
              duration: 1.2,
              ease: "none",
              immediateRender: false,
            },
            0,
          );

          if (image) {
            tl.fromTo(
              image,
              { scale: 1.18 },
              {
                scale: 1,
                duration: 0.6,
                yoyo: true,
                repeat: 1,
                ease: "sine.inOut",
                immediateRender: false,
              },
              0,
            );
          }

          if (glow) {
            tl.fromTo(
              glow,
              { opacity: 0.15 },
              {
                opacity: 0.45,
                duration: 0.45,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                immediateRender: false,
              },
              0,
            );
          }

          if (copy) {
            tl.fromTo(
              copy,
              { yPercent: 12, opacity: 0.2 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.45,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
                immediateRender: false,
              },
              0.08,
            );
          }

          return tl;
        };

        const seamlessLoop = buildSeamlessLoop(
          cards,
          CARD_SPACING,
          animateCard,
        );
        const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
        const snapTime = gsap.utils.snap(CARD_SPACING);
        const playhead = { offset: 0 };
        const state = {
          autoplayOffset: 0,
          scrollOffset: 0,
          interactiveOffset: 0,
        };
        const updateOffset = () => {
          const totalOffset =
            state.autoplayOffset + state.scrollOffset + state.interactiveOffset;

          scrub.vars.offset = totalOffset;
          scrub.invalidate().restart();
        };
        const autoplay = () => {
          state.autoplayOffset += 0.0018;
          updateOffset();
        };

        const scrub = gsap.to(playhead, {
          offset: 0,
          duration: 0.45,
          ease: "power3.out",
          paused: true,
          onUpdate: () => {
            seamlessLoop.time(wrapTime(playhead.offset));
          },
        });

        gsap.ticker.add(autoplay);

        const scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          onUpdate: (self) => {
            state.scrollOffset =
              self.progress * cards.length * CARD_SPACING * 1.75;
            updateOffset();
          },
        });

        const moveToOffset = (offset: number) => {
          state.interactiveOffset = snapTime(offset);
          updateOffset();
        };

        const handleNext = () => {
          moveToOffset(state.interactiveOffset + CARD_SPACING);
        };

        const handlePrev = () => {
          moveToOffset(state.interactiveOffset - CARD_SPACING);
        };

        nextButtons.forEach((button) => {
          button.addEventListener("click", handleNext);
        });
        prevButtons.forEach((button) => {
          button.addEventListener("click", handlePrev);
        });

        const draggable = Draggable.create(dragProxy, {
          type: "x",
          trigger: cardsFrame,
          onPress() {
            gsap.ticker.remove(autoplay);
            (this as Draggable & { startOffset: number }).startOffset =
              state.interactiveOffset;
          },
          onDrag() {
            const draggableInstance = this as Draggable & {
              startOffset: number;
            };
            moveToOffset(
              draggableInstance.startOffset +
                (draggableInstance.startX - draggableInstance.x) * 0.0012,
            );
          },
          onDragEnd() {
            gsap.ticker.add(autoplay);
          },
        })[0];

        return () => {
          gsap.ticker.remove(autoplay);
          scrollTrigger.kill();
          nextButtons.forEach((button) => {
            button.removeEventListener("click", handleNext);
          });
          prevButtons.forEach((button) => {
            button.removeEventListener("click", handlePrev);
          });
          draggable?.kill();
          scrub.kill();
          seamlessLoop.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, {
          clearProps: "all",
          opacity: 1,
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <Bounded className="relative overflow-hidden" innerClassName="max-w-none">
      <section
        ref={sectionRef}
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="relative"
      >
        <FadeIn className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
            <h2
              id="features"
              className="font-bold-slanted max-w-4xl scroll-pt-6 text-5xl tracking-tight uppercase md:text-8xl"
            >
              <PrismicText field={slice.primary.heading} />
            </h2>

            <p className="max-w-md text-sm tracking-[0.24em] text-white/55 uppercase">
              Scroll or drag the cards. This slider is scoped only to the Bento
              section, so it will not interfere with the Hero animation.
            </p>
          </div>
        </FadeIn>

        <div
          ref={galleryRef}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.24),transparent_36%),linear-gradient(180deg,rgba(17,17,19,0.98),rgba(8,8,10,0.98))] shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_22%,transparent_70%,rgba(255,255,255,0.05))]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />

          <div className="relative flex min-h-[88svh] flex-col justify-between px-5 py-6 md:px-10 md:py-10">
            <div className="flex items-center justify-between gap-4">
              <div className="max-w-sm">
                <p className="text-xs tracking-[0.38em] text-red-300/70 uppercase">
                  Infinite Card Slider
                </p>
                <p className="mt-3 max-w-md text-sm text-white/70 md:text-base">
                  A stacked display wall where each feature card slides out from
                  inside the screen and loops seamlessly without affecting the
                  rest of the homepage scroll.
                </p>
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <button
                  data-bento-nav="prev"
                  type="button"
                  className="font-bold-slanted cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm tracking-[0.2em] text-white uppercase transition hover:border-red-300/40 hover:bg-red-400/10"
                >
                  Prev
                </button>
                <button
                  data-bento-nav="next"
                  type="button"
                  className="font-bold-slanted cursor-pointer rounded-full border border-red-300/35 bg-red-400/10 px-4 py-2 text-sm tracking-[0.2em] text-white uppercase transition hover:bg-red-400/20"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="relative flex-1">
              <ul
                ref={cardsFrameRef}
                className="absolute top-1/2 left-1/2 h-[24rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 md:h-[30rem] md:w-[20rem]"
              >
                {slice.primary.items.map((item, index) => (
                  <li
                    key={`${asText(item.text)}-${index}`}
                    ref={(element) => {
                      if (element) {
                        cardRefs.current[index] = element;
                      }
                    }}
                    className="bento-slider-card absolute top-0 left-0 h-[24rem] w-[16rem] list-none overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#121214] shadow-[0_24px_60px_rgba(0,0,0,0.45)] md:h-[30rem] md:w-[20rem]"
                  >
                    <PrismicNextImage
                      field={item.image}
                      className="bento-slider-image h-full w-full object-cover"
                      quality={96}
                      width={900}
                    />

                    <div className="bento-slider-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.26),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.88),rgba(0,0,0,0.16)_55%,rgba(0,0,0,0.04))]" />
                    <div className="pointer-events-none absolute inset-3 rounded-[1.2rem] border border-white/12" />

                    <div className="bento-slider-copy absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full border border-red-300/35 bg-red-400/10 px-3 py-1 text-[10px] tracking-[0.32em] text-red-100/90 uppercase">
                          {item.size}
                        </span>
                        <span className="h-px flex-1 bg-white/15" />
                      </div>

                      <div className="text-base leading-relaxed text-pretty text-white md:text-lg">
                        <PrismicRichText field={item.text} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
              <button
                data-bento-nav="prev"
                type="button"
                className="font-bold-slanted cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm tracking-[0.2em] text-white uppercase transition hover:border-red-300/40 hover:bg-red-400/10"
              >
                Prev
              </button>
              <button
                data-bento-nav="next"
                type="button"
                className="font-bold-slanted cursor-pointer rounded-full border border-red-300/35 bg-red-400/10 px-4 py-2 text-sm tracking-[0.2em] text-white uppercase transition hover:bg-red-400/20"
              >
                Next
              </button>
            </div>
          </div>

          <div
            ref={dragProxyRef}
            className="invisible absolute top-0 left-0 h-2 w-2"
          />
        </div>
      </section>
    </Bounded>
  );
};

export default BentoBox;

function buildSeamlessLoop(
  items: HTMLElement[],
  spacing: number,
  animateCard: (element: HTMLElement) => gsap.core.Timeline,
) {
  const overlap = Math.ceil(1 / spacing);
  const startTime = items.length * spacing + 0.5;
  const loopTime = (items.length + overlap) * spacing + 1;
  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      const timeline = this as gsap.core.Timeline & {
        _dur: number;
        _tTime: number;
        _time: number;
      };

      if (timeline._time === timeline._dur) {
        timeline._tTime += timeline._dur - 0.01;
      }
    },
  });

  const total = items.length + overlap * 2;

  for (let i = 0; i < total; i += 1) {
    const index = i % items.length;
    const time = i * spacing;

    rawSequence.add(animateCard(items[index]), time);

    if (i <= items.length) {
      seamlessLoop.add(`label${i}`, time);
    }
  }

  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: "none",
    })
    .fromTo(
      rawSequence,
      { time: overlap * spacing + 1 },
      {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: "none",
      },
    );

  return seamlessLoop;
}

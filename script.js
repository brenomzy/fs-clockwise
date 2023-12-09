const totalStaggerTime = document.querySelectorAll("[fade-in]").length * 0.15;

gsap.fromTo(
"[fade-in]",
{ opacity: 0 },
{
    opacity: 1,
    duration: 1,
    ease: "power1.out",
    stagger: 0.15
}
);

gsap.to({}, {
duration: 0.85,
onComplete: () => document.querySelector('.marker').classList.add('marker-animate')
});



function createPillAnimation(pillContainerClass, pillClass) {
let pillContainer = document.querySelector(pillContainerClass);
let pills = gsap.utils.toArray(pillContainerClass + ' ' + pillClass);
let firstPillClone = pills[0].cloneNode(true);
pillContainer.appendChild(firstPillClone);

pills = gsap.utils.toArray(pillContainerClass + ' ' + pillClass);

let tl = gsap.timeline({
repeat: -1,
paused: true,
onComplete: () => tl.restart()
});

let pillTotalHeight = 45 + 4;

for (let i = 0; i < pills.length - 1; i++) {
tl.to(pills, { y: `-=${pillTotalHeight}`, duration: 1 }, `+=${i === 0 ? 0 : 1}`);
}

tl.to({}, {}, `+=1`);

return tl;
}

let tlFirstPill = createPillAnimation('.first-pill-container', '.first-pill-shape');
let tlSecondPill = createPillAnimation('.second-pill-container', '.second-pill-shape');

let tl = gsap.timeline({
scrollTrigger: {
trigger: ".scrolltext_trigger",
start: "top bottom",
end: "80% bottom",
scrub: true,
onUpdate: self => {
    // console.log(self.progress);

    if (self.progress > 0.12081128747795414) {
    if (tlFirstPill.paused()) {
        gsap.to('.first-pill-container', { opacity: 1 });
        tlFirstPill.play();
    }
    } else {
    if (!tlFirstPill.paused()) {
        gsap.to('.first-pill-container', { opacity: 0.2 });
        tlFirstPill.pause();
    }
    }

    if (self.progress > 0.8336252189141856) {
    if (tlSecondPill.paused()) {
        gsap.to('.second-pill-container', { opacity: 1 });
        tlSecondPill.play();
    }
    } else {
    if (!tlSecondPill.paused()) {
        gsap.to('.second-pill-container', { opacity: 0.2 });
        tlSecondPill.pause();
    }
    }
}
}
});

tl.from(".set-1", { color: "#316558", stagger: 0.5 })
.from(".set-2", { color: "#316558", stagger: 0.5 })
.from(".set-3", { color: "#316558", stagger: 0.5 })
.from(".set-4", { color: "#316558", stagger: 0.5 })
.from(".set-5", { color: "#316558", stagger: 0.5 })
.from(".set-6", { color: "#316558", stagger: 0.5 });


// MARQUEE POWER-UP
window.addEventListener("DOMContentLoaded", (event) => {
function attr(defaultVal, attrVal) {
const defaultValType = typeof defaultVal;
if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
if (attrVal === "true" && defaultValType === "boolean") return true;
if (attrVal === "false" && defaultValType === "boolean") return false;
if (isNaN(attrVal) && defaultValType === "string") return attrVal;
if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
return defaultVal;
}
$("[tr-marquee-element='component']").each(function (index) {
let componentEl = $(this),
    panelEl = componentEl.find("[tr-marquee-element='panel']"),
    triggerHoverEl = componentEl.find("[tr-marquee-element='triggerhover']"),
    triggerClickEl = componentEl.find("[tr-marquee-element='triggerclick']");
let speedSetting = attr(100, componentEl.attr("tr-marquee-speed")),
    verticalSetting = attr(false, componentEl.attr("tr-marquee-vertical")),
    reverseSetting = attr(false, componentEl.attr("tr-marquee-reverse")),
    scrollDirectionSetting = attr(false, componentEl.attr("tr-marquee-scrolldirection")),
    scrollScrubSetting = attr(false, componentEl.attr("tr-marquee-scrollscrub")),
    moveDistanceSetting = -100,
    timeScaleSetting = 1,
    pausedStateSetting = false;
if (reverseSetting) moveDistanceSetting = 100;
let marqueeTimeline = gsap.timeline({ repeat: -1, onReverseComplete: () => marqueeTimeline.progress(1) });
if (verticalSetting) {
    speedSetting = panelEl.first().height() / speedSetting;
    marqueeTimeline.fromTo(panelEl, { yPercent: 0 }, { yPercent: moveDistanceSetting, ease: "none", duration: speedSetting });
} else {
    speedSetting = panelEl.first().width() / speedSetting;
    marqueeTimeline.fromTo(panelEl, { xPercent: 0 }, { xPercent: moveDistanceSetting, ease: "none", duration: speedSetting });
}
let scrubObject = { value: 1 };
ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
    if (!pausedStateSetting) {
        if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
        timeScaleSetting = self.direction;
        marqueeTimeline.timeScale(self.direction);
        }
        if (scrollScrubSetting) {
        let v = self.getVelocity() * 0.006;
        v = gsap.utils.clamp(-60, 60, v);
        let scrubTimeline = gsap.timeline({ onUpdate: () => marqueeTimeline.timeScale(scrubObject.value) });
        scrubTimeline.fromTo(scrubObject, { value: v }, { value: timeScaleSetting, duration: 0.5 });
        }
    }
    }
});
function pauseMarquee(isPausing) {
    pausedStateSetting = isPausing;
    let pauseObject = { value: 1 };
    let pauseTimeline = gsap.timeline({ onUpdate: () => marqueeTimeline.timeScale(pauseObject.value) });
    if (isPausing) {
    pauseTimeline.fromTo(pauseObject, { value: timeScaleSetting }, { value: 0, duration: 0.5 });
    triggerClickEl.addClass("is-paused");
    } else {
    pauseTimeline.fromTo(pauseObject, { value: 0 }, { value: timeScaleSetting, duration: 0.5 });
    triggerClickEl.removeClass("is-paused");
    }
}
if (window.matchMedia("(pointer: fine)").matches) {
    triggerHoverEl.on("mouseenter", () => pauseMarquee(true));
    triggerHoverEl.on("mouseleave", () => pauseMarquee(false));
}
triggerClickEl.on("click", function () {
    !$(this).hasClass("is-paused") ? pauseMarquee(true) : pauseMarquee(false);
});
});
});

$(".slider-videos_component").each(function (index) {
    let loopMode = false;
    if ($(this).attr("loop-mode") === "true") {
      loopMode = true;
    }
    let sliderDuration = 300;
    if ($(this).attr("slider-duration") !== undefined) {
      sliderDuration = +$(this).attr("slider-duration");
    }
    const swiper = new Swiper($(this).find(".swiper")[0], {
      speed: sliderDuration,
      loop: loopMode,
      loopAdditionalSlides: 3,
      autoHeight: false,
      centeredSlides: loopMode,
      followFinger: true,
      freeMode: false,
      slideToClickedSlide: false,
      slidesPerView: 1.05,
      spaceBetween: 20,
      rewind: false,
      mousewheel: {
        forceToAxis: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
      breakpoints: {
        // mobile landscape
        480: {
                  slidesPerView: 1.05
        },
        // tablet
        768: {
          slidesPerView: 1.05
        },
        // desktop
        992: {
          spaceBetween: 64
        }
      },
      navigation: {
        nextEl: $(this).find(".swiper-next")[0],
        prevEl: $(this).find(".swiper-prev")[0],
        disabledClass: "is-disabled"
      },
      scrollbar: {
        el: $(this).find(".swiper-drag-wrapper")[0],
        draggable: true,
        dragClass: "swiper-drag",
        snapOnRelease: true
      },
      slideActiveClass: "is-active"
    });
  });
  
  $(".slider-cards_component").each(function (index) {
    const swiper = new Swiper($(this).find(".swiper")[0], {
        direction: 'vertical',
      centeredSlides: true,
      loop: true,
      speed: 800,
      navigation: {
        nextEl: $(this).find(".swiper-next")[0],
        prevEl: $(this).find(".swiper-prev")[0],
        disabledClass: "is-disabled"
      },
      effect: 'cards',
      cardsEffect: { rotate: false }
    });
  });
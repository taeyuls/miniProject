document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const downLinks = document.querySelector(".down-links");
  const jodanLogo = document.querySelector(".jodan");
  const logoContainer = document.querySelector(".logo");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      // 스크롤 위치에 따라 조정
      navbar.classList.add("nav-hidden");
      downLinks.classList.add("down-links-fixed");

      // 조던 로고 크기 및 위치 조정
      jodanLogo.style.width = "20px"; // 최종 크기 조정
      jodanLogo.style.position = "absolute";
      jodanLogo.style.top = "5px"; // 나이키 로고 위치에 맞게 조정
      jodanLogo.style.left = "5px"; // 나이키 로고 위치에 맞게 조정
      jodanLogo.classList.add("jodan-logo-transition");
    } else {
      navbar.classList.remove("nav-hidden");
      downLinks.classList.remove("down-links-fixed");

      // 조던 로고 원래대로
      jodanLogo.style = "";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sliderContainer = document.querySelector(".slider-container");
  const innerSlider = document.querySelector(".slider-container .inner");
  const slides = Array.from(innerSlider.children);
  const nextButton = document.querySelector(".right-button");
  const prevButton = document.querySelector(".left-button");
  let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0;

  slides.forEach((slide, index) => {
    const slideImage = slide.querySelector("img");
    slideImage.addEventListener("dragstart", (e) => e.preventDefault());

    // Touch events
    slide.addEventListener("touchstart", touchStart(index));
    slide.addEventListener("touchend", touchEnd);
    slide.addEventListener("touchmove", touchMove);

    // Mouse events
    slide.addEventListener("mousedown", touchStart(index));
    slide.addEventListener("mouseup", touchEnd);
    slide.addEventListener("mouseleave", touchEnd);
    slide.addEventListener("mousemove", touchMove);
  });

  // Disable context menu on long press
  window.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  function touchStart(index) {
    return function (event) {
      currentIndex = index;
      startPos = getPositionX(event);
      isDragging = true;
      animationID = requestAnimationFrame(animation);
      innerSlider.classList.add("grabbing");
    };
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1;

    if (movedBy > 100 && currentIndex > 0) currentIndex -= 1;

    setPositionByIndex();

    innerSlider.classList.remove("grabbing");
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
    }
  }

  function getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    innerSlider.style.transform = `translateX(${currentTranslate}px)`;
  }

  function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
  }

  // Button listeners
  nextButton.addEventListener("click", () => {
    if (currentIndex < slides.length - 1) currentIndex += 1;
    setPositionByIndex();
  });

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) currentIndex -= 1;
    setPositionByIndex();
  });
});

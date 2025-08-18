        const slider = document.querySelector('.news-slider');
        const slides = document.querySelectorAll('.slider-item');
        const dotsContainer = document.querySelector('.slider-dots');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let slideInterval;

        function createDots() {
            if (dotsContainer && totalSlides > 0) {
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('dot');
                    dot.dataset.slideIndex = i;
                    dotsContainer.appendChild(dot);
                    dot.addEventListener('click', () => {
                        goToSlide(i);
                        resetInterval();
                    });
                }
            }
        }

        function updateDots() {
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    if (index === currentSlide) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }

        function showSlide(index) {
            if (slider && slides.length > 0) {
                slider.style.transform = `translateX(-${index * 100}%)`;
                updateDots();
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        function goToSlide(index) {
            currentSlide = index;
            showSlide(currentSlide);
        }

        function startInterval() {
            if (totalSlides > 1) {
                slideInterval = setInterval(nextSlide, 5000);
            }
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startInterval();
        }

        document.addEventListener('DOMContentLoaded', () => {
            if (totalSlides > 0) {
                createDots();
                showSlide(currentSlide);
                startInterval();
            }

            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(el => {
            });
        });
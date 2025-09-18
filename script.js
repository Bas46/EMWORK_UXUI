document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const templeContainer = document.getElementById('temple');
    const templeTrack = document.querySelector('.temple-track');
    const watItems = document.querySelectorAll('#watthai');
    const dots = document.querySelectorAll('.dot');
    const columnBtns = document.querySelectorAll('.column-btn');
    const autoplayToggle = document.getElementById('autoplay-toggle');

    // State variables
    let currentSlide = 0;
    let slideCount = Math.ceil(watItems.length / getVisibleItemCount());
    let autoplayTimer = null;

    // Initialize
    initializeSlider();

    // Functions
    function initializeSlider() {
        // Set default column layout (3 columns as in the template)
        setColumnLayout(3);

        // Calculate slide count based on visible items
        updateSlideCount();

        // Organize the temple items for better display
        organizeItems();

        // Update dot navigation
        updateDots();

        // Start autoplay if enabled by default
        if (autoplayToggle.checked) {
            startAutoplay();
        }

        // Event listeners
        setupEventListeners();
    }

    // Function to organize items for better display
    function organizeItems() {
        // Make sure the temple track has the right width
        templeTrack.style.width = '100%';

        // Calculate and apply the proper width for each item based on column count
        const visibleItems = getVisibleItemCount();
        const totalItems = watItems.length;

        // Apply proper styling to temple items
        watItems.forEach((item, index) => {
            item.style.width = `${100 / visibleItems}%`;
        });
    }

    function setupEventListeners() {
        // Column buttons
        columnBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const columns = parseInt(this.dataset.columns);
                setColumnLayout(columns);

                // Update active button
                columnBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Reset slider
                resetSlider();
            });
        });

        // Dots navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function () {
                goToSlide(index);
            });
        });

        // Autoplay toggle
        autoplayToggle.addEventListener('change', function () {
            if (this.checked) {
                startAutoplay();
            } else {
                stopAutoplay();
            }
        });

        // Window resize
        window.addEventListener('resize', function () {
            updateSlideCount();
            resetSlider();
        });
    }

    function setColumnLayout(columns) {
        // Update container classes
        templeContainer.classList.remove('columns-2', 'columns-3', 'columns-4');
        templeContainer.classList.add(`columns-${columns}`);

        // Update item widths directly
        watItems.forEach(item => {
            const widthPercent = 100 / columns;
            item.style.flex = `0 0 ${widthPercent}%`;
            item.style.maxWidth = `${widthPercent}%`;
        });

        // Reset and update the slider
        updateSlideCount();
        organizeItems();
    }

    function getVisibleItemCount() {
        // Determine visible items based on current column layout
        if (templeContainer.classList.contains('columns-2')) {
            return 2;
        } else if (templeContainer.classList.contains('columns-4')) {
            return 4;
        } else {
            return 3; // Default or columns-3
        }
    }

    function updateSlideCount() {
        const visibleItems = getVisibleItemCount();
        slideCount = Math.ceil(watItems.length / visibleItems);

        // Update dots display (hide extra dots if needed)
        updateDotsDisplay();
    }

    function updateDotsDisplay() {
        // Make sure we have the right number of dots
        const dotsContainer = document.querySelector('.navigation-dots');

        // Clear existing dots
        dotsContainer.innerHTML = '';

        // Create new dots based on slide count
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === currentSlide) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', function () {
                goToSlide(i);
            });

            dotsContainer.appendChild(dot);
        }
    }

    function resetSlider() {
        currentSlide = 0;
        updateSliderPosition();
        updateDots();

        // Reset autoplay if enabled
        if (autoplayToggle.checked) {
            stopAutoplay();
            startAutoplay();
        }
    }

    function goToSlide(slideIndex) {
        // Ensure slideIndex is within bounds
        const maxSlideIndex = slideCount - 1;
        currentSlide = Math.max(0, Math.min(slideIndex, maxSlideIndex));

        updateSliderPosition();
        updateDots();

        // Reset autoplay timer
        if (autoplayToggle.checked) {
            stopAutoplay();
            startAutoplay();
        }
    }

    function updateSliderPosition() {
        const visibleItems = getVisibleItemCount();
        const totalItems = watItems.length;

        // Calculate how many full pages we can show
        const fullPages = Math.floor(totalItems / visibleItems);
        const remainingItems = totalItems % visibleItems;

        // Calculate percentage width of each item
        let itemWidth;
        if (templeContainer.classList.contains('columns-2')) {
            itemWidth = 50;
        } else if (templeContainer.classList.contains('columns-4')) {
            itemWidth = 25;
        } else {
            itemWidth = 33.333; // Default for 3 columns
        }

        // Calculate offset for current slide
        let offset;

        // If we're on the last page and there are remaining items
        if (currentSlide === slideCount - 1 && remainingItems !== 0) {
            // Show the last complete set of items
            offset = -((totalItems - Math.min(remainingItems, visibleItems)) * itemWidth / visibleItems);
        } else {
            // For normal slides
            offset = -(currentSlide * 100);
        }

        // Apply transform
        templeTrack.style.transform = `translateX(${offset}%)`;
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startAutoplay() {
        stopAutoplay(); // Clear any existing timer

        autoplayTimer = setInterval(function () {
            // Check if we've reached the end
            if (currentSlide >= slideCount - 1) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateSliderPosition();
            updateDots();
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // Set default column layout on load
    setColumnLayout(3);
});

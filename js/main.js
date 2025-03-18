document.addEventListener('DOMContentLoaded', () => {
    const savedSlides = localStorage.getItem('arma3SliderSlidesHtml');
    const savedThumbnails = localStorage.getItem('arma3SliderThumbnailsHtml');
    
    if (savedSlides && savedThumbnails) {
        document.querySelector('.slider').innerHTML = savedSlides;
        document.querySelector('.slider-thumbnails').innerHTML = savedThumbnails;
        
        const slider = document.querySelector('.slider');
        const slides = document.querySelectorAll('.slide');
        const thumbnails = document.querySelectorAll('.slider-thumbnail');
        
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                currentSlide = index;
                slider.style.transform = `translateX(-${currentSlide * 100}%)`;
                updateThumbnails();
                clearInterval(sliderInterval);
                sliderInterval = setInterval(autoPlay, 5000);
            });
        });
    }
});

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const thumbnails = document.querySelectorAll('.slider-thumbnail');
let currentSlide = 0;
let isAutoPlay = true;
let sliderInterval = setInterval(autoPlay, 5000);

function autoPlay() {
    currentSlide = (currentSlide + 1) % slides.length;
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateThumbnails();
}

function updateThumbnails() {
    thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));
    thumbnails[currentSlide].classList.add('active');
}

thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateThumbnails();
        clearInterval(sliderInterval);
        sliderInterval = setInterval(autoPlay, 5000);
    });
});

const container = document.querySelector('.slider-container');
let timeout;

container.addEventListener('mouseenter', () => {
    clearInterval(sliderInterval);
    timeout = setTimeout(() => {
        container.style.cursor = 'default';
    }, 100);
});

container.addEventListener('mouseleave', () => {
    clearTimeout(timeout);
    container.style.cursor = 'default';
    if (isAutoPlay) {
        sliderInterval = setInterval(autoPlay, 10000);
    }
});

function toggleAutoPlay() {
    isAutoPlay = !isAutoPlay;
    const button = document.querySelector('.autoplay-toggle');
    if (isAutoPlay) {
        button.textContent = '⏸';
        clearInterval(sliderInterval);
    } else {
        button.textContent = '▶';
        sliderInterval = setInterval(autoPlay, 10000);
    }
}

function openAdminPanel() {
    window.open('admin.html', '_blank');
}

function showInfo(id) {
    document.querySelectorAll('.info-container').forEach(container => {
        container.style.display = 'none';
    });
    
    document.getElementById(id).style.display = 'block';
    
    clearInterval(sliderInterval);
}

function hideInfo(id) {
    document.getElementById(id).style.display = 'none';
    
    if (isAutoPlay) {
        sliderInterval = setInterval(autoPlay, 5000);
    }
}
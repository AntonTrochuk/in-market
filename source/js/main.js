import { searchActive } from './search.js';
import Swiper from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

searchActive ();


const heroSwiper = document.querySelector('.hero-swiper');
const heroSlider = new Swiper(heroSwiper, {
 modules: [Navigation, Scrollbar],
  loop: true,
  speed: 500,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },

  breakpoints: {
    1200: {
      slidesPerView: 1,
      spaceBetween: 150,
      allowTouchMove: true,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 150,
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
  },

  navigation: {
    nextEl: '.programs__button--next',
    prevEl: '.programs__button--prev',
    disabledClass: 'disabled',
  },
});

heroSlider.update();

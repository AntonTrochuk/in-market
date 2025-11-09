import { searchActive } from './search.js';
import {afterClicking} from './price-button.js';
import { priceTest, viewItemBasket, updateBasketDisplay } from './pricetest.js';
import Swiper from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

searchActive ();
//afterClicking ();
priceTest();
viewItemBasket();
updateBasketDisplay();

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
      spaceBetween: 20,
      allowTouchMove: true,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
  },

  navigation: {
    nextEl: '.programs__button--next',
    prevEl: '.programs__button--prev',
    disabledClass: 'disabled',
  },
});

heroSlider.update();

const priceButtons = document.querySelectorAll('.card__item-price-button');
const cards = document.querySelectorAll('.card__item');
const basketValue = document.querySelector('.header__navigation-basket-text');

const cardProperty = {};

const updatingProperties = () => {
  cards.forEach(card => {
    const cardName = card.dataset.article;

    cardProperty[cardName] = {
      price: card.querySelector('.card__item-price-value').textContent.split('').slice(0, -1).join(''),
      quantity: card.querySelector('.button-click__text').textContent,
    }
  });

  // Подсчет общей суммы quantity после обновления свойств
  const totalQuantity = Object.values(cardProperty).reduce((total, item) => {
    return total + parseInt(item.quantity);
  }, 0);

  console.log('Total quantity:', totalQuantity);

  // Показываем/скрываем корзину в зависимости от количества товаров
  if (totalQuantity > 0) {
    basketValue.style.display = 'flex';
    basketValue.textContent = totalQuantity;
  } else {
    basketValue.style.display = 'none';
  }
};

const afterClicking = () => {
  // Функция для обновления счетчика
  const updateAndSaveCount = (cardArticle, count) => {
    const card = document.querySelector(`[data-article="${cardArticle}"]`);
    const buttonText = card.querySelector('.button-click__text');

    buttonText.textContent = count;
    localStorage.setItem(`quantity_${cardArticle}`, count);
    updatingProperties(); // Это вызовет подсчет общей суммы
  };

  // Функция для сброса состояния карточки
  const resetCardState = (cardArticle) => {
    localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');

    const card = document.querySelector(`[data-article="${cardArticle}"]`);
    if (card) {
      const priceButton = card.querySelector('.card__item-price-button');
      const buttonClick = card.querySelector('.button-click');
      const buttonText = card.querySelector('.button-click__text');

      if (priceButton) priceButton.style.display = '';
      if (buttonClick) buttonClick.classList.remove('show');
      if (buttonText) buttonText.style.opacity = '';

      // Сбрасываем количество к 0 (по умолчанию)
      localStorage.removeItem(`quantity_${cardArticle}`);
      if (buttonText) buttonText.textContent = '0';
    }
    updatingProperties(); // Обновляем общую сумму после сброса
  };

  // Функция для инициализации обработчиков счетчика
  const initializeCounterHandlers = (cardArticle) => {
    const card = document.querySelector(`[data-article="${cardArticle}"]`);
    const buttonText = card.querySelector('.button-click__text');
    const moreButton = card.querySelector('.button-click__more');
    const lessButton = card.querySelector('.button-click__less');

    // Удаляем старые обработчики
    const newMoreButton = moreButton.cloneNode(true);
    const newLessButton = lessButton.cloneNode(true);
    moreButton.parentNode.replaceChild(newMoreButton, moreButton);
    lessButton.parentNode.replaceChild(newLessButton, lessButton);

    // Добавляем новые обработчики
    newMoreButton.addEventListener('click', () => {
      const currentCount = Number(buttonText.textContent);
      updateAndSaveCount(cardArticle, currentCount + 1);
    });

    newLessButton.addEventListener('click', () => {
      const currentCount = Number(buttonText.textContent);
      if (currentCount > 1) {
        updateAndSaveCount(cardArticle, currentCount - 1);
      } else if (currentCount === 1) {
        // Если уменьшаем с 1 до 0, сбрасываем состояние
        resetCardState(cardArticle);
      }
    });
  };

  // Инициализация: устанавливаем всем счетчикам 0 по умолчанию
  cards.forEach(card => {
    const buttonText = card.querySelector('.button-click__text');
    if (buttonText) {
      buttonText.textContent = '0';
    }
  });

  // Восстановление состояния для каждой карточки
  cards.forEach(card => {
    const cardArticle = card.dataset.article;
    const priceButton = card.querySelector('.card__item-price-button');
    const buttonClick = card.querySelector('.button-click');
    const buttonText = card.querySelector('.button-click__text');

    // Проверяем для каждой карточки отдельно
    if (localStorage.getItem(`clickPriceButton_${cardArticle}`) === 'true') {
      priceButton.style.display = 'none';

      if (buttonClick) {
        buttonClick.classList.add('show');
        buttonText.style.opacity = '1';
      }

      // Восстанавливаем количество
      const savedCount = localStorage.getItem(`quantity_${cardArticle}`);
      if (savedCount && buttonText) {
        buttonText.textContent = savedCount;
      } else {
        // Если нет сохраненного количества, устанавливаем 1
        buttonText.textContent = '1';
        localStorage.setItem(`quantity_${cardArticle}`, '1');
      }

      // Инициализируем обработчики счетчика
      initializeCounterHandlers(cardArticle);

      // Запускаем таймер для сброса состояния через 30 мин
      setTimeout(() => {
        resetCardState(cardArticle);
      }, 1800000);
    }
  });

  // Обработчики кликов на основные кнопки
  priceButtons.forEach(priceButton => {
    priceButton.addEventListener('click', () => {
      const card = priceButton.closest('.card__item');
      const cardArticle = card.dataset.article;

      priceButton.style.display = 'none';
      localStorage.setItem(`clickPriceButton_${cardArticle}`, 'true');

      const buttonClick = card.querySelector('.button-click');
      const buttonText = card.querySelector('.button-click__text');

      // Устанавливаем количество 1 при первом клике
      let count = 1;
      buttonText.textContent = count;

      if (buttonClick) {
        buttonClick.classList.add('show');
        buttonText.style.opacity = '1';
      }

      // Инициализируем обработчики счетчика
      initializeCounterHandlers(cardArticle);

      localStorage.setItem(`quantity_${cardArticle}`, count);
      updatingProperties(); // Обновляем общую сумму

      // Запускаем таймер для сброса состояния через 30 мин
      setTimeout(() => {
        resetCardState(cardArticle);
      }, 1800000);
    });
  });

  updatingProperties(); // Инициализируем общую сумму при загрузке
};

export { afterClicking };

const basketButtonDOMEl = document.querySelector('.header__navigation-basket-link');
const basketMainDOMEl = document.querySelector('.basket');
const cardsDOMEl = document.querySelectorAll('.card__item');
const basketValue = document.querySelector('.header__navigation-basket-text');

const cardProperty = {};

// Открытие/закрытие корзины
const openBasket = () => {
    basketButtonDOMEl.addEventListener('click', () => {
        basketMainDOMEl.classList.toggle('basket--active');
    });
};

// Визуальные эффекты для кнопок
const priceButtonClickON = (priceButton, buttonClick, buttonText) => {
    priceButton.style.display = 'none';
    buttonClick.classList.add('show');
    buttonText.style.opacity = '1';
};

const priceButtonClickOff = (priceButton, buttonClick, buttonText) => {
    priceButton.style.display = 'block';
    buttonClick.classList.remove('show');
    buttonText.style.opacity = '0';
};

// Сохранение/восстановление состояния корзины
const saveCardProperty = () => {
    localStorage.setItem('cardProperty', JSON.stringify(cardProperty));
};

const restoreCardState = () => {
    const savedData = JSON.parse(localStorage.getItem('cardProperty')) || {};
    Object.assign(cardProperty, savedData);

    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;
        const clicked = localStorage.getItem(`clickPriceButton_${cardArticle}`) === 'true';

        const priceButton = cardItem.querySelector('.card__item-price-button');
        const priceBlock = priceButton?.closest('.card__item-price');
        const buttonClick = priceBlock?.querySelector('.button-click');
        const buttonText = priceBlock?.querySelector('.button-click__text');

        if (clicked) {
            priceButtonClickON(priceButton, buttonClick, buttonText);
            if (cardProperty[cardArticle]) {
                buttonText.textContent = cardProperty[cardArticle].quantity;
            }
        }
    });
};

// Сброс корзины
const resetCardState = () => {
    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');

        const priceButton = cardItem.querySelector('.card__item-price-button');
        const priceBlock = priceButton?.closest('.card__item-price');
        const buttonClick = priceBlock?.querySelector('.button-click');
        const buttonText = priceBlock?.querySelector('.button-click__text');

        priceButtonClickOff(priceButton, buttonClick, buttonText);
    });

    localStorage.removeItem('cardProperty');
    Object.keys(cardProperty).forEach(key => delete cardProperty[key]);
    updateBasketDisplay();
};

// Обновление счетчика корзины
const updateBasketDisplay = () => {
    const totalQuantity = Object.values(cardProperty)
        .reduce((sum, product) => sum + (product.quantity || 0), 0);

    if (basketValue) {
        if (totalQuantity > 0) {
            basketValue.style.display = 'flex';
            basketValue.textContent = totalQuantity;
        } else {
            basketValue.style.display = 'none';
        }
    }
};

// Основная функция корзины
const basket = () => {
    restoreCardState();
    updateBasketDisplay();

    // Клик по кнопке "Купить"
    document.addEventListener('click', (event) => {
        const priceButton = event.target.closest('.card__item-price-button');
        const cardItem = event.target.closest('.card__item');

        if (!priceButton || !cardItem) return;

        const cardArticle = cardItem.dataset.article;
        const priceBlock = cardItem.querySelector('.card__item-price');
        const buttonClick = priceBlock.querySelector('.button-click');
        const buttonText = priceBlock.querySelector('.button-click__text');

        cardProperty[cardArticle] = {
            img: cardItem.querySelector('img')?.src || '',
            productName: cardItem.querySelector('.card__item-text h5')?.textContent.trim() || '',
            price: cardItem.querySelector('.card__item-price-value')?.textContent.replace(/[^\d,.]/g, '').trim() || '',
            quantity: 1
        };

        saveCardProperty();
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'true');
        priceButtonClickON(priceButton, buttonClick, buttonText);
        buttonText.textContent = cardProperty[cardArticle].quantity;

        updateBasketDisplay();
    });

    // Кнопки +/-
    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;
        const buttonText = cardItem.querySelector('.button-click__text');
        let count = cardProperty[cardArticle]?.quantity || 1;

        const lessBtn = cardItem.querySelector('.button-click__less');
        const moreBtn = cardItem.querySelector('.button-click__more');

        if (lessBtn) {
            lessBtn.addEventListener('click', () => {
                if (count > 1) count--;
                buttonText.textContent = count;

                cardProperty[cardArticle].quantity = count;
                saveCardProperty();
                updateBasketDisplay();
            });
        }

        if (moreBtn) {
            moreBtn.addEventListener('click', () => {
                count++;
                buttonText.textContent = count;

                cardProperty[cardArticle].quantity = count;
                saveCardProperty();
                updateBasketDisplay();
            });
        }
    });

    // Авто-сброс через 10 минут
    setTimeout(resetCardState, 600000);
};

export { basket, openBasket };

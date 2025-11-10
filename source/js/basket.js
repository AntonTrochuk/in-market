const basketButtonDOMEl = document.querySelector('.header__navigation-basket-link');
const basketMainDOMEl = document.querySelector('.basket');
const cardsDOMEl = document.querySelectorAll('.card__item');

const openBasket = () => {
    basketButtonDOMEl.addEventListener('click', () => {
        basketMainDOMEl.classList.toggle('basket--active');
    });
};

const cardProperty = {};

const priceButtonClickON = (priceButton, buttonClick, buttonText) => {
    priceButton.style.display = 'none';
    buttonClick.classList.add('show');
    buttonText.style.opacity = '1';
    buttonText.textContent = '1';
};

const priceButtonClickOff = (priceButton, buttonClick, buttonText) => {
    priceButton.style.display = 'block';
    buttonClick.classList.remove('show');
    buttonText.style.opacity = '0';
};

const saveCardProperty = () => {
    localStorage.setItem('cardProperty', JSON.stringify(cardProperty));
};

const restoreCardState = () => {
    const savedData = JSON.parse(localStorage.getItem('cardProperty')) || {};
    Object.assign(cardProperty, savedData);

    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;

        if (localStorage.getItem(`clickPriceButton_${cardArticle}`) === 'true') {
            const priceButton = cardItem.querySelector('.card__item-price-button');
            const priceBlock = priceButton ? priceButton.closest('.card__item-price') : null;
            const buttonClick = priceBlock ? priceBlock.querySelector('.button-click') : null;
            const buttonText = priceBlock ? priceBlock.querySelector('.button-click__text') : null;

            priceButtonClickON(priceButton, buttonClick, buttonText);

            if (cardProperty[cardArticle] && buttonText) {
                buttonText.textContent = cardProperty[cardArticle].quantity || '1';
            }
        }
    });
};

const resetCardState = () => {
    cardsDOMEl.forEach(cardItem => {
        const cardArticle = cardItem.dataset.article;
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'false');

        const priceButton = cardItem.querySelector('.card__item-price-button');
        const priceBlock = priceButton ? priceButton.closest('.card__item-price') : null;
        const buttonClick = priceBlock ? priceBlock.querySelector('.button-click') : null;
        const buttonText = priceBlock ? priceBlock.querySelector('.button-click__text') : null;

        priceButtonClickOff(priceButton, buttonClick, buttonText);
    });

    localStorage.removeItem('cardProperty');
};

const basket = () => {
    restoreCardState();

    // Клик по кнопке "Купить"
    document.addEventListener('click', (event) => {
        const target = event.target;
        const cardItem = target.closest('.card__item');
        const priceButton = target.closest('.card__item-price-button');
        if (!cardItem || !priceButton) return;

        const priceBlock = cardItem.querySelector('.card__item-price');
        const buttonClick = priceBlock.querySelector('.button-click');
        const buttonText = priceBlock.querySelector('.button-click__text');
        const cardArticle = cardItem.dataset.article;

        cardProperty[cardArticle] = {
            img: cardItem.querySelector('img')?.src || '',
            productName: cardItem.querySelector('.card__item-text h5')?.textContent.trim() || '',
            price: cardItem.querySelector('.card__item-price-value')?.textContent.replace(/[^\d,.]/g, '').trim() || '',
            quantity: '1'
        };

        saveCardProperty();
        localStorage.setItem(`clickPriceButton_${cardArticle}`, 'true');
        priceButtonClickON(priceButton, buttonClick, buttonText);
    });

    // Кнопки +/-
    cardsDOMEl.forEach(cardItem => {
        const lessBtn = cardItem.querySelector('.button-click__less');
        const moreBtn = cardItem.querySelector('.button-click__more');
        const buttonText = cardItem.querySelector('.button-click__text');
        const cardArticle = cardItem.dataset.article;

        let count = Number(buttonText?.textContent) || 1;

        if (lessBtn) {
            lessBtn.addEventListener('click', () => {
                if (count > 1) count--;
                buttonText.textContent = count;

                // Обновляем localStorage
                if (cardProperty[cardArticle]) {
                    cardProperty[cardArticle].quantity = count.toString();
                    saveCardProperty();
                }
            });
        }

        if (moreBtn) {
            moreBtn.addEventListener('click', () => {
                count++;
                buttonText.textContent = count;

                if (cardProperty[cardArticle]) {
                    cardProperty[cardArticle].quantity = count.toString();
                    saveCardProperty();
                }
            });
        }
    });

    const retrievedUser = JSON.parse(localStorage.getItem('cardProperty'));
    console.log(retrievedUser);

    const basketValue = document.querySelector('.header__navigation-basket-text');

    const totalQuantity = Object.values(retrievedUser).reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0);

    basketValue.textContent = totalQuantity;

    console.log('Общее количество товаров:', totalQuantity);



    // Сбрасываем через 10 минут
    setTimeout(() => {
        resetCardState();
    }, 600000);
};

export {basket, openBasket};

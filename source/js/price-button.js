const priceButtons = document.querySelectorAll('.card__item-price-button');

const afterClicking = () => {
    priceButtons.forEach(priceButton => {
        const card = priceButton.closest('.card__item');
        const cardArticle = card.dataset.article;
        
        // Проверяем был ли клик для ЭТОЙ конкретной карточки
        const wasClicked = localStorage.getItem(`clickButton_${cardArticle}`) === 'true';
        
        if (wasClicked) {
            // Если был клик - сразу скрываем кнопку и показываем счетчик
            priceButton.style.display = 'none';
            
            const buttonClick = card.querySelector('.button-click');
            const buttonText = card.querySelector('.button-click__text');
            const moreButton = card.querySelector('.button-click__more');
            const lessButton = card.querySelector('.button-click__less');
            
            if (buttonClick) {
                buttonClick.classList.add('show');
                buttonText.style.opacity = '1';
                
                const saved = localStorage.getItem(`number_${cardArticle}`);
                if (saved !== null) {
                    buttonText.textContent = saved;
                }
                
                // Добавляем обработчики для кнопок +/- при восстановлении
                if (moreButton) {
                    moreButton.addEventListener('click', () => {
                        let count = Number(buttonText.textContent) + 1;
                        buttonText.textContent = count;
                        localStorage.setItem(`number_${cardArticle}`, count);
                    });
                }
                
                if (lessButton) {
                    lessButton.addEventListener('click', () => {
                        let count = Number(buttonText.textContent);
                        if (count > 1) {
                            count = count - 1;
                            buttonText.textContent = count;
                            localStorage.setItem(`number_${cardArticle}`, count);
                        }
                    });
                }
            }
        }

        priceButton.addEventListener('click', () => {
            priceButton.style.display = 'none';
            localStorage.setItem(`clickButton_${cardArticle}`, 'true');

            const buttonClick = card.querySelector('.button-click');
            const buttonText = card.querySelector('.button-click__text');
            const moreButton = card.querySelector('.button-click__more');
            const lessButton = card.querySelector('.button-click__less');

            if (buttonClick) {
                buttonClick.classList.add('show');
                buttonText.style.opacity = '1';

                const saved = localStorage.getItem(`number_${cardArticle}`);
                if (saved !== null) {
                    buttonText.textContent = saved;
                }
            }

            if (moreButton) {
                moreButton.addEventListener('click', () => {
                    let count = Number(buttonText.textContent) + 1;
                    buttonText.textContent = count;
                    localStorage.setItem(`number_${cardArticle}`, count);
                });
            }

            if (lessButton) {
                lessButton.addEventListener('click', () => {
                    let count = Number(buttonText.textContent);
                    if (count > 1) {
                        count = count - 1;
                        buttonText.textContent = count;
                        localStorage.setItem(`number_${cardArticle}`, count);
                    }
                });
            }
        });
    });
};

export { afterClicking };
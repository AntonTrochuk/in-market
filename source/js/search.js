const button = document.querySelector('.search button');
const searchBlock = document.querySelector('.search');

const searchActive = () => {
  button.addEventListener('click',() => {
    searchBlock.classList.toggle('search--active');
  });
};

export {searchActive};

import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = '';
}

export const clearResults = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
  // document.querySelector(`a[href="#${id}]"`.classList.add('.result__link--active'))
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

const limitRecipeTitle = (title, limit = 17) => { // to properly display the title
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((prev, cur) => {
      if (prev + cur.length <= limit) {
        newTitle.push(cur);
      }
      return prev + cur.length;
    }, 0);
    return `${newTitle.join(' ')} ...`;
  }
  return title;
}

const renderRecipe = recipe => {
  const markUp =
    `
      <li>
          <a class="results__link" href="#${recipe.recipe_id}">
              <figure class="results__fig">
                  <img src="${recipe.image_url}" alt="${recipe.title}">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
      </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markUp);
}

//type: 'prev' or 'next'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1}>
    <span>Page ${type === 'prev' ? page - 1: page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
      </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  if (page === 1 && pages > 1) { // Button only for next pages
    button = createButton(page, 'next');
  } else if (page === pages && pages > 1) { // Button only for previous pages
    button = createButton(page, 'prev');
  } else if (page < pages) { // Both buttons for next and previous pages
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

//pagitation
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);

}

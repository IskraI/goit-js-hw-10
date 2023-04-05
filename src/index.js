import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const searchCountryInputEl = document.querySelector('#search-box');
const CountrylistEl = document.querySelector('.country-list');
const CountryEl = document.querySelector('.country-info');

searchCountryInputEl.addEventListener(
  'input',
  debounce(handleSearchCountry, DEBOUNCE_DELAY)
);
let dataSeach = [];
function handleSearchCountry(event) {
  const searchName = event.target.value.toLowerCase().trim();
  if (!searchName) {
    markupCountryReset();
    return;
  }

  fetchCountries(searchName)
    .then(data => {
      markupCountryReset();
      console.log(data);
      if (data.length === 1) {
        markupCountryCard(data[0], CountryEl);
      }
      if ((data.length > 1) & (data.length < 11)) {
        markupCountryList(data);
        dataSeach = data;
      }
      if (data.length > 11) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      if (err.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
        markupCountryReset();
        return;
      }
      console.log('Oops, server fall');
    });
  // markupCountryReset();
}
// Очищение страницы
function markupCountryReset() {
  CountryEl.innerHTML = '';
  CountrylistEl.innerHTML = '';
}

//Список стран
function markupCountryList(array) {
  let i = 0;
  array.forEach(el => {
    CountrylistEl.insertAdjacentHTML(
      'beforeend',
      `    <li class = "country-item">
            <a target="_blank"><img src='${el.flags.svg}' alt='${el.name.official}' class='flag-img' width="50" height="25" data-count = "${i}"/> </a>
            <h2 class='country-name'>${el.name.official}</h2> </li>
          `
    );
    i += 1;
  });
}

// Карточа страны
function markupCountryCard(dataObj, element) {
  const { flags, name, capital, population, languages } = dataObj;
  // console.log(dataObj);
  return (element.innerHTML = `
    <div class="country-head"> 
       <img src="${flags.svg}" alt="${
    name.official
  }" class="flag-img" width="50" height="25" />
       <h2 class="country-name">${name.official}</h2> 
         </div> 
       <div class="country-descr">
       <p> <b>Capital:</b> ${capital}</p>
       <p> <b> Population:</b> ${population} </p>
       <p> <b>Languages:</b> ${Object.values(languages)} </p>
     </div>`);
}

//Открытие карточки страны из списка стран

CountrylistEl.addEventListener('click', handleShowContry);
function handleShowContry(event) {
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  const index = event.target.dataset.count;

  let win = open('', '', `top=10,left=500,width=500,height=250`);
  win.document.body.innerHTML = markupCountryCard(dataSeach[index], win);
}

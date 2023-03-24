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
        markupCountryCard(data[0]);
      }
      if ((data.length > 1) & (data.length < 11)) {
        markupCountryList(data);
      }
      if (data.length > 11) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(() => {
      Notiflix.Notify.failure('Oops, there is no country with that name.');
      console.log('Oops, there is no country with that name.');
    });

  function markupCountryReset() {
    CountryEl.innerHTML = '';
    CountrylistEl.innerHTML = '';
  }

  function markupCountryList(array) {
    array.forEach(el => {
      CountrylistEl.insertAdjacentHTML(
        'beforeend',
        `    <li class = "country-item">
            <img src='${el.flags.svg}' alt='flag' class='flag-img' />
            <h2 class='country-name'>${el.name.official}</h2> </li>
          `
      );
    });
  }

  function markupCountryCard(dataObj) {
    const { flags, name, capital, population, languages } = dataObj;

    CountryEl.innerHTML = `
    <div class="country-head"> 
       <img src="${flags.svg}" alt="flag" class="flag-img" />
       <h2 class="country-name">${name.official}</h2> 
         </div> 
       <div class="country-descr">
       <p> <b>Capital:</b> ${capital}</p>
       <p> <b> Population:</b> ${population} </p>
       <p> <b>Languages:</b> ${Object.values(languages)} </p>
     </div>`;
  }
}

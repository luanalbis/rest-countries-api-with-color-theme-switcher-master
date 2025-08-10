let allCountries = [];
function getAllCountries() {
    fetch('https://restcountries.com/v3.1/all?fields=name,population,region,subregion,capital,topLevelDomain,currencies,languages,borders,flags')
        .then(res => res.json())
        .then(data => {
            allCountries = data;
            console.log(allCountries[0]);
            updateTheme();
            renderizeCountryList(allCountries);
        })
        .catch(err => console.error('Erro:', err));
}

document.getElementById('search-bar').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        getCountryByName(this.value);
    }
});

function showFilters() {
    let toogleFilters = document.getElementById('toogle-filters');
    toogleFilters.style.display = toogleFilters.style.display === 'none' ? 'flex' : 'none';
}

function getCountriesByRegion(region) {
    let filterCountries = [];
    allCountries.forEach(country => {
        if (country.region === region) {
            filterCountries.push(country);
        }
    });
    renderizeCountryList(filterCountries);
}

function getCountryByName(name) {
    let filterCountries = [];
    allCountries.forEach(country => {
        if (country.name.common.toLowerCase().includes(name.toLowerCase())) {
            filterCountries.push(country);
        }
    });
    renderizeCountryList(filterCountries);
}

function showCountryDetails(country) {
    document.getElementById('toogle-filters').style.display = 'none';
    document.getElementById('countryDetails').style.display = 'flex';
    document.getElementById('btn-back-container').style.display = 'flex';
    document.getElementById('main-countries-container').style.display = 'none';
    document.getElementById('search-input-bar').style.display = 'none';
    document.getElementById('main-countries-container').style.display = 'none';
    document.getElementById('filter-toggle-container').style.display = 'none';

    document.getElementById('img-country-detail').src = country.flags.png;
    document.getElementById('txt-country-name').innerHTML = country.name.common;


    const nativeName = Object.values(country.name.nativeName)[0].official;
    document.getElementById('txt-native-name').innerHTML = '<strong>Native Name:</strong> ' + nativeName;

    document.getElementById('txt-population').innerHTML = '<strong>Population:</strong> ' + country.population.toLocaleString();
    document.getElementById('txt-region').innerHTML = '<strong>Region:</strong> ' + country.region;
    document.getElementById('txt-subregion').innerHTML = '<strong>Sub Region:</strong> ' + country.subregion;
    document.getElementById('txt-capital').innerHTML = '<strong>Capital:</strong> ' + country.capital[0];


    const currency = Object.values(country.currencies)[0].name;
    document.getElementById('txt-currencies').innerHTML = '<strong>Currencies:</strong> ' + currency;


    const languages = Object.values(country.languages).join(', ');
    document.getElementById('txt-languages').innerHTML = '<strong>Languages:</strong> ' + languages;


    if (country.tld && country.tld.length > 0) {
        document.getElementById('txt-tld').innerHTML = '<strong>Top Level Domain:</strong> ' + country.tld[0];
    } else {
        document.getElementById('txt-tld').innerHTML = '<strong>Top Level Domain:</strong> N/A';
    }

    console.log(country.borders);

    let prefix = localStorage.getItem('theme') === 'light' ? 'lm-' : 'dm-';

    if (country.borders && country.borders.length > 0) {
        const btnsBordersContainer = document.getElementById('btns-borders');

        btnsBordersContainer.innerHTML = '';

        country.borders.forEach(neighbor => {
            if (neighbor) {
                const borderBtn = document.createElement('input');
                borderBtn.type = 'button';
                borderBtn.value = neighbor;
                borderBtn.classList.add(prefix + 'txt', prefix + 'bg-el');
                btnsBordersContainer.appendChild(borderBtn);
            }
        });

    }

}

function renderizeCountryList(countries) {
    let theme = localStorage.getItem('theme');
    if (!theme) theme = 'dark';
    console.log(theme);
    const prefix = theme === 'dark' ? 'dm-' : 'lm-';

    const container = document.getElementById('main-countries-container');
    container.innerHTML = '';

    countries.forEach(country => {
        const countryDiv = document.createElement('div')

        countryDiv.addEventListener('click', () => showCountryDetails(country));

        const countryChildDiv = document.createElement('div');
        const img = document.createElement('img');
        const h2 = document.createElement('h2');
        const pPopulacao = document.createElement('p');
        const pRegiao = document.createElement('p');
        const pCapital = document.createElement('p');

        img.src = country.flags.png;
        img.alt = country.flags.alt || `Bandeira de ${country.name.common}`;
        h2.textContent = country.name.common;
        pPopulacao.innerHTML = `<strong>População:</strong> ${country.population.toLocaleString()}`;
        pRegiao.innerHTML = `<strong>Região:</strong> ${country.region}`;
        pCapital.innerHTML = `<strong>Capital:</strong> ${Array.isArray(country.capital) && country.capital.length > 0 ? country.capital[0] : 'N/A'}`;

        countryDiv.classList.add('country-card-container');
        countryChildDiv.classList.add(prefix + 'bg-el');
        countryChildDiv.classList.add(`${prefix}txt`);
        countryChildDiv.querySelectorAll('p').forEach(p => p.classList.add(`${prefix}txt`));
        h2.classList.add(`${prefix}txt`);

        countryChildDiv.append(h2, pPopulacao, pRegiao, pCapital);
        countryDiv.append(img, countryChildDiv);


        container.appendChild(countryDiv);
    });
}
function updateTheme() {
    let theme = localStorage.getItem('theme');
    if (!theme) { return };

    let updatePrefix = theme === 'dark' ? 'dm-' : 'lm-';
    let toRemovePrefix = theme === 'dark' ? 'lm-' : 'dm';

    document.querySelectorAll('*').forEach(element => {
        const toRemove = [];
        const toAdd = [];

        element.classList.forEach(classs => {
            if (classs.startsWith(toRemovePrefix)) {
                toRemove.push(classs);
                toAdd.push(updatePrefix + classs.substring(updatePrefix.length));
            }
        });

        toRemove.forEach(c => element.classList.remove(c));
        toAdd.forEach(c => element.classList.add(c));
    });
}

function changeTheme() {
    let theme = localStorage.getItem('theme');
    if (!theme) {
        theme = 'light'
    } else {
        theme = theme === 'dark' ? 'light' : 'dark';
    }

    let oldPrefix = theme === 'dark' ? 'lm-' : 'dm-';
    let newPrefix = theme === 'dark' ? 'dm-' : 'lm-';

    localStorage.setItem('theme', theme);

    document.querySelectorAll('*').forEach(element => {
        const toRemove = [];
        const toAdd = [];

        element.classList.forEach(classs => {
            if (classs.startsWith(oldPrefix)) {
                toRemove.push(classs);
                toAdd.push(newPrefix + classs.substring(oldPrefix.length));
            }
        });

        toRemove.forEach(c => element.classList.remove(c));
        toAdd.forEach(c => element.classList.add(c));
    });
}

function back() {
    document.getElementById('toogle-filters').style.display = 'none';
    document.getElementById('countryDetails').style.display = 'none';
    document.getElementById('btn-back-container').style.display = 'none';
    document.getElementById('main-countries-container').style.display = 'flex';
    document.getElementById('search-input-bar').style.display = 'flex';
    document.getElementById('main-countries-container').style.display = 'flex';
    document.getElementById('filter-toggle-container').style.display = 'flex';
}
import { useEffect, useState } from "react";
import axios from 'axios';

const Country = ({ country }) => {
  return <div>
    <h2>{country.name}</h2>
    <p>capital {country.capital}</p>
    <p>population {country.population}</p>
    <h3>languages</h3>
    <ul>
      {country.languages.map(l => <li key={l.iso639_2}>{l.name}</li>)}
    </ul>
    <img width="100px" alt={"flag of " + country.name} src={country.flag} />
  </div>
};

const CountryList = ({ countries }) => {
  return <ul>
    {countries.map(c => <li key={c.name}>{c.name}</li>)}
  </ul>
};

const Countries = ({ filter, countries }) => {
  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(filter.trim().toLowerCase())
  );

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />
  } else if (filteredCountries.length <= 10) {
    return <CountryList countries={filteredCountries} />
  } else {
    return <p>Too many matches, specify another filter</p>
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all')
      .then(rsp => {
        setCountries(rsp.data);
      })
      .catch(console.log)
  }, []);

  return (
    <>
      <div>
        find countries:
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <Countries filter={filter} countries={countries} />
    </>
  );
}

export default App;

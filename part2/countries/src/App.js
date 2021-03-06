import { useEffect, useState } from "react";
import axios from 'axios';

const Weather = ({ country }) => {
  const capitalOverrides = {
    "USA": "Washington DC"
  }

  const city = capitalOverrides[country.alpha3Code] ?? country.capital;

  const [weather, setWeather] = useState(null);
  useEffect(() => {
    if (city) {
      axios.get('http://api.weatherstack.com/current', {
        params: {
          access_key: process.env.REACT_APP_WEATHERSTACK_API_KEY,
          query: city,
        }
      }).then(rsp => {
        setWeather(rsp.data)
      }).catch(console.log);
    }
  }, [city]);

  if (weather === null || !(weather.current)) {
    // TODO: generally better handling of error responses
    return <></>;
  }

  // Using weather.request.query to show what weatherstack thinks we
  // requested.  It's not always the same thing as the restcountries.eu capital.
  return <div>
    <h2>Weather in {weather.request.query}</h2>
    <p><b>temperature:</b> {weather.current.temperature} Celsius</p>
    <p>
      <img
        src={weather.current.weather_icons[0]}
        alt={weather.current.weather_descriptions[0]} />
    </p>
    <p><b>wind:</b> {weather.current.wind_speed} kph direction {weather.current.wind_dir}</p>
  </div>;
}

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
    <Weather country={country} />
  </div>
};

const CountryList = ({ countries, setSelectedCountry }) => {
  return <ul>
    {countries.map(c =>
      <li key={c.name}>
        {c.name}
        &nbsp;
        <button onClick={() => { setSelectedCountry(c.alpha3Code) }}>show</button>
      </li>)}
  </ul>
};

const Countries = ({ selectedCountry, setSelectedCountry, filter, countries }) => {
  const filteredCountries = countries.filter(c =>
    selectedCountry !== '' ?
      selectedCountry === c.alpha3Code :
      c.name.toLowerCase().includes(filter.trim().toLowerCase())
  );

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />
  } else if (filteredCountries.length <= 10) {
    return <CountryList
      countries={filteredCountries}
      setSelectedCountry={setSelectedCountry} />
  } else {
    return <p>Too many matches, specify another filter</p>
  }
};

const App = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
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
        &nbsp;
        <input value={filter} onChange={(e) => {
          setFilter(e.target.value);
          setSelectedCountry('');
        }
        } />
      </div>

      <Countries
        filter={filter}
        countries={countries}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry} />
    </>
  );
}

export default App;

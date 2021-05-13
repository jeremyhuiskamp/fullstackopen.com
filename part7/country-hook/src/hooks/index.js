import { useState, useEffect } from 'react';
import axios from 'axios';

export const useField = type => {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return {
        type,
        value,
        onChange,
    };
};

export const useCountry = (name) => {
    const [country, setCountry] = useState(null);

    useEffect(() => {
        if (name === '') {
            setCountry({ found: false });
            return;
        }
        axios.get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
            .then(rsp => {
                if (rsp.data.length > 0) {
                    setCountry({
                        data: rsp.data[0],
                        found: true,
                    });
                } else {
                    setCountry({ found: false });
                }
            })
            .catch(e => {
                if (e.response?.status === 404) {
                    setCountry({
                        found: false,
                    });
                } else {
                    console.log(e);
                }
            });
    }, [name]);

    return country;
};
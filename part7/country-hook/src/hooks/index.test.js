import { useCountry } from '.';
import { waitFor } from '@testing-library/react';
import nock from 'nock';
import { renderHook } from '@testing-library/react-hooks';

// https://github.com/nock/nock#axios
import axios from 'axios';
axios.defaults.adapter = require('axios/lib/adapters/http');

describe('useCountry hook', () => {
    test('empty name', async () => {
        const { result } = renderHook(() => useCountry(''));
        console.log(result.current);
        await waitFor(() => expect(result.current.found).toEqual(false));
    });

    test('unknown name', async () => {
        nock('https://restcountries.eu')
            .get('/rest/v2/name/blahblah?fullText=true')
            .reply(404);

        const { result } = renderHook(() => useCountry('blahblah'));
        await waitFor(() => expect(result.current.found).toEqual(false));
    });

    test('valid name', async () => {
        nock('https://restcountries.eu')
            .get('/rest/v2/name/Canada?fullText=true')
            .reply(200, Canada);

        const { result } = renderHook(() => useCountry('Canada'));

        await waitFor(() => expect(result.current.found).toEqual(true));
        expect(result.current.data).toMatchObject({
            name: 'Canada',
            capital: 'Ottawa',
            population: 36155487,
            flag: 'https://restcountries.eu/data/can.svg',
        });
    });

    // TODO:
    // - use rerender() to prove that we only make a new request when the name changes
});

const Canada = [
    {
        'name': 'Canada',
        'topLevelDomain': [
            '.ca'
        ],
        'alpha2Code': 'CA',
        'alpha3Code': 'CAN',
        'callingCodes': [
            '1'
        ],
        'capital': 'Ottawa',
        'altSpellings': [
            'CA'
        ],
        'region': 'Americas',
        'subregion': 'Northern America',
        'population': 36155487,
        'latlng': [
            60,
            -95
        ],
        'demonym': 'Canadian',
        'area': 9984670,
        'gini': 32.6,
        'timezones': [
            'UTC-08:00',
            'UTC-07:00',
            'UTC-06:00',
            'UTC-05:00',
            'UTC-04:00',
            'UTC-03:30'
        ],
        'borders': [
            'USA'
        ],
        'nativeName': 'Canada',
        'numericCode': '124',
        'currencies': [
            {
                'code': 'CAD',
                'name': 'Canadian dollar',
                'symbol': '$'
            }
        ],
        'languages': [
            {
                'iso639_1': 'en',
                'iso639_2': 'eng',
                'name': 'English',
                'nativeName': 'English'
            },
            {
                'iso639_1': 'fr',
                'iso639_2': 'fra',
                'name': 'French',
                'nativeName': 'français'
            }
        ],
        'translations': {
            'de': 'Kanada',
            'es': 'Canadá',
            'fr': 'Canada',
            'ja': 'カナダ',
            'it': 'Canada',
            'br': 'Canadá',
            'pt': 'Canadá',
            'nl': 'Canada',
            'hr': 'Kanada',
            'fa': 'کانادا'
        },
        'flag': 'https://restcountries.eu/data/can.svg',
        'regionalBlocs': [
            {
                'acronym': 'NAFTA',
                'name': 'North American Free Trade Agreement',
                'otherAcronyms': [],
                'otherNames': [
                    'Tratado de Libre Comercio de América del Norte',
                    'Accord de Libre-échange Nord-Américain'
                ]
            }
        ],
        'cioc': 'CAN'
    }
];
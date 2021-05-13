import { useState } from 'react';

// useField is a hook that shortens the creation of input elements:
// ```
// const data = useField('text');
// return <input {...data} />
// ```
// The current value of the field can be accessed as `data.value`.
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
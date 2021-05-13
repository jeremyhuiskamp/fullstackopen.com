import { useState } from 'react';

// useField is a hook that shortens the creation of input elements:
// ```
// const data = useField('text');
// return <input {...data.input} />
// ```
// The current value of the field can be accessed as `data.input.value`.
// The field can be cleared with `data.reset()`.
export const useField = type => {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return {
        input: {
            type,
            value,
            onChange,
        },
        reset: () => setValue(''),
    };
};
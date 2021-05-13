import axios from 'axios';
import {
    useEffect,
    useState,
    // useEffect,
} from 'react';
// import axios from 'axios';

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

export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        axios.get(baseUrl)
            .then(rsp => {
                // Race condition:
                // if `create` is called immediately after the
                // hook is initialised, it's post could return
                // first, and set the initial resources.  So
                // we append here, instead of straight setting.
                // Probably only a unit test could possibly be
                // fast enough to hit this case...
                setResources(resources.concat(rsp.data));
            });
    }, [baseUrl]);

    const create = async resource =>
        axios.post(baseUrl, resource)
            .then(rsp => {
                setResources(resources.concat(rsp.data));
                return rsp.data;
            });

    return [
        resources,
        { create },
    ];
};

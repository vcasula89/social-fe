import {useState} from "react";

const useInput = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    return {
        value: value,
        handleChange,
    }
}

export default useInput;
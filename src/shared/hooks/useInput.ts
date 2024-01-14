import {useState} from "react";

export const useInput = () => {
    const [value, setValue] = useState('');

    const handleChange = (e: string) => {
        setValue(e);
    }

    return {
        value,
        onChange: handleChange
    }
}
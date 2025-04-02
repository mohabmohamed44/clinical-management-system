import { useState } from "react";

export default function useSessionStorage(key, initialValue) {
    const [storedValues, setStoredValue] = useState(() => {
        const saved = sessionStorage.getItem(key);
        return saved ? JSON.parse(saved) : initialValue;
    });

    const setValue = (value) => {
        setStoredValue(value);
        sessionStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValues, setValue];
}
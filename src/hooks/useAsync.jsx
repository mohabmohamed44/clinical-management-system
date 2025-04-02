import {useState, useEffect, useCallback} from 'react';

export default function useAsync(asyncFunction, dependencies = []) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);


    const execute = useCallback(async () => {
        try {
            setLoading(true);
            const result = await asyncFunction();
            setData(result);
            setError(null);
        } catch(err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        execute();
    }, [execute]);

    return {loading, error, data, execute};
}
import { useState, useEffect, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';

/**
 * useCookies hook
 *
 * @param {string} name Cookie name
 * @param {*} defaultValue Default value if cookie is not set
 * @param {Object} options Options to pass to js-cookie
 * @returns {Array} [value, updateCookies, deleteCookie]
 *
 * - `value`: The current value of the cookie
 * - `updateCookies`: A callback to update the cookie value
 * - `deleteCookie`: A callback to delete the cookie
 *
 * By default, the hook sets the cookie with the following options:
 * - `secure`: Ensures cookies are sent only over HTTPS
 * - `sameSite`: Prevents CSRF attacks
 * - `expires`: Default expiration time (7 days)
 * You can override these options by passing a custom options object as the third argument.
 */

export default function useCookies(name, defaultValue, options = {}) {
    const secureOptions = useMemo(() => ({
        secure: true, // Ensures cookies are sent only over HTTPS
        sameSite: 'Strict', // Prevents CSRF attacks
        expires: 7, // Default expiration time (7 days)
        ...options, // Allows overriding defaults
    }), [options]); // Only updates when options change

    const [value, setValue] = useState(() => {
        const cookie = Cookies.get(name);
        if (cookie) {
            return cookie;
        }
        Cookies.set(name, defaultValue, secureOptions);
        return defaultValue;
    });

    const updateCookies = useCallback((newValue, customOptions = {}) => {
        const finalOptions = { ...secureOptions, ...customOptions };
        Cookies.set(name, newValue, finalOptions);
        setValue(newValue);
    }, [name, secureOptions]);

    const deleteCookie = useCallback(() => {
        Cookies.remove(name, { secure: true, sameSite: 'Strict' });
        setValue(null);
    }, [name]);

    return [value, updateCookies, deleteCookie];
}

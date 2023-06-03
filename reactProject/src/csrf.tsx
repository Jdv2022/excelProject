import { useState, useEffect } from 'react';
import fetch from 'isomorphic-fetch';

export default function Csrf() {
    const [csrfToken, setCsrfToken] = useState<{ csrf_token: string }>({ csrf_token: '' });

    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                const response = await fetch('http://localhost:8000/get_csrf_token/');
                const { csrf_token } = await response.json();
                setCsrfToken({ csrf_token });
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        }

        if (csrfToken.csrf_token === '') {
            fetchCsrfToken();
        }
    }, [csrfToken]);
    return csrfToken.csrf_token;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const endpointUrl = `${apiBaseUrl}/get_csrf_token/`

export default async function Csrf() {
    try {
        const response = await fetch(endpointUrl);
        const csrf = await response.json();
        return csrf
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
}

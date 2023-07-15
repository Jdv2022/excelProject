export default async function Csrf() {
    try {
        const response = await fetch('http://localhost:8000/get_csrf_token/');
        const csrf = await response.json();
        return csrf
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
}

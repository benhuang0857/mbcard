// validate function
const loadAdmin = () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    account,
                    password
                })
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            alert('Login successful! Redirecting...');
            localStorage.setItem('token', data.token);
            window.location.href = '/admin/member';

        } catch (error) {
            document.getElementById('error-message').style.display = 'block';
        }
    });
}

loadAdmin();
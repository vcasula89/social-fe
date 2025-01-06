export const newPassword = async (params) => {
    try {
        const response = await fetch('http://localhost:8000/user/reset-password', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw Error(response.statusText);
        }
    } catch (error) {
        console.log(error, 'password Error')
        throw Error(error)
    }
}
export const isValidToken = async (token) => {
    try {
        const response = await fetch('http://localhost:8000/password-reset/check-restore-token/'+token, {
            method: 'GET',
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw Error(response.statusText);
        }
    } catch (error) {
        throw Error(error)
    }
}
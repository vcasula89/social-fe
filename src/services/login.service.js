export const login = async (loginParams) => {
    try {
        const response = await fetch('http://localhost:8000/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginParams)
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw Error(response.statusText);
        }
    } catch (error) {
        console.log(error, 'login Error')
        throw Error(error)
    }
}
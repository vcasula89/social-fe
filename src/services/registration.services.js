export const register = async (registrationParams) => {
    try {
        const response = await fetch('http://localhost:8000/user/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(registrationParams)
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data);
            return data
        }
    } catch (error) {
        console.log(error, 'registration Error')
        throw Error(error)
    }
}
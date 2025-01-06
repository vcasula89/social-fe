export const recoveryPassword = async (email) => {
    try {
        const response = await fetch('http://localhost:8000/user/recovery-password/'+email, {
            method: 'GET',
        });
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw Error(response.statusText);
        }
    } catch (error) {
        console.log(error, 'email Error')
        throw Error(error)
    }
}
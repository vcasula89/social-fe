import {useEffect, useState} from "react";

const MovieList = () => {
    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const resp = await fetch('https://api.sampleapis.com/movies/animation');
            const json = await resp.json();
            console.log(json)
            setData(json);
        } catch (err) {
            setData(err.message);
        }
    }

    useEffect(() => {
        getData();
        const myFunction = (e) => {
            console.log('resize', e);
        }

        window.addEventListener('resize', myFunction)
    }, []);
    useEffect(() => {
    }, [data])

    return (
        <>
            <ul>
                {data.map((item) => <li key={item.id}>{item.title}</li>)}
            </ul>

        </>
    )
}

export default MovieList;
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router";
import {clearUser} from "../reducers/user.slice.js";


const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        dispatch(clearUser());

        navigate('/');
    }

    return { logout }
}

export default useLogout
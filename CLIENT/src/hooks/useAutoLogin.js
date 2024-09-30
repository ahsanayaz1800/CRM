import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/auth-slice";
import { useHistory } from "react-router";

export const useAutoLogin = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const history = useHistory();

    
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/refresh`, {
                    withCredentials: true,
                });
                
                if (res.status === 200 && res.data.success) {
                    dispatch(setAuth(res.data.user));
                }
                
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    // Handle unauthorized access, e.g., by redirecting to login page
                    console.log("Unauthorized access, redirecting to login...");
                    dispatch(setAuth(null));  // Clear auth state
                    history.push('/login');    // Redirect to login page
                }
                setLoading(false);
            }
        })();
    }, [dispatch]);

    return loading;
};

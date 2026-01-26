import axios from 'axios';
import Cookies from 'js-cookie';

export const loginUser = async (email, password) => {

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    
    try {
        const response = await axios.post(`${BASE_URL}/Auth/Login`, {
            email,
            password,
        });

        if (response.status === 200) {
            Cookies.set('accessToken', response.data.accessToken, { expires: 1 }); 
            return { success: true, data: response.data };
        } else {
            console.error("Login unsuccessful", response.data);
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error("Login error:", error.response ? error.response.data : error.message);
        return {
            success: false,
            message: error.response ? error.response.data.message : error.message,
        };
    }
};

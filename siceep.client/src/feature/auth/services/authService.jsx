import api from "./../../../api/api";


export const Login = async (usuario) => {
    try {
        return await api.post(`Auth/Login`, usuario);
    } catch (error) {
        console.log(error.response.data);
    }
};


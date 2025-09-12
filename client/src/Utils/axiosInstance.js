import axios from 'axios';
import conf from "../config/config.js"

const secureApi = axios.create({
    baseUrl : conf.serverUrl,
    withCredentials: true,
});

const publicApi = axios.create({
    baseUrl : conf.serverUrl,
    withCredentials: true,
});

secureApi.interceptors.request.use((config)=>{
    const accessToken = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

secureApi.interceptors.response.use(
    (response) => {
        console.log("Response");
        return response
    },
    async (error) => {
        console.log(error);
        console.log("Reject");
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await axios.post(
                    `${conf.serverUrl}/user/getNewTokens`, {}, {withCredentials: true,}
                );
                const accessToken = response.data.data.accessToken;
                localStorage.setItem("accessToken", accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return secureApi(originalRequest);
            } catch (error){
                localStorage.removeItem("accessToken");
                localStorage.removeItem("loggedInUser");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
)

export { secureApi, publicApi };
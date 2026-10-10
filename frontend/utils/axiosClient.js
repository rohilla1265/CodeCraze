// import axios from "axios";
// const axiosClient = axios.create({
//     baseURL:'http://localhost:4000',
//     withCredentials: true,
//     headers:{
//         'Content-Type':'application/json'
//     }
// });
// export default axiosClient;
import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'https://code-craze-4qw1.onrender.com', // Render backend URL
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "https://blog-backend-zf94.onrender.com/api/v1";
export const regUser = async (formdata) => {
    try {
        const res = await axios.post(`${API}/user/register`, formdata, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return res.data;
    }
    catch (e) {
        return e.response.data
    }
}
export const changePhoto = async (formdata) => {
    try {
        const res = await axios.post(`${API}/user/updateProfilePhoto`, formdata, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })
        return res.data;
    }
    catch (e) {
        return e.response.data
    }
}
export const LogUser = async (formdata) => {

    try {
        const res = await axios.post(`${API}/user/login`, formdata, {
            withCredentials: true
        })
        console.log(res);
        return res.data;
    }
    catch (e) {
        return e.response.data;
    }
}

export const getAllBlogs = async () => {
    const res = await axios.get(`${API}/blog/getAllBlogs`, {
        withCredentials: true
    });
    return res.data;
}

export const getSingleBlog = async (id) => {
    const res = await axios.get(`${API}/blog/getBlogById/${id}`, {
        withCredentials: true
    });
    return res.data.curBlog
}

export const postBlog = async (formdata) => {
    const res = await axios.post(`${API}/blog/createBlog`, formdata, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        withCredentials: true
    })
}

export const getComments = async (id) => {
    const res = await axios.get(`${API}/blog/getCommentsOnBlog/${id}`, {
        withCredentials: true
    })
    // console.log(res.data);

    return res.data.temp;
}

export const getrecom = async(promptt)=>{
    try{
        const res = await axios.post(`${API}/blog/recom`,{prompt:promptt},
            {
                withCredentials:true
            }
        )
        console.log(res.data);
        
        return res.data.mainArr;
    }catch(e){
        console.log(e);
        
    }
}
export const postComment = async ({ cmnt, blogId }) => {
    console.log(cmnt);
    try {
        const res = await axios.post(`${API}/blog/comment`, { cmnt, blogId }, {
            withCredentials: true
        })
        return res.data
    }
    catch (e) {
        throw e.response.data
    }

}

export const logOutt = async () => {
    const res = await axios.get(`${API}/user/logout`, {
        withCredentials: true
    })
    return res.data
}

export const getUserBlogs = async () => {
    const res = await axios.get(`${API}/blog/getUserBlogs`, {
        withCredentials: true
    })
    return res.data.userBlogs;
}

export const deleteBlogById = async (id) => {
    const res = await axios.get(`${API}/blog/delBlogById/${id}`, {
        withCredentials: true
    })
    return res.data
}

export const callAI = async (prompt) => {
    try {
        console.log(prompt);

        const res = await axios.post(`${API}/blog/AI`, { prompt }, {
            withCredentials: true
        })
        // console.log(res.data.text);

        return res.data.text
    }
    catch (e) {
        console.log(e);

    }
}

export const getUserDetails = async () => {
    try {
        const res = await axios.get(`${API}/user/getUser`, {
            withCredentials: true
        })
        return res.data.curUser
    }
    catch (e) {
        console.log(e);
    }
}

export const Summarize = async (prompt) => {
    try {
        // console.log(prompt);

        const res = await axios.post(`${API}/blog/summarize`, { prompt }, {
            withCredentials: true
        })
        // console.log(res.data.text);

        return res.data.text
    }
    catch (e) {
        console.log(e);

    }
}

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${API}/user/getAllUser`, {
            withCredentials: true
        })
        return res.data.users
    }
    catch (e) {
        console.log(e);
    }
}

export const getNewUser = async (id) => {
    try {
        const userInfo = await axios.get(`${API}/user/getUserById/${id}`, {
            withCredentials: true
        })
        // console.log(userInfo);

        return userInfo.data.curUser
    } catch (e) {
        console.log(e);

    }
}

export const sendMsg = async ({ text, userid }) => {
    try {
        const res = await axios.post(`${API}/user/sendMsz`, { text, userid }, {
            withCredentials: true
        })
        return res.data.chats;
    }
    catch (e) {
        console.log(e);
    }
}
export const getMsg = async (userId) => {
    try {
        const res = await axios.get(`${API}/user/getMsz/${userId}`, {
            withCredentials: true
        })
        // console.log(res.data);

        return res.data.chatss.Msges;
    }
    catch (e) {
        console.log(e);
    }
}

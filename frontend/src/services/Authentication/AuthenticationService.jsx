import axios from "axios";

export const authService = {
    async register(userdata) {
        let responseResult = '';
        const response =  await axios.post('http://localhost:8000/api/register', userdata)
            .then(() => (responseResult = 'Success'))
            .catch(error => (responseResult = error.response.data.detail.toString()));
        responseResult = response;
        return responseResult;
    },

    async login(userdata) {
        let responseResult = '';
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(userdata)
            });
        responseResult = await response.json();
        return responseResult;
    },

    async isLoginned() {
        let responseResult = {
            detail: ''
        };
        const response = await fetch('http://localhost:8000/api/user', {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json'},
                        credentials: 'include',});
        responseResult = await response.json();
        return responseResult;
    },
    async logout() {
        let responseResult = '';
        const response = await axios.post('http://localhost:8000/api/logout',{}, {withCredentials: true});
        responseResult = response;
        return responseResult;
    },

    async moderate() {
        const response = await axios.get('http://localhost:8000/api/moderate', {withCredentials: true});
        return response.data;
    },

    async patchIngredient(data) {
        const response = await axios.patch(`http://localhost:8000/api/ingredients/${data.slug}`, data.data, {withCredentials: true});
        return response.data;
    },

    async patchCousin(data){
        const response = await axios.patch(`http://localhost:8000/api/cousins/${data.slug}`, data.data, {withCredentials: true});
        return response.data;
    },

    async patchCategory(data){
        const response = await axios.patch(`http://localhost:8000/api/categories/${data.slug}`, data.data, {withCredentials: true});
        return response.data;
    },

    async patchRecipe(data) {
        const response = await axios.patch(`http://localhost:8000/api/posts/${data.id}`, data.data, {withCredentials: true});
        return response.data;
    },
     
    async deleteIngredient(data) {
        const response = await axios.delete(`http://localhost:8000/api/ingredients/${data.slug}`, {withCredentials: true});
        return response.data;
    },

    async deleteCousin(data){
        const response = await axios.delete(`http://localhost:8000/api/cousins/${data.slug}`, {withCredentials: true});
        return response.data;
    },

    async deleteCategory(data){
        const response = await axios.delete(`http://localhost:8000/api/categories/${data.slug}`, {withCredentials: true});
        return response.data;
    },

    async deleteRecipe(data) {
        const response = await axios.delete(`http://localhost:8000/api/posts/${data.id}`, {withCredentials: true});
        return response.data;
    },

    async newModerator(data) {
        const response = await axios.patch(`http://localhost:8000/api/newmoderator`, {email: data}, {withCredentials: true});
        return response.data;
    },
    async banUser(data) {
        const response = await axios.patch(`http://localhost:8000/api/banuser`, data, {withCredentials: true});
        return response.data;
    },

    async getUser(id) {
        const response = await axios.get(`http://localhost:8000/api/user/${id}`, {withCredentials: true});
        return response.data;
    }
    // async login(userdata) {
    //     let responseResult = '';
    //     const response = await axios.post('http://localhost:8000/api/login', userdata,
    //         {withCredentials: true})
    //         .then(result => (responseResult = result.data))
    //         .catch(error => (responseResult = error.response.data.detail.toString()));
    //     console.log('login = ', responseResult);
    //     return responseResult;
    // },
}

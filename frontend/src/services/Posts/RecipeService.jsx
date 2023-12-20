import axios from "axios";
import { BASE_URL } from "../..";


export const recipeService = {
    //recipe
    async getPosts() {
        const response = await axios.get(BASE_URL + '/posts', {withCredentials: true});
        // console.log("response data = ", response.data);
        return response.data;
    },
    async postRecipe(rcp) {
        const response = await axios.post(BASE_URL + '/posts', rcp,
            {withCredentials: true, headers: {'Content-Type': 'multipart/form-data'}});
        return response.data;
    },
    async getRecipe(id) {
        const response = await axios.get(`${BASE_URL}/posts/${id}`, {withCredentials: true});
        return response.data;
    },

    // ingredient
    async getIngredients() {
        const response = await axios.get(`${BASE_URL}/ingredients`, {withCredentials: true});
        return response.data;
    },
    async postIngredient(ingr) {
        let result = {message: ''};
        const response = await axios.post(`${BASE_URL}/ingredients`, ingr, {withCredentials: true})
        .then(() => result.message = 'success')
        .catch((error) => (result.message = 'error: ' + error.response.data[Object.keys(error.response.data)[0]]));
        result.data = response.data
        return result;
    },

    // composition
    async postComposition(comp) {
        let result = {message: ''};
        await axios.post('http://localhost:8000/api/composition', comp, {withCredentials: true})
        .then(() => result.message = 'success')
        .catch((error) => (result.message = 'error: ' + error.response.data[Object.keys(error.response.data)[0]]));
        return result;
    },

    // measure
    async getMeasures() {
        const response = await axios.get('http://localhost:8000/api/measures', {withCredentials: true});
        return response.data;
    },

    // category
    async getCategories() {
        const response = await axios.get('http://localhost:8000/api/categories', {withCredentials: true});
        return response.data;
    },
    async getCategory(slug) {
        const response = await axios.get('http://localhost:8000/api/categories/' + slug.toString(), {withCredentials: true});
        return response.data;
    },
    async postCategory(cat) {
        let result = {message: ''};
        const response = await axios.post('http://localhost:8000/api/categories', cat, {withCredentials: true})
        .then(() => result.message = 'success')
        .catch((error) => (result.message = 'error: ' + error.response.data[Object.keys(error.response.data)[0]]));
        result.data = response.data;
        return result;
    },

    // cousin
    async getCousins() {
        const response = await axios.get('http://localhost:8000/api/cousins', {withCredentials: true});
        return response.data;
    },
    async getCousin(slug) {
        const response = await axios.get('http://localhost:8000/api/cousins/' + slug, {withCredentials: true});
        return response.data;
    },
    async postCousin(cous) {
        let result = {message: ''};
        const response = await axios.post('http://localhost:8000/api/cousins', cous, {withCredentials: true})
        .then(() => result.message = 'success')
        .catch((error) => (result.message = 'error: ' + error.response.data[Object.keys(error.response.data)[0]]));
        result.data = response.data;;
        return result;
    },


    // rating
    async getRating(user, recipe){
        const response = await axios.get(`http://localhost:8000/api/ratings/user/${user}/recipe/${recipe}`, {withCredentials: true});
        return response.data;
    },
    async patchRating(stars, user, recipe) {
        const response = await axios.patch(`http://localhost:8000/api/ratings/user/${user}/recipe/${recipe}`, {"user": user, 'recipe': recipe, 'star': stars}, {withCredentials: true});
        return response.data;
    },
    async getSearch(data) {
        const response = await axios.post('http://localhost:8000/api/relevant', data);
        return response.data;
    },
    async userPosts(user) {
        const response = await axios.get(`http://localhost:8000/api/userposts/${user}`, {withCredentials: true});
        return response.data;
    }
}
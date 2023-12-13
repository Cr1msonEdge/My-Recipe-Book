import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "../../pages/Home/Home";
import About from "../../pages/About/About";
import Register from "../../pages/Register/Register";
import RegisterSuccess from "../../pages/Register/RegisterSuccess";
import Login from "../../pages/Login/Login";
import CategoryList from "../../pages/Categories/Category";
import CousinList from "../../pages/Cousin/Cousin";
import Profile from "../../pages/Profile/Profile";
import AddRecipe from "../../pages/AddRecipe/AddRecipe";
import Recipe from "../../pages/Recipe/Recipe";
import AddSomethingNew from "../../pages/AddSomethingNew/AddSomethingNew";
import RecipeInCousin from "../../pages/Cousin/RecipeInCousin/RecipeInCousin";
import RecipeInCategory from '../../pages/Categories/RecipeInCategory/RecipeInCategory'
import AdminPanel from "../../pages/admin_panel/AdminPanel";
import RecipeModerate from "../../pages/admin_panel/RecipeModerate";
import AdminMenu from "../../pages/admin_panel/Menu/AdminMenu";
import NewModerator from "../../pages/admin_panel/NewModerator/NewModerator";
import BanUser from "../../pages/admin_panel/BanUser/BanUser";
import UserProfile from "../../pages/UserProfile/UserProfile";


function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home/>} path={'/'}></Route>
                <Route element={<About/>} path={'/about'}></Route>
                <Route element={<Register/>} path={'/register'}></Route>
                <Route element={<RegisterSuccess/>} path={'/register-success'}></Route>
                <Route element={<Login/>} path={'/login'}></Route>
                <Route element={<CategoryList/>} path={'/categories'}></Route>
                <Route element={<CousinList/>} path={'/cousin'}></Route>
                <Route element={<Profile/>} path={'/profile'}></Route>
                <Route element={<AddRecipe/>} path={'/addrecipe'}></Route>
                <Route element={<Recipe/>} path={`/post/:id`}></Route>
                <Route element={<AddSomethingNew/>} path={'/addnew'}></Route>
                <Route element={<RecipeInCategory/>} path={'/categories/:slug'}></Route>
                <Route element={<RecipeInCousin/>} path={'/cousins/:slug'}></Route>
                <Route element={<AdminPanel/>} path={'/admin'}></Route>
                <Route element={<AdminMenu/>} path={`/admin-menu`}></Route>
                <Route element={<NewModerator/>} path={`/new-moderator`}></Route>
                <Route element={<BanUser/>} path={`/ban`}></Route>
                <Route element={<UserProfile/>} path={`/user/:id`}></Route>
                <Route element={<RecipeModerate/>} path={`admin/post/:id`}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
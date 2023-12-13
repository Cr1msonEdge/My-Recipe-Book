import React from "react";
import Core from "../../ui/Core/core";
import ButtonToRegister from "./ButtonToRegister";

function NotLoggenIn() {
    return(
        <Core>
            <div>Вы не вошли в аккаунт!</div>
            <ButtonToRegister></ButtonToRegister>
        </Core>
    )
}

export default NotLoggenIn
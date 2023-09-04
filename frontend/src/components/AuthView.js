import { Fragment, useEffect } from "react";
import { isAuthrozied as isAuthorized } from "../authorization/Token";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function AuthView(props) {
    const navigate = useNavigate();

    return (
        <Fragment>
            {isAuthorized() ? props.children :  navigate("/")}
        </Fragment>
    )
}
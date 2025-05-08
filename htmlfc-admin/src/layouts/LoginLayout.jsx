import { Outlet } from "react-router-dom";
import "./css/LoginLayout.css";

export default function LoginLayout(){
    return (
        <div className="d-flex nm-aic nm-vh-md-100 login-layout" style={{position: "relative"}}>

            <div className="overlay"></div>
            <Outlet />
        </div>
    );
}
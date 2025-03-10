import Cookies from "js-cookie";

export default function Logout(){
    Cookies.remove("token");
    window.location.href = "/"
}
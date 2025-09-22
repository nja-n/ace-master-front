import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InviteRedirect = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("referralCode", code);
        navigate("/");
    }, [code, navigate]);
    return null;
};

export default InviteRedirect;

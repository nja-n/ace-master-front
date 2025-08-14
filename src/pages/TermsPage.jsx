import { terms } from "../components/methods";

const TermsPage = () => {
    return (
        <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}>
            <iframe
                src={terms}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Terms and Conditions"
            />
        </div>
    );
};

export default TermsPage;
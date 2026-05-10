import { BrowserRouter } from "react-router-dom";

const AppRouterProvider = ({ children }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
};

export default AppRouterProvider;


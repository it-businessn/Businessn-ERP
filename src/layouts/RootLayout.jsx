import { Outlet } from "react-router-dom";

const RootLayout = () => {
    return (
        <div className="layout">
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;

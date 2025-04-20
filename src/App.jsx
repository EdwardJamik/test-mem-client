import Header from "./Components/Header/Header.jsx";
import { ThemeProvider } from "next-themes";
import {Route, Routes} from "react-router-dom";
import {Suspense} from "react";
import ListPage from "./Pages/listPage/ListPage.jsx";
import TablePage from "./Pages/tablePage/TablePage.jsx";
import NotFound from "./Pages/NotFound/NotFound.jsx";
import {ModalProvider} from "./Context/ModalContext.jsx";
import EditModal from "./Components/Modal/Modal.jsx";

function App() {
    const routes = [
        {
            link: '/',
            element: <TablePage/>,
        },
        {
            link: '/list',
            element: <ListPage/>,
        },
        {
            link: '*',
            element: <NotFound/>,
        }
    ];

    return (
        <ThemeProvider attribute="class" defaultTheme="dark">
            <ModalProvider>
                <main className="text-foreground bg-background">
                    <Routes>
                        {routes.map(route => (
                            <Route
                                key={route.link}
                                path={route.link}
                                element={
                                    <Suspense>
                                        <Header/>
                                        {route.element}
                                    </Suspense>
                                }
                            />
                        ))}
                    </Routes>
                </main>
                <EditModal/>
            </ModalProvider>
        </ThemeProvider>
    );
}

export default App;
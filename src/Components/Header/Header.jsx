import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link
} from "@heroui/react";
import Logo from '../../Assets/Images/logo.png'
import {ThemeSwitcher} from "../ThemeSwitcher/ThemeSwitcher.jsx";
import {useLocation} from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const location = useLocation();

    const menuItems = [
        { label: "Список", path: "/list" },
        { label: "Таблиця", path: "/" }
    ];

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth='2xl'>
            <NavbarContent>
                <NavbarBrand>
                    <img width='50px' height='50px' src={Logo} alt="Logo"/>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-20" justify="center">
                {menuItems.map(item => (
                    <NavbarItem
                        key={item.path}
                        isActive={location.pathname === item.path}
                    >
                        <Link href={item.path}>
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitcher />
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={item.path}>
                        <Link
                            className="w-full"
                            href={item.path}
                            size="lg"
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
};

export default Header;
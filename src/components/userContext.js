import { createContext, useContext, useEffect, useState } from 'react';
import userService from '~/services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = userService.getUser();
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, [])

    const logout = () => {
        userService.logoutUser();
        setUser(null);
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};

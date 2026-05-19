import {createContext, type ReactNode, useEffect, useState} from "react";
import axios from "axios";
import ENV from "../../env/index";


interface AuthProviderProps {
    children: ReactNode;
}

interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    roles: string[];
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }:AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get(ENV.API_BASE_URL + "/api/entity/me", { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}



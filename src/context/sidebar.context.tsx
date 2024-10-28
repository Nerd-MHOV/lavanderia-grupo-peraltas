'use client'
import { ReactNode, useContext, useReducer, createContext } from "react";

interface SidebarState {
    activeSidebar: boolean;
    dispatch?: React.Dispatch<{ type: string }>;
}

const INITIAL_STATE: SidebarState = {
    activeSidebar: false,
}

export const SidebarContext = createContext(INITIAL_STATE);

export const SidebarContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(SidebarReducer, INITIAL_STATE);

    return (
        <SidebarContext.Provider value={{ activeSidebar: state.activeSidebar, dispatch }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}


const SidebarReducer = (state: SidebarState, action: { type: string }) => {
    switch (action.type) {
        case "OPEN": {
            return {
                activeSidebar: false,
            }
        }
        case "CLOSE": {
            return {
                activeSidebar: true,
            }
        }
        case "TOGGLE": {
            return {
                activeSidebar: !state.activeSidebar,
            }
        }
        default:
            return state
    }
}
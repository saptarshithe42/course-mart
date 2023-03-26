import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";

export const AuthContext = createContext()

const authReducer = (state, action) => {

    switch(action.type){

        case 'LOGIN':
            return {...state, user : action.payload}

        case 'LOGOUT':
            return {...state, user : null}

        case 'AUTH_IS_READY':
            return {...state, user : action.payload, authIsReady : true}

        default:
            return state;
    }

}

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady : false
    })


    useEffect(() => {

        // observes user's sign-in state (communicates with firebase)
        // the function provided in this, fires everytime there is a change in authentication state
        // returns unsubscibe function to unsubscribe from this listener
        const unsub = projectAuth.onAuthStateChanged((user) => {
            dispatch({type : 'AUTH_IS_READY', payload : user})
            unsub()
        })

    }, [])


    console.log('AuthContext state : ', state);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}
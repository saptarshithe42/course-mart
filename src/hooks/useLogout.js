import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { projectAuth, projectFirestore } from "../firebase/config";

export const useLogout = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch, user } = useAuthContext()

    const logout = async () => {
        setError(null)
        setIsPending(true)

        // sign the user out
        try {

            // update online status
            const { uid } = user
            // await projectFirestore.collection("users").doc(uid).update({ online: false })

            await projectAuth.signOut()

            // dispatch logout action
            dispatch({ type: 'LOGOUT' })  // skipping the payload, will make user null in the reducer

            // update state

            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        }
        catch (err) {
            if (!isCancelled) {
                console.log(err.message);
                setError(err.message)
                setIsPending(false)
            }
        }
    }



    useEffect(() => {

        // cleanup function (runs when this component unmounts)
        return () => setIsCancelled(true)

    }, [])

    return { logout, error, isPending }
}
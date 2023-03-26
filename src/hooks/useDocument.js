import { useState, useEffect } from "react"
import { projectFirestore } from "../firebase/config"

export const useDocument = (collection, id) => {

    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)

    // realtime data for document
    useEffect(() => {

        const ref = projectFirestore.collection(collection).doc(id)

        const unsubscribe = ref.onSnapshot((snapshot) => {

            // update data only if document exists
            if (snapshot.data()) {
                setDocument({ ...snapshot.data(), id: snapshot.id })
                setError(null)
            }
            else
            {
                setError("No such document exists.")
            }


        }, (err) => {
            console.log(err.message);
            setError("failed to get document")
        })

        // cleanup function to unsubscribe on unmounting of the component that uses this hook

        return () => unsubscribe()


    }, [collection, id])

    return { document, error }
}
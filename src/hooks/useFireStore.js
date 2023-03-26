import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initialState = {
    document : null,
    isPending : false,
    error : null,
    success : null
}

const firestoreReducer = (state, action) => {

    switch(action.type)
    {
        case 'IS_PENDING':
            return { isPending : true, document : null, success : false, error : null}

        case 'ADDED_DOCUMENT':
            return {isPending : false, document : action.payload, success : true, error : null}
            
        case 'DELETED_DOCUMENT':
            return {isPending : false, document : null, success : true, error : null}

        case "UPDATED_DOCUMENT" : 
            return {isPending : false, document : action.payload, success : true, error : null}

        case 'ERROR':
            return {isPending : false, document : null, success : false, error : action.payload}

        default:
            return state;
    }

}

export const useFirestore = (collection) => {

    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collection ref
    const ref = projectFirestore.collection(collection)

    // only dispatch if not cancelled
    const dispatchIfNotCancelled = (action) => {

        if(!isCancelled){
            dispatch(action)
        }

    }

    // add a document
    const addDocument = async (doc) => {

        dispatch({type : 'IS_PENDING'})

        try{
            const createdAt = timestamp.fromDate(new Date()) // timestamp

            // we can use the timestamp value to render items in ordered manner afterwards
            const addedDocument = await ref.add({...doc, createdAt})

            
            // state updation
            dispatchIfNotCancelled({type : 'ADDED_DOCUMENT', payload : addedDocument})

        }
        catch(err){
            dispatchIfNotCancelled({type : 'ERROR', payload : err.message})
        }
        
    }

    // delete a document
    const deleteDocument = async (id) => {

        dispatch({type : 'IS_PENDING'})

        try{

            await ref.doc(id).delete()

            // state updation
            dispatchIfNotCancelled({type : 'DELETED_DOCUMENT'})

        }
        catch(err){
            dispatchIfNotCancelled({type : 'ERROR', payload : 'could not delete'})
        }

    }

    // update documents
    const updateDocument = async (id, updates) => {

        dispatch({type : "IS_PENDING"})

        try{
            const updateDocument = await ref.doc(id).update(updates)
            dispatchIfNotCancelled({type : "UPDATED_DOCUMENT", payload : updateDocument})
            return updateDocument
        }
        catch(err){
            dispatchIfNotCancelled({type : "ERROR", payload : err.message})
            return null
        }
    }



    /* Purpose of using isCancelled is that, if it is true, then we don't update any
    local state. This is to ensure that whenever this particular component unmounts from 
    the page (situation like : the user initiates an action and goes to some other page 
    before completion of the action), then react should not try to change state of any
    component. So, we set isCancelled to true. */
    // remember than clean-up function fires when the component unmounts
    useEffect(() => {

        // clean-up function
        return () => {setIsCancelled(true)}
    }, [])

    return {addDocument, deleteDocument, updateDocument, response}

}
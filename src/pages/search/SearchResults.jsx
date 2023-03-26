import React from 'react'
import { useParams } from 'react-router-dom'
import { projectFirestore } from '../../firebase/config'
import { useEffect, useState } from 'react'

// styles
import "./SearchResults.css"


// components
import BooksGrid from '../../components/BooksGrid'
import LoadingAnimation from '../../components/LoadingAnimation'

function SearchResults() {

    const { query } = useParams()

    const [bookList, setBookList] = useState([])
    const [fetchLimit, setFetchLimit] = useState(5)
    const [isLoading, setIsLoading] = useState(true)

    const fetchQueryData = async () => {

        try {
            const booksRef = projectFirestore.collection("books")

            let docs = await booksRef
            .where("name", ">=", query)
            .where("name" , "<=" , query + '\uf8ff')
            .limit(fetchLimit).get()

            let arr = []
            docs.forEach((doc) => {
                // doc.data()
                arr.push({ ...doc.data(), id: doc.id })
                console.log(doc.data())

            })

            setBookList(arr)
            setIsLoading(false)
        } catch (err) {
            alert(err)
        }

    }

    useEffect(() => {

        fetchQueryData()

    }, [fetchLimit])


    const incrementFetchLimit = () => {

        setFetchLimit((prev) => {
            return (prev + 5);
        })

    }

    return (
        <div>
            {isLoading ? <LoadingAnimation /> :

                <div>
                    <BooksGrid bookList={bookList} />
                    <div style={{textAlign : "center"}}>
                        <button
                            className="btn btn-primary"
                            onClick={incrementFetchLimit}
                        >More</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default SearchResults
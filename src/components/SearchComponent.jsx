import React from "react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// styles
import "./SearchComponent.css"

// components


function SearchComponent() {

    const [searchWord, setSearchWord] = useState("")

    const navigate = useNavigate()

    let queryString = searchWord.trim()

    const searchRequest = () => {

        navigate(`/search/${queryString}`)

    }


    return (
        <div className="search-component">
            <form className="search-form">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="searchbar"
                        aria-describedby="searchbar"
                        onChange={(e) => {setSearchWord((e.target.value.toUpperCase()))}}
                        value={searchWord}
                        autoComplete="off"
                        required
                    />

                </div>
                <button type="submit" 
                className="btn btn-primary"
                onClick={searchRequest}
                >Search</button>
            </form>

        </div>
    )
}

export default SearchComponent
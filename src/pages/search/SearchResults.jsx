import React from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../firebase/config";
import { useEffect, useState } from "react";

// styles
import "./SearchResults.css";

// components
import LoadingAnimation from "../../components/LoadingAnimation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseGrid from "../../components/CourseGrid";

function SearchResults() {
    const { query } = useParams();

    const [courseList, setCourseList] = useState([]);
    const [fetchLimit, setFetchLimit] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchQueryData = async () => {
        try {
            const courseRef = projectFirestore.collection("courses");

            let docs = await courseRef
                .where("isPublished", "==", true)
                .where("name", ">=", query)
                .where("name", "<=", query + "\uf8ff")
                .limit(fetchLimit)
                .get();

            let arr = [];
            docs.forEach((doc) => {
                // doc.data()
                arr.push({ ...doc.data(), id: doc.id });
                console.log(doc.data());
            });

            setCourseList(arr);
            setIsLoading(false);
        } catch (err) {
            // alert(err)

            console.log(err.message);

            toast.error(err.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    useEffect(() => {
        fetchQueryData();
    }, [fetchLimit]);

    const incrementFetchLimit = () => {
        setFetchLimit((prev) => {
            return prev + 5;
        });
    };

    return (
        <div>
            {isLoading ? (
                <LoadingAnimation />
            ) : (
                <div className="main-div">
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover={false}
                        theme="light"
                    />
                    <h1 className="list-heading">
                        Search Results for "{query}"
                    </h1>
                    <CourseGrid courseList={courseList} cardType="course" />

                    <button
                        className="btn btn-primary"
                        onClick={incrementFetchLimit}
                    >
                        More
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchResults;

import React from 'react'
import { projectFirestore } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'

// styles
import "./DraftCard.css"

function DraftCard({ course }) {

    const { user } = useAuthContext()

    const deleteDraft = async (courseID) => {

        try {

            // delete ID from user's drafts array
            const userRef = projectFirestore.collection("users").doc(user.uid)

            let draftArr = (await userRef.get()).data().drafts

            draftArr = draftArr.filter((course_id) => (course_id !== courseID))

            await userRef.update({
                drafts : draftArr
            })

            // delete document from "courses" and "course_contents" collections
            await projectFirestore.collection("courses").doc(courseID).delete()
            await projectFirestore.collection("course_contents").doc(courseID).delete()

            window.location.reload(true)

        } catch (err) {
            alert(err)
        }

    }

    return (
        <div className="col col-lg-4 col-md-6 col-sm-12 card-holder-div">
            <div className="card" style={{ width: "15rem", overflow: "hidden" }}>
                <img src={course.imgUrl} className="card-img" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <a href={`/content_upload/${course.name}/${course.id}`} className="btn btn-primary">Upload Content</a>
                    <button className="btn btn-danger"
                        style={{ margin: "1rem" }}
                        onClick={() => { deleteDraft(course.id) }}
                    >Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DraftCard
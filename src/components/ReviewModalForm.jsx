import React, { useState } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';

// components
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';


function ReviewModalForm(props) {

    const {user} = useAuthContext()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")

    const { id, show, course, onHide} =  props 

    const handleRating = (rate) => {
        setRating(rate)
    }

    const submitReview = async () => {

        try {

            const reviewObj = {
                courseID : id,
                userID : user.uid,
                date : timestamp.fromDate(new Date()),
                rating: rating,
                comment: comment,
                username : user.displayName
            }

            // console.log(reviewObj);
            // console.log(id);
            // console.log(course);

            const reviewRef = projectFirestore.collection("reviews")

            await reviewRef.add(reviewObj)

            const courseRef = projectFirestore.collection("courses").doc(id)

            let avgRating = ((course.avgRating * course.ratedCount) + Number(rating)) / (course.ratedCount + 1)

            await courseRef.update({
                avgRating: avgRating,
                ratedCount: (course.ratedCount + 1)
            })

            onHide()

            toast.success("Review added !", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        } catch (err) {
            toast.error(err.message, {
                position: "top-center"
            })
        }


    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Rate Course
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="rating-modal-header" style={{ textAlign: "center" }}>
                    <h4>
                        <Rating
                            onClick={handleRating}
                            allowFraction={true}
                        />
                    </h4>
                    <h5>{rating} / 5</h5>
                </div>
                <h5>Comment :-</h5>
                <textarea
                    style={{ height: "100%", width: "100%" }}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>close</Button>
                <Button onClick={submitReview}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReviewModalForm;
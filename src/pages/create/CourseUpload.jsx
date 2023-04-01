import React from "react"
import { useState } from "react"
import { useAuthContext } from "../../hooks/useAuthContext"
import { projectStorage, projectFirestore, timestamp } from "../../firebase/config"
import { useNavigate } from "react-router-dom"

// styles
import "./CourseUpload.css"

// components
import LoadingAnimation from "../../components/LoadingAnimation"
import InfoModal from "../../components/InfoModal"

// icons
import { AiFillInfoCircle } from "react-icons/ai"

function CourseUpload() {
	const [courseName, setCourseName] = useState("")
	const [creatorNames, setCreatorNames] = useState("")
	const [language, setLanguage] = useState("")
	const [price, setPrice] = useState(0)
	const [description, setDescription] = useState("")
	const [thumbnail, setThumbnail] = useState(null)
	const [thumbnailError, setThumbnailError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	
	const navigate = useNavigate()

	const {user} = useAuthContext()

	const handleThumbnailChange = (e) => {

		// to reset any selected image
		setThumbnail(null)

		let selected = e.target.files[0]  // selecting first element of array of files
		console.log(selected)

		if (!selected) {
			setThumbnailError("Please select a file")
			return
		}

		if (!selected.type.includes("image")) {
			alert("selected file must be an image");
			setThumbnailError("selected file must be an image")
			return
		}

		// in case of no error
		setThumbnailError(null)

		setThumbnail(selected)
		console.log("thumbnail updated")
	}


	const handleSubmit = async (e) => {

		e.preventDefault()

		setIsLoading(true)

		// forming an array of creator names
		let creatorList = creatorNames.split(",")
		creatorList = creatorList.map((name) => {
			return (name.trim()).toUpperCase();
		})

		// uploading data

		try {

			// uploading thumbnail
			const imgUploadPath = `thumbnails/${user.uid}/${thumbnail.name}`

			const img = await projectStorage.ref(imgUploadPath).put(thumbnail)

			const imgUrl = await img.ref.getDownloadURL()  // getting the url of the image

			// console.log(fileUrl);

			// course document to be written into "courses" collection
			let courseObj = {

				name: (courseName.trim()).toUpperCase(),
				creatorList: creatorList,
				enrolledCount : 0,
				createdBy: user.displayName,
				imgUrl: imgUrl,
				updatedAt: timestamp.fromDate(new Date()),
				language: (language.trim()).toUpperCase(),
				description: description.trim(),
				price : Number(price),
				ratedCount : 0,
				avgRating : 0,
				isPublished : false,
				createdByID : user.uid

			}

			const addedCourse = await projectFirestore.collection("courses").add(courseObj)

			const contentEntry = {
				name : (courseName.trim()).toUpperCase(),
				id : addedCourse.id,
				content : [],
				imgUrl : imgUrl,
				updatedAt: timestamp.fromDate(new Date())
			}

			// create a course entry in the "course_contents" collection
			await projectFirestore.collection("course_contents").doc(addedCourse.id).set(contentEntry)

			const userRef = projectFirestore.collection("users").doc(user.uid);

			// entry to be made in user's drafts list
			let draftsArr = (await userRef.get()).data().drafts


			draftsArr.push(addedCourse.id)
			// adding currently created course ID in drafts array in user's document
			await userRef.update({
				drafts : draftsArr
			})

			setIsLoading(false)
			navigate("/drafts")
		}
		catch (err) {
			alert(err.message)
		}

	}

	const instructionModal = {
		title: "Instructions",
		text: "After filling following details, click on \"Initialize\", then go to \"Drafts\" , upload course \
		contents, and publish your course."
	}

	return (
		<div>
			{isLoading ? <LoadingAnimation /> : <div>
				<div style={{ textAlign: "center", marginTop : "1rem" }}>
					<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
						<AiFillInfoCircle fontSize="1.1rem" />
						<span>&nbsp;Instructions</span>
					</button>
				</div>
				<InfoModal content={instructionModal} />
				<form className="course-form" onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="courseName" className="form-label">Course Name :</label>
						<input
							type="text"
							className="form-control"
							id="courseName"
							aria-describedby="courseName"
							autoComplete="off"
							onChange={(e) => setCourseName(e.target.value)}
							value={courseName}
							required
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="creatorNames" className="form-label">Creator name (s) :</label>
						<input
							type="text"
							className="form-control"
							id="creatorNames"
							aria-describedby="creatorNames"
							autoComplete="off"
							onChange={(e) => setCreatorNames(e.target.value)}
							value={creatorNames}
							required
						/>
						<div id="creatorNames" className="form-text">(For multiple creators, write their names in comma separated fashion : creator1,creator2,creator3)</div>
					</div>

					<div className="mb-3">
						<label htmlFor="language" className="form-label">Language :</label>
						<input
							type="text"
							className="form-control"
							id="language"
							aria-describedby="language"
							autoComplete="off"
							onChange={(e) => setLanguage(e.target.value)}
							value={language}
							required
						/>
					</div>
					<div className="mb-3 input-group">
						<label htmlFor="price" className="form-label">Price :&nbsp;</label>
						<span className="input-group-text">Rs</span>
						<input
							type="text"
							className="form-control"
							id="price"
							aria-describedby="price"
							autoComplete="off"
							onChange={(e) => setPrice(e.target.value)}
							value={price}
							required
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="description" className="form-label">Description :</label>
						<textarea
							className="form-control"
							id="description"
							aria-describedby="description"
							autoComplete="off"
							onChange={(e) => setDescription(e.target.value)}
							value={description}
							required
						/>
						<div id="description" className="form-text">Kindly mention pre-requisites as well (if any)</div>
					</div>

					<div className="mb-3">
						<label htmlFor="imgFile" className="form-label">Upload thumbnail (image) :</label>
						<input
							className="form-control"
							type="file"
							id="imgFile"
							onChange={handleThumbnailChange}
							required
						/>
					</div>
					<div style={{ textAlign: "center" }}>
						{thumbnail && !thumbnailError && <button type="submit" className="btn btn-primary">
							<span>Initialize</span>
						</button>}
					</div>
				</form>
			</div>}
		</div>
	)
}

export default CourseUpload
import React from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useState } from "react"
import { projectStorage } from "../firebase/config"


import "./ProfilePicture.css"

function ProfilePicture({ src, displayName }) {

	const { user } = useAuthContext()
	const [updateRequest, setUpdateRequest] = useState(false)
	const [thumbnail, setThumbnail] = useState(null)
	const [thumbnailError, setThumbnailError] = useState(null)

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
			setThumbnailError("selected file must be an image")
			alert("selected file must be an image")
			return
		}

		// in case of no error
		setThumbnail(selected)
		setThumbnailError(null)

		console.log("thumbnail updated")
	}


	const updatePicture = async () => {

		try {
			const uploadPath = `thumbnails/${user.uid}/${thumbnail.name}`

			const img = await projectStorage.ref(uploadPath).put(thumbnail)

			const imgUrl = await img.ref.getDownloadURL()  // getting the url of the image

			// add display name to user

			await user.updateProfile({ photoURL: imgUrl })

			setUpdateRequest(false)

			window.location.reload(true);
		}
		catch (err) {
			alert(err)
		}

	}

	const cancelRequest = () => {
		setUpdateRequest(false)
	}

	return (
		<div className="profile-div">
			<img src={src} className="profile-img" />
			<p>{displayName}</p>
			{!updateRequest &&
				<button
					className="btn btn-primary"
					onClick={() => { setUpdateRequest(true) }}
				>
					Update Picture
				</button>
			}
			{updateRequest &&
				<div className="input-div">
					<input
						type="file"
						onChange={handleThumbnailChange}
						required
						className="img-input-box"
					/>

					{!thumbnailError && thumbnail && <button className="btn btn-primary"
						onClick={updatePicture}
					>Update</button>}

					<button className="btn btn-primary"
						onClick={cancelRequest}
					>Cancel</button>
				</div>

			}
		</div>
	)
}

export default ProfilePicture
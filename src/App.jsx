import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

// components
import Navbar from "./components/Navbar"
import { useAuthContext } from "./hooks/useAuthContext";


// pages
import Login from "./pages/login/Login"
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import CourseUpload from "./pages/create/CourseUpload"
// import BookDetails from "./pages/book_details/BookDetails";
// import SearchResults from "./pages/search/SearchResults";
import OffCanvas from "./components/OffCanvas";
// import WishList from "./pages/wishlist/WishList"
// import UploadedBooks from "./pages/uploaded_books/UploadedBooks"
// import DownloadedBooks from "./pages/download_books/DownloadedBooks";
import Draft from "./pages/drafts/Draft";
import ContentUpload from "./pages/create/ContentUpload";


function App() {

  const { user } = useAuthContext()

  console.log(user);

  return (
    <div className="App">
      <Navbar />
      {user && <OffCanvas />}
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* {user && <Route path="/wishlist" element={<WishList />} />} */}

          {/* {user && <Route path="/created_courses" element={<UploadedBooks />} />} */}

          {/* {user && <Route path="/purchased_courses" element={<DownloadedBooks />} />} */}

          {user && <Route path="/create" element={<CourseUpload />} />}

          {user && <Route path="/drafts" element={<Draft />} />}

          {user && <Route path="/content_upload/:courseName/:id" element={<ContentUpload />} />}


          {/* <Route path="/book/:id" element={<BookDetails />} /> */}

          {/* <Route path="/search/:query" element={<SearchResults />} /> */}

          <Route path="/login" element={!user ? <Login /> : <Dashboard />} />

          <Route path="/signup" element={!user ? <Signup /> : <Dashboard />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;

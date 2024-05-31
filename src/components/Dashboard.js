import '../styles/Post.css'
import React, { Fragment, useEffect, useState } from 'react'; 
//useEffects is something changing as a result of a state changing in the application
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../logo.png';
import Modal from 'react-modal';
import Footer from './Footer.js';

// Set the root element for the modal
Modal.setAppElement('#root');

const Dashboard = ({ setIsAuthenticated }) => {
    const user_id = localStorage.getItem('user_id');

    //invoke setPosts whenever you want to change something in posts.
    const [posts, setPosts] = useState([]);
    //manage modal's visibility, initially set to false
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalDelIsOpen, setModalDelIsOpen] = useState(false);
    //store the post currently being viewed, initially set to null
    const [selectedPost, setSelectedPost] = useState(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        // console.log(dropdownOpen);
    };

    //closes dropdown when mouse does not hover over dropdown component
    const handleMouseLeave = () => {
        setDropdownOpen(false);
    };

    //console.log posts whenever a change is made
    useEffect(() => {
        // console.log(posts);
      }, [posts]);

    
    // Open Modal
    const openModal = (post) => {
        setSelectedPost(post);
        setModalIsOpen(true);
        console.log('Modal is open');
        console.log(modalIsOpen);
        console.log(post);
        document.body.classList.add('no-scroll'); // Disable scrolling by adding the class
    };

    // Close Modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedPost(null);
        document.body.classList.remove('no-scroll'); // Enable scrolling by removing the class
    };


    // Account Deletion Modal conditions
    const delAccount = () => {
        setModalDelIsOpen(true);
    };

    const confirmDeleteAccount = async () => {
        setModalDelIsOpen(false);
        await deleteAccount();
    };

    const cancelDeleteAccount = () => {
        setModalDelIsOpen(false);
    };


    //Mark as read
    const markAsRead = async(postId) => {

        try {
            const user_id = localStorage.getItem('user_id');
            const body = { user_id, post_id: postId };

            // Update the users_posts table.
            // Send the POST request to the server
            const response = await fetch(`http://localhost:8000/allposts/markAsRead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            console.log('Post marked as read')

            //Update the posts array. 
            //locate the correct post in posts, using postId, to create a new read_status object. 
            setPosts(
                posts.map(post => 
                  // Check if the current post's ID matches the specified postId
                  post.post_id === postId 
                    ? { ...post, read_status: true } // If it matches, create a new post object with read_status set to true
                    : post // If it doesn't match, keep the post as it is
                )
            );
            

        } catch (err) {
            console.error(err.message);
        }
    };

    //combine function to open modal and mark post as read
    const handleOpenPost = (post) => {
        markAsRead(post.post_id);
        openModal(post);
        console.log(post.post_id);
    };


    //delete post function
    const deletePost = async id => {
        try {
            const user_id = localStorage.getItem('user_id');

            const deletePost = await fetch(`http://localhost:8000/allposts/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({user_id})
            });
            
            //setPosts updates the "posts" variable.
            //use filter to create a new array containing only the elements that meet a certain condition.
            //if the post_id, from the parent from which "delete" was clicked, does not match the post_id from the individual post from the post array (ie if TRUE), include it in the filtered array.
            setPosts(posts.filter(post => post.post_id !== id));

        } catch (err) {
            console.error(err.message);
        }
    }

    //get all posts AND read_status for each
    const getPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8000/allposts/${user_id}`);
            const jsonData = await response.json(); //parse the data into json
            // console.log(jsonData);

            setPosts(jsonData);

        } catch (err) {
            console.error(err.message);
        }
    }

    //useEffect is going to make a request to the API everytime the component is rendered. 
    //If you call getPosts directly in the component body, it would run every time the component renders, causing unnecessary API requests.
    useEffect(() => {
        getPosts(); //the code we want to run.
    }, [user_id]); //useEffect will run once when the page loads, and again if the user_id changes.


    //create name constant
    const [name, setName] = useState("")
    

    //get the name using the token
    async function getName() {
        try {
            const response = await fetch('http://localhost:8000/dashboard/', {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            // console.log(parseRes);

            setName(parseRes.user_name);

        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        getName()
    },[]); //adding [] causes it to make one request when component is rendered (instead of many).


    //Logout, remove localstorage data
    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        setIsAuthenticated(false);
    };


    //delete account
    const deleteAccount = async() => {

        try {
            // Retrieve user_id from local storage
            const user_id = localStorage.getItem('user_id');
            
            //if user id not found, log error
            if (!user_id) {
                console.error('No user ID found in local storage.');
                return;
            }

            // Send the DELETE request to the server
            const response = await fetch(`http://localhost:8000/auth/delete/${user_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                // Remove user data from local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('user_name');

                // Redirect to login page
                window.location = '/';

            } else {
                const parseRes = await response.json();
                console.error(parseRes);
            }

        } catch (err) {
            console.error(err.message);
        }
    };



    return (

        <Fragment>
            <div className='header'>
                <Link to={'/'}><img src={logo} alt='Groupomania' className='logo' /></Link>
                
                <div id='main-nav-links'>
                    <div className='dropdown'onMouseLeave={handleMouseLeave}>
                        <button className="dropbtn" onClick={toggleDropdown}>Account<i className="fas fa-caret-down"></i></button>
                        {dropdownOpen && (
                            <div className="dropdown-content">
                                <button onClick={logout}>Log out</button>
                                <button onClick={delAccount}>Delete Account</button>
                            </div>
                        )}
                    </div>

                    <Link className="link-button" to={'/inputpost'}>New Post</Link>
                </div>
            </div>

            <h1>Welcome, {name}</h1>
            
            {posts.map(post => (
                //change class name based on read or new. 
                <div key={post.post_id} className={`post ${post.read_status ? 'read' : 'new'}`}>
                    <div className="post-content">
                        <h2 onClick={() => handleOpenPost(post)}>{post.title}</h2>
                        <img onClick={() => handleOpenPost(post)} src={post.image_url} alt={post.image_alt}></img>
                    </div>

                    <div className="post-additional">
                        <div className="post-details">
                            <p className="username">by {post.user_name} -</p>
                            <p>- {post.read_status ? 'Read' : 'New'}</p>
                            
                        </div>

                        {/* only render post-edit when localStorage user_id == post.user_id */}
                        {localStorage.getItem('user_id') === post.user_id.toString() && (
                            <div className="post-edit">
                                <button><Link to={`/editpost/${post.post_id}`}>Edit Post</Link></button>
                                <button onClick={ () => deletePost(post.post_id)}>Delete</button>
                            </div>  
                        )}
                        
                    </div>
                        
                </div>  
            ))} 

            <Modal
                //re-render and opens as isOpen={true}
                isOpen={modalIsOpen}
                // handles other interactions to close modal, such as pressing ESC and clicking outside the modal.
                onRequestClose={closeModal}
            >
                {/* content inside the modal is rendered only when selectedPost is not null or undefined */}
                {selectedPost && (
                    <div id="modal">
                        
                        <div id="modal_header">
                            <h2>{selectedPost.title}</h2>
                            <button onClick={closeModal} className="close-modal"><i className="fas fa-times"></i></button>
                        </div>
                
                        <p>{selectedPost.text_content}</p>
                        <p>by {selectedPost.user_name}</p>
                        {/* only render the img component if image_url is not null */}
                        {selectedPost.image_url && (
                            <img src={selectedPost.image_url} alt={selectedPost.image_alt} />
                        )}
                        
                    </div>
                )}
            </Modal>


            {modalDelIsOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Confirm Account Deletion</h2>
                        <p>Are you sure you want to delete your account?<br></br>This action cannot be undone.</p>
                        <div className='del-actions'>
                            <button onClick={cancelDeleteAccount}>Cancel</button>
                            <button className='confirm' onClick={confirmDeleteAccount}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}


            <Footer />

        </Fragment>
    )

    
}

export default Dashboard
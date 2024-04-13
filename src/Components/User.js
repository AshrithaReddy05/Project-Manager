import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { FaFolder, FaThumbsUp } from 'react-icons/fa';

const User = ({ projectId }) => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likes, setLikes] = useState({});
  const [id, setId] = useState(null);
  const [cmnts, setCmnts] = useState([]);
  const [cmntcount, setCmntcount] = useState(0);
  const [usercmnt, setUsercmnt] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [cloading, setCLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setCLoading(true);
        // Make a GET request to fetch the current user details
        const response = await axios.get('http://localhost:5000/api/currentUser', { withCredentials: true });
        // Check if the username is correctly received from the response
        console.log("Response data:", response.data);
        // Ensure that response.data.user.userName contains the correct username
        setCurrentUser(response.data.user.username);
        console.log("user is", response.data.user.username);
        setCLoading(false);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setCLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/domains', {
          credentials: 'include'
        });
        const data = await response.json();
        setDomains(data.domains);
        setId(data.id);
        setUserName(data.name); // Set the user's name
        setLoading(false);
      } catch (error) {
        console.error('Error fetching domains:', error);
        setLoading(false);
      }
    };

    fetchDomains();

    setIsLiked(getIsLiked(projectId));
    // Pass projectId to fetchLikesCount
    if (projectId) {
      fetchLikesCount(projectId);
    }

  }, [projectId]); // Add projectId to the dependency array of useEffect

  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
  };

  const handleViewProjects = async () => {
    if (selectedDomain === '') {
      alert('Please select a domain.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/project?domain=${selectedDomain}`);
      const data = await response.json();
      if (data.project.length === 0) {
        alert("No projects are present as of now.");
      }
      setProjects(data.project);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setLikes(prevLikes => ({
      ...prevLikes,
      [project.projectName]: project.likes ? project.likes.length : 0
    }));
    setIsLiked(project.likes.some(like => like === id));
    setLikesCount(project.likes.length);
    setCmntcount(project.comments.length);
    setCmnts(project.comments);

  };

  const fetchLikesCount = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/project/likes/${selectedProject._id}`);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/project/like',
        { projectId: selectedProject._id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        // Toggle like status
        localStorage.setItem(projectId, newIsLiked ? 'liked' : 'not-liked');
        console.log("is liked ", newIsLiked);
        // Update likes count immediately
        setLikesCount(newIsLiked ? likesCount + 1 : likesCount - 1);
      }
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  const getIsLiked = (projectId) => {
    return localStorage.getItem(projectId) === 'liked';
  };

  const handleCommentChange = (e) => {
    setUsercmnt(e.target.value);
  };

  const handleSubmitComment = async (userName) => {
    try {
      const res = await axios.put(
        'http://localhost:5000/api/project/Coment',
        { projectId: selectedProject._id, text: usercmnt },
        { withCredentials: true }
      );
      if (res.status === 200) {
        alert("Comment added successfully ");

        // Create a new comment object with username and timestamp
        const newComment = { text: usercmnt, postedBy: userName, time: new Date() };

        // Prepend the new comment to the comments array
        setCmnts([newComment, ...cmnts]);

        // Sort comments by timestamp (newest first)
        setCmnts(prevCmnts => prevCmnts.sort((a, b) => new Date(b.time) - new Date(a.time)));

        // Update comments count
        setCmntcount(cmntcount + 1);

        // Clear the input field
        setUsercmnt("");
      }
      else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-end align-items-center">
            <select className="form-select me-2 mb-3" value={selectedDomain} onChange={handleDomainChange}>
              <option value="">Select Domain</option>
              {domains.map((domain) => (
                <option key={domain._id} value={domain.domainName}>{domain.domainName}</option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleViewProjects} style={{ backgroundColor: '#4caf50', border: 'none' }}>
              {loading ? 'Loading...' : 'View Projects'}
            </button>
          </div>
        </div>
        {projects.length > 0 && (
          <div className="row mt-4">
            <div className="col-md-12">
              <h3>Projects under {selectedDomain}</h3>
              <ul className="list-group">
                {projects.map((project) => (
                  <li key={project._id} className="list-group-item">
                    <FaFolder style={{ marginRight: '0.5rem', cursor: 'pointer' }} onClick={() => handleProjectClick(project)} />
                    {project.projectName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {selectedProject && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, color: 'black' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto' }}> {/* Set maximum height and enable scrolling */}
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.projectName}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedProject(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Domain:</strong> {selectedProject.domain}</p>
                <p><strong>Description:</strong> {selectedProject.description}</p>
                <div className="mb-3">
                  <button type="button" className="btn btn-outline-primary me-2" onClick={handleLike} >
                    <FaThumbsUp /> {isLiked ? 'Unlike' : 'Like'}
                    <span>({likesCount})</span>
                  </button>
                  {/* Button to toggle comment input */}
                  <button onClick={() => setShowCommentInput(!showCommentInput)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>
                    {showCommentInput ? "Hide Comment" : "Comment"}
                  </button>
                </div>
                <div> {/* Set maximum height and enable scrolling */}
                  <span>Comments : {cmntcount}</span>
                  <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                    {/* Show comment input when showCommentInput is true */}
                    {showCommentInput && (
                      <div>
                        <textarea
                          value={usercmnt}
                          onChange={handleCommentChange}
                          placeholder="Write your comment..."
                          rows={4}
                          cols={50}
                        />
                        <button onClick={() => handleSubmitComment(currentUser)} style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>
                          Submit
                        </button>
                      </div>
                    )}
                    {/* Displaying all comments */}
                    <div>
                      {cmntcount !== 0 &&
                        cmnts.map((comment, index) => (
                          <div key={index} style={{ marginBottom: '1rem', border: '1px solid #e0e0e0', padding: '0.5rem', borderRadius: '5px' }}>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>Posted by: {comment.postedBy}, {new Date(comment.time).toLocaleString()}</p>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
import '../styles/Form.css'
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

//Fragment allows creating a container without affecting the rendered output. Basically, without needing a div. 
//UseState allows managing of state within functional components. 


const InputPost = () => {

  const user_id = localStorage.getItem('user_id'); //use the user_id saved in localStorage
  const user_name = localStorage.getItem('user_name'); 
  const [title, setTitle] = useState('Write your title here');
  const [text_content, setTextContent] = useState('Write new post here');
  const [image_url, setImageUrl] = useState('Enter link here');
  const [image_alt, setAlt] = useState('');

  const [errors, setErrors] = useState({});

  const validateUrl = (url) => {
    // URL validation regex pattern
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name and extension
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!urlPattern.test(url);
  };

  const onChangeImageUrl = e => {
    setImageUrl(e.target.value);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    // Initialize error object
    let validationErrors = {};

    // Title validation
    if (!title || title === 'Write your title here') {
      validationErrors.title = 'Please write a title.';
    }

    // Text content validation
    if (!text_content || text_content === 'Write new post here') {
      validationErrors.text_content = 'Please write a post description.';
    }

    // Image URL validation
    if (image_url && image_url !== 'Enter link here' && !validateUrl(image_url)) {
      validationErrors.image_url = 'Please enter a valid URL.';
    }

    // Image Alt validation
    if (!image_alt) {
      validationErrors.image_alt = 'Please enter a description for the image.';
    }

    
    // If there are validation errors, set the errors state and stop excution early
    // Object.keys returns an array of the keys, so we can get a length. Otherwise the length would be undefined.
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; //stops the execution of onSubmitForm
    }

    try {
      //set image_url to null if the value is "Enter link here"
      const finalImageUrl = (image_url === 'Enter link here' || image_url.trim() === '') ? null : image_url;
      const finalImageAlt = (image_url?.trim() === 'Enter link here' || image_url?.trim() === '') ? null : image_alt;

      const body = { user_id, text_content, image_url: finalImageUrl, title, image_alt: finalImageAlt, user_name };
      // console.log(body);

      const response = await fetch('http://localhost:8000/newpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      window.location = '/';

    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <Fragment>
      <div className="App">
        <h1>New Post</h1>
        <form onSubmit={onSubmitForm}>
          {/* The onChange event handler is triggered whenever the user types or modifies the input. It receives an event object (e), and within that event object, e.target.value represents the new value of the input field. */}
          {/* When the user types something in the input field, the onChange handler is called.
              The e.target.value contains the updated text entered by the user.
              The setDescription(e.target.value) function is then called, updating the description state with the new value.
              As a result, the input field reflects the latest value of description. */}
         
          <label>Title:</label>
          {/* If errors.title exits, insert error component. */}
          {errors.title && <p className="alert">{errors.title}</p>}
          <input className='edit-input' type='text' value={title} onChange={e => setTitle(e.target.value)} />
          
          <label>Your post:</label>
          {/* If errors.text_content exits, insert error component. */}
          {errors.text_content && <p className="alert">{errors.text_content}</p>}
          <textarea type='text' value={text_content} onChange={e => setTextContent(e.target.value)} />
          
          <label>Add an image URL: (Optional)</label>
          {/* If errors.image_url exits, insert error component. */}
          {errors.image_url && <p className="alert">{errors.image_url}</p>}
          <input className='edit-input' type='text' value={image_url} onChange={onChangeImageUrl} />

          {image_url && 
              <div>
                <label>Image Description:</label>
                {errors.image_alt && <p className="alert">{errors.image_alt}</p>}
                <input className='edit-input' type='text' value={image_alt} onChange={e => setAlt(e.target.value)} />
              </div>
          }

          <div className='actions'>
              <button type='submit'>Create Post</button>
              <Link to={'/'}>Cancel</Link>
            </div>
        </form>

      </div>
    </Fragment>
    
  );
}

export default InputPost;

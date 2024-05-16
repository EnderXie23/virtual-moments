// Initialize the feed
document.addEventListener('DOMContentLoaded', () => {
    // Example usage of the function with some dummy data
    createNewPost('Furina', 'photos/furina.png', 'Fountaine', 'So sleepy~', {'Neuvillete': "Have a good night's sleep!"});
    createNewPost('Tighnari', 'photos/tighnari.png', 'Arusama', 'Having a great time!', {"Corei": "Are you out camping again?"});
    
});

// Toggle follow button
document.querySelectorAll('.suggestion button').forEach(button => {
    button.addEventListener('click', () => {
        if (button.innerText === 'Follow') {
            button.innerText = 'Following';
            button.style.backgroundColor = '#ccc';
        } else {
            button.innerText = 'Follow';
            button.style.backgroundColor = '#3897f0';
        }
    });
});

// Like button functionality
document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('liked')) {
            button.classList.remove('liked');
            button.innerText = 'Like';
        } else {
            button.classList.add('liked');
            button.innerText = 'Liked';
        }
    });
});

// Fetch response from the server
async function fetchResponse(prompt){
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `http://localhost:54225/${encodedPrompt}`;

    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return data.message;
    }catch(error){
        console.error('Error:', error);
        return null;
    }
}

// Comment functionality
document.querySelectorAll('.comment-input').forEach(input => {
    input.addEventListener('keypress', async event => {
        if (event.key === 'Enter') {
            const commentText = input.value;
            if (commentText.trim() !== '') {
                const commentSection = input.previousElementSibling;
                const comments = Array.from(commentSection.querySelectorAll('p')).map(comment => comment.innerText);
                const postSender = input.closest('.post').getAttribute('data-username');

                // Fill the comments history
                const CommentData = {
                    sender: postSender,
                    comment: commentText,
                    history: comments
                };

                // Create a new comment element
                const newComment = document.createElement('p');
                newComment.innerHTML = `<strong>Ender: </strong> ${commentText}`;
                commentSection.insertBefore(newComment, commentSection.querySelector('.toggle-comments'));
                input.value = '';

                try {
                    const response = await fetch('http://localhost:54225/post/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(CommentData),
                    });
                    const data = await response.json();
                    if (data.message) {
                        const responseComment = document.createElement('p');
                        responseComment.innerHTML = `<strong>${postSender}: </strong> ${data.message}`;
                        commentSection.insertBefore(responseComment, commentSection.querySelector('.toggle-comments'));
                    } else {
                        console.error('Error:', data.error || 'Unknown error');
                    }
                    // Update comment visibility
                    updateCommentVisibility(commentSection);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
    });

    // Initial update to handle existing comments
    const commentSection = input.previousElementSibling;
    updateCommentVisibility(commentSection);
});

// Function to update comment visibility
function updateCommentVisibility(commentsContainer) {
    const comments = commentsContainer.querySelectorAll('p');
    const commentCount = comments.length;
    
    if (commentCount > 3) {
        comments.forEach((comment, index) => {
            if (index < commentCount - 3) {
                comment.style.display = 'none';
            } else {
                comment.style.display = 'block';
            }
        });
        
        // Add a show/hide button
        let toggleButton = commentsContainer.querySelector('.toggle-comments');
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.innerText = 'Show more comments';
            toggleButton.className = 'toggle-comments';
            commentsContainer.appendChild(toggleButton);

            toggleButton.addEventListener('click', () => {
                const isHidden = comments[0].style.display === 'none';
                comments.forEach((comment, index) => {
                    if (index < commentCount - 3) {
                        comment.style.display = isHidden ? 'block' : 'none';
                    }
                });
                toggleButton.innerText = isHidden ? 'Show fewer comments' : 'Show more comments';
            });
        }
    }
}


// Create a new post
function createNewPost(username, photoPath, location, caption, comments = {}) {
    const feed = document.getElementById('feed');

    const post = document.createElement('div');
    post.className = 'post';
    post.setAttribute('data-username', username);

    post.innerHTML = `
        <div class="post-header">
            <img src="${photoPath}" alt="User" class="post-user-img">
            <div class="post-user-info">
                <h2>${username}</h2>
                <p>${location}</p>
            </div>
        </div>
        <img src="${photoPath}" alt="Post Image" class="post-img">
        <div class="post-footer">
            <p style="padding-left: 5mm;">${caption}</p>
            <div class="post-actions">
                <button class="like-button">Like</button>
                <button class="comment-button">Comment</button>
            </div>
            
            <div class="comments">
                <!-- Comments will be added here -->
            </div>
            <input type="text" class="comment-input" placeholder="Add a comment...">
        </div>
    `;

    // Append the new post to the feed
    feed.append(post);

    const commentSection = post.querySelector('.comments');

    // Add existing comments
    for (const [sender, comment] of Object.entries(comments)) {
        const commentElement = document.createElement('p');
        commentElement.innerHTML = `<strong>${sender}: </strong> ${comment}`;
        commentSection.appendChild(commentElement);
    }

    // Add event listeners for like and comment buttons
    post.querySelector('.like-button').addEventListener('click', function () {
        if (this.classList.contains('liked')) {
            this.classList.remove('liked');
            this.innerText = 'Like';
        } else {
            this.classList.add('liked');
            this.innerText = 'Liked';
        }
    });

    post.querySelector('.comment-input').addEventListener('keypress', async function (event) {
        if (event.key === 'Enter') {
            const commentText = this.value;
            if (commentText.trim() !== '') {
                const comments = Array.from(commentSection.querySelectorAll('p')).map(comment => comment.innerText);
                const postSender = this.closest('.post').getAttribute('data-username');

                console.log(comments);
                
                // Fill the comments history
                const CommentData = {
                    sender: postSender,
                    comment: commentText,
                    history: comments
                };

                // Create a new comment element
                const newComment = document.createElement('p');
                newComment.innerHTML = `<strong>Ender: </strong> ${commentText}`;
                commentSection.insertBefore(newComment, commentSection.querySelector('.toggle-comments'));
                this.value = '';

                try {
                    const response = await fetch('http://localhost:54225/post/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(CommentData),
                    });
                    const data = await response.json();
                    if (data.message) {
                        const responseComment = document.createElement('p');
                        responseComment.innerHTML = `<strong>${postSender}: </strong> ${data.message}`;
                        commentSection.insertBefore(responseComment, commentSection.querySelector('.toggle-comments'));
                    } else {
                        console.error('Error:', data.error || 'Unknown error');
                    }
                    // Update comment visibility
                    updateCommentVisibility(commentSection);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
    });

    // Initial update to handle existing comments
    updateCommentVisibility(commentSection);
}

// Add event listener to the new post button
document.getElementById('new-post-button').addEventListener('click', async () => {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    try{
        prompt1 = "Suppose you are a person named Furina. You are in Fountaine on vacation. You want to send a post to your friends. Write a post about your vacation in 10 words.";
        caption = await fetchResponse(prompt1);
        prompt2 = "Suppose you are a person named Neuvillete. You are a friend of Furina. You want to comment on Furina's post about vacation: " + caption + ". Write a comment only in 15 words.";
        comment = await fetchResponse(prompt2);
        createNewPost('Furina', 'photos/furina.png', 'Fountaine', caption, {'Neuvillete': comment});
    }catch(error){
        console.error('Error:', error);
    }finally{
        loadingIndicator.style.display = 'none';
    }
});

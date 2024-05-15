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

// Comment functionality
document.querySelectorAll('.comment-input').forEach(input => {
    input.addEventListener('keypress', async event => {
        if (event.key === 'Enter') {
            const commentText = input.value;
            if (commentText.trim() !== '') {
                const commentSection = input.previousElementSibling;
                const comments = Array.from(commentSection.querySelectorAll('p')).map(comment => comment.innerText);
                
                // Fill the comments history
                const CommentData = {
                    comment: commentText,
                    history: comments
                };

                // Create a new comment element
                const newComment = document.createElement('p');
                newComment.innerHTML = `<strong>Ender</strong> ${commentText}`;
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
                        responseComment.innerHTML = `<strong>bot</strong> ${data.message}`;
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
function createNewPost(username, photoPath, location, caption) {
    const feed = document.getElementById('feed');

    const post = document.createElement('div');
    post.className = 'post';

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
            <p><strong>${username}</strong> ${caption}</p>
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
    feed.prepend(post);

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
                const commentSection = this.previousElementSibling;
                const comments = Array.from(commentSection.querySelectorAll('p')).map(comment => comment.innerText);
                
                // Fill the comments history
                const CommentData = {
                    comment: commentText,
                    history: comments
                };

                // Create a new comment element
                const newComment = document.createElement('p');
                newComment.innerHTML = `<strong>Ender</strong> ${commentText}`;
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
                        responseComment.innerHTML = `<strong>bot</strong> ${data.message}`;
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
    const commentSection = post.querySelector('.comments');
    updateCommentVisibility(commentSection);
}

// Add event listener to the new post button
document.getElementById('new-post-button').addEventListener('click', () => {
    // Example usage of the function with some dummy data
    createNewPost('john_doe', 'user.jpg', 'New York, NY', 'Having a great time!');
});

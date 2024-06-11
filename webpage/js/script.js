// Initialize the feed
document.addEventListener('DOMContentLoaded', () => {
    createNewPost('Furina', 'photos/fpost.png', 'Fountaine', 'How do you like Fountaine\'s Star -- Furina\'s new outfit~', {'Neuvillete': "Furina's new dress is fantastic!"});
    createNewPost('Tighnari', 'photos/tighnari.png', 'Sumeru', 'Having a great time in the forest!', {"Corei": "Are you out camping again?"});
    createNewPost('Iron', 'photos/ipost.png', 'The U.S.', "Built myself a cool new suit!", {"Pepper": "Iron Man is so talented!"});
    createNewPost('Jimmy', 'photos/jpost.jpg', 'Tokyo', "Just finished today\'s job as a detective!", {"Rachel": "Wow! It must have been a exciting experience!"});
});

// Fetch response from the server
async function fetchResponse(prompt, character = 'None'){
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `http://localhost:54226/answer?prompt=${encodedPrompt}&character=${character}`;

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
async function handleLikeButtonClick(button) {
    const postElement = button.closest('.post');
    const postSender = postElement.getAttribute('data-username');
    const commentSection = postElement.querySelector('.comments');
    const caption = postElement.querySelector('.post-footer p').innerText;

    try {
        // Generate a comment based on the caption
        const prompt = `You said: "${caption}". your friend Ender thinks it is great. Write a comment to thank him WITHIN 15 words.`;
        const comment = await fetchResponse(prompt, postSender);

        if (comment) {
            const responseComment = document.createElement('p');
            responseComment.innerHTML = `<strong>${postSender}: </strong> ${comment}`;
            commentSection.insertBefore(responseComment, commentSection.querySelector('.toggle-comments'));
            updateCommentVisibility(commentSection);
        } else {
            console.error('Error: Failed to fetch bot response');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', async function () {
        if (this.classList.contains('liked')) {
            this.classList.remove('liked');
            this.innerText = 'Like';
        } else {
            this.classList.add('liked');
            this.innerText = 'Liked';

            // Handle the like button click
            await handleLikeButtonClick(this);
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
                    const response = await fetch('http://localhost:54226/post/', {
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
                    comment.style.display = isHidden ? 'block' : 'none';
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

    let postContent = `
        <div class="post-header">
            <img src="photos/${username.toLowerCase()}.png" alt="User" class="post-user-img">
            <div class="post-user-info">
                <h2>${username}</h2>
                <p>${location}</p>
            </div>
        </div>`;

    // Conditionally include the post image
    if (photoPath && photoPath !== 'null') {
        postContent += `<img src="${photoPath}" alt="Post Image" class="post-img">`;
    }

    postContent += `
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
    
    post.innerHTML = postContent;

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
    post.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', async function () {
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                this.innerText = 'Like';
            } else {
                this.classList.add('liked');
                this.innerText = 'Liked';
    
                // Handle the like button click
                await handleLikeButtonClick(this);
            }
        });
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
                    const response = await fetch('http://localhost:54226/post/', {
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

const cfPairs = [
    { character: 'Furina', friend: 'Neuvillete', place: 'Fountaine'},
    { character: 'Tighnari', friend: 'Corei', place: 'Sumeru'},
    { character: 'Iron', friend: 'Pepper', place: 'The U.S.'},
    { character: 'Jack', friend: 'Sailor', place: 'The Atlantic Ocean' },
    { character: 'Jimmy', friend: 'Rachel', place: 'Tokyo' },
    { character: 'Nick', friend: 'Judy', place: 'Zootopia' },
]

// Add event listener to the new post button
document.getElementById('new-post-button').addEventListener('click', async () => {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.style.display = 'block';

    const randomPair = cfPairs[Math.floor(Math.random() * cfPairs.length)];
    const { character, friend, place} = randomPair;

    try{
        prompt1 = "Suppose you are a person named " + character + ". You are on summer vacation. You want to send a post to share with your friends about your trip. Write a post about your vacation WITHIN 10 words.";
        caption = await fetchResponse(prompt1, character);
        prompt2 = "Suppose you are a person named " + friend + ". You are a friend of " + character +". You want to comment on " + character + "'s post about vacation: " + caption + ". Write a comment WITHIN 15 words.";
        comment = await fetchResponse(prompt2);
        createNewPost(character, 'null', place, caption, {[friend]: comment});
    }catch(error){
        console.error('Error:', error);
    }finally{
        loadingIndicator.style.display = 'none';
    }
});

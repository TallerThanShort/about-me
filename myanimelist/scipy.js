// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCLbkhREuE47oTfa8A98vJ-7KwA55DdqBU",
    authDomain: "what-block.firebaseapp.com",
    projectId: "what-block",
    storageBucket: "what-block.appspot.com",
    messagingSenderId: "30475081786",
    appId: "1:30475081786:web:b43d44bde6bc02cadbfd03"
};

firebase.initializeApp(firebaseConfig);
const store = firebase.firestore();

const loadingPosts = 16;
let lastVisiblePost = null;
let morePostsAvailable = true;

// Function to add a post to the watchlist container
function addPostToPage(post) {
    const watchlistContainer = document.getElementById("myAnimeWatchlist");
    const postElement = `
        <div class="anime-item">
            <img class="anime-item-img" draggable="false" src="${post.cover}">
            <p>${post.name}</p>
        </div>
    `;
    watchlistContainer.innerHTML += postElement;
}

// Function to populate the watchlist
function populateWatchlist() {
    const postsRef = firebase.firestore().collection('myanimelist');
    let query = postsRef.limit(loadingPosts);

    if (lastVisiblePost) {
        query = query.startAfter(lastVisiblePost);
    }

    query.onSnapshot(function(snapshot) {
        // Check if there are more posts available to load
        if (snapshot.size < loadingPosts) {
            morePostsAvailable = false;
            document.getElementById('loadMore').disabled = true;
            document.getElementById('loadMore').style.background = 'rgba(0,0,0,0.3)';
            document.getElementById('loadMore').style.color = 'rgba(255,255,255,0.3)';
        }

        snapshot.docs.forEach(function(post) {
            addPostToPage(post.data());
        });

        lastVisiblePost = snapshot.docs[snapshot.docs.length - 1];
    }, function(error) {
        console.error('Error fetching posts: ', error);
    });
}

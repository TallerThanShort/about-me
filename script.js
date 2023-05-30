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
const authorisedUser = "TallerThanShort, duh"


const landingPosts = 3;
morePostsAvailable = true;

const postsRef = firebase.firestore().collection('entries');
let query = postsRef.orderBy('pnum', 'desc').limit(landingPosts);

query.onSnapshot(function(snapshot) {
    // Check if there are more posts available to load
    if (snapshot.size < landingPosts - 2) {
        morePostsAvailable = false; //returns false if there are less than 0 blog entries
    }
    var posts = snapshot.docs.map(function(post) {
      return post.data();
    });

    posts.forEach(function(post) {
      addPostToPage(post);
    });
});

function addPostToPage(post) {
    var postElement = `
    <br>
    <div style="border: 2px solid;">
        <div style="position: relative;">
            <h3 style="cursor: default; position: relative; left: 10px;">${post.title}</h3>
            <p style="font-size: 8px; position: absolute; top: -10px; right: 29px;">${post.update}</p>
        </div>
        <button style="width: 100%; border: none; border-radius: 10px 10px 0px 0px; background-color: rgb(116, 69, 217); text-transform: uppercase; cursor: pointer;" class="primary-text" onclick="location.href='/blog/?entry=${post.path}';">read</button>
    </div>
  `;
  document.getElementById('postsBody').innerHTML += postElement;
};
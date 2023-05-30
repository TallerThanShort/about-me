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

const loadingPosts = 5;
let lastVisiblePost = null;
let morePostsAvailable = true;

window.onload = function() {
    const entryLocator = new URLSearchParams(window.location.search.slice(1));
    const entryID = entryLocator.get('entry');
    if(!entryID){
        document.getElementById("title").innerHTML = `<h1>TallerThanShort's Blog</h1><hr>`;
        document.getElementById("buttons").innerHTML = `<button id="loadMore" class="btn-primary primary-text">Load More</button>`;
        getPosts();
    } else {
        store.collection("entries").where("path", "==", entryID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    document.body.innerHTML = `<h1>${doc.data().title}</h1><p style="font-size: 8px; position: absolute; top: 0; right: 29px;" title="${doc.data().update}">${doc.data().update}</p>${doc.data().content}`;
            });
        })
    }
}


function getPosts() {
    const postsRef = firebase.firestore().collection('entries');
    let query = postsRef.orderBy('pnum', 'desc').limit(loadingPosts);

    if (lastVisiblePost) {
        query = query.startAfter(lastVisiblePost);
    }

    query.onSnapshot(function(snapshot) {
        // Check if there are more posts available to load
        if (snapshot.size < loadingPosts) {
            morePostsAvailable = false;
        }
        var posts = snapshot.docs.map(function(post) {
            return post.data();
        });

        posts.forEach(function(post) {
            addPostToPage(post);
        });

        lastVisiblePost = snapshot.docs[snapshot.docs.length - 1];
    });
}

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
  document.getElementById("entries").innerHTML += postElement;
};

document.addEventListener('click', (e) => {
    let element = e.target;
    if(morePostsAvailable){
        if(element.id == 'loadMore'){
            getPosts();
        }
    } else {
        return;   
    }

})
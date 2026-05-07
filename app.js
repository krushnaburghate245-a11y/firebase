// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAxJauE5RVpNk7551RznVxAQM0KfEtV1Cc",
  authDomain: "krushna-4eebd.firebaseapp.com",
  projectId: "krushna-4eebd",
  storageBucket: "krushna-4eebd.firebasestorage.app",
  messagingSenderId: "281492638781",
  appId: "1:281492638781:web:bd98fc5313ddf46f0cae54",
  measurementId: "G-RGGXPGXHW2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// ================= REGISTER =================
function register() {
    console.log("Register button clicked");

    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    // validation
    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        console.log("Firebase Auth Success");

        let user = userCredential.user;

        // store in firestore
        return db.collection("users").doc(user.uid).set({
            email: email,
            uid: user.uid,
            createdAt: new Date()
        });
    })
    .then(() => {
        alert("User Registered Successfully");
    })
    .catch((error) => {
        console.error(error);
        alert(error.message);
    });
}


// ================= LOGIN =================
function login() {
    console.log("Login button clicked");

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
        alert("Login Successful");
    })
    .catch((error) => {
        console.error(error);
        alert(error.message);
    });
}


// ================= GET USER =================
function getUser() {
    console.log("Fetching user");

    auth.onAuthStateChanged((user) => {
        if (user) {
            db.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    document.getElementById("userData").innerText =
                        "Email: " + doc.data().email +
                        " | UID: " + doc.data().uid;
                } else {
                    alert("No data found in Firestore");
                }
            })
            .catch((error) => {
                console.error(error);
                alert("Error fetching data");
            });
        } else {
            alert("No user logged in");
        }
    });
}
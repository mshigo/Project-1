function initDb() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC6eAPWuYgz1OEsS8mvrkNfu4XYduyD5aE",
        authDomain: "project1-8e6c3.firebaseapp.com",
        databaseURL: "https://project1-8e6c3.firebaseio.com",
        projectId: "project1-8e6c3",
        storageBucket: "project1-8e6c3.appspot.com",
        messagingSenderId: "853012909302"
    };
    firebase.initializeApp(config);
    database = firebase.database();
}
initDb();

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            var firebaseUser = authResult.user;
            var credential = authResult.credential;
            var isNewUser = authResult.additionalUserInfo.isNewUser;
            var providerId = authResult.additionalUserInfo.providerId;
            var operationType = authResult.operationType;
            // Do something with the returned AuthResult.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        signInFailure: function (error) {
            // Some unrecoverable error occurred during sign-in.
            // Return a promise when error handling is completed and FirebaseUI
            // will reset, clearing any UI. This commonly occurs for error code
            // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
            // occurs. Check below for more details on this.
            return handleUIError(error);
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
    // Query parameter name for mode.
    queryParameterForWidgetMode: 'mode',
    // Query parameter name for sign in success url.
    queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'https://jwesterv.github.io/Project-1/d_board.html',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            // Whether the display name should be displayed in the Sign Up page.
        },
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        window.location.assign('<your-privacy-policy-url>');
    }
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

//Following a sign-in user
firebase.auth().onAuthStateChanged(function (firebaseUser) {
    if (firebaseUser) {
        // User is signed in.
    } else {
        // No user is signed in.
    }
});

//Current user information
var firebaseUser = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

if (firebaseUser != null) {
    name = firebaseUser.displayName;
    email = firebaseUser.email;
    photoUrl = firebaseUser.photoURL;
    emailVerified = firebaseUser.emailVerified;
    uid = firebaseUser.uid;  // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
}

//Console log values
if (firebaseUser != null) {
    firebaseUser.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
    });
}
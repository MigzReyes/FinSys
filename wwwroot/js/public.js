import { debug } from "./utils.js";

// GLOBAL VAR

// PAGE BASE INITIALIZATION FOR DYNAMIC JS CODE
const PageScripts = {
    main: function() {
        debug("Page", "Main");
    },

    signUp: function() {
        debug("Page", "Sign up");
    },

    logIn: function() {
        debug("Page", "Log in");
    },

    forgotPass: function() {
        debug("Page", "Forgot pass");
    },

    verification: function() {
        debug("Page", "Verification");
    },

    resetPass: function() {
        debug("Page", "Reset pass");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.dataset.page;

    if (PageScripts[page]) {
        PageScripts[page]();
    } 
});

// wag na muna to, tapusin ko muna buong layout
function togglePasswordVisibility(seeIcon) {

}
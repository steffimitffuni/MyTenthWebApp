// Lilo's interactive website – Bootstrap 5 version
// Topics demonstrated: function expressions, arrow functions, callbacks,
// event listeners, this, call(), apply(), bind(), closures, IIFE and DOM methods.
 
// 1. Function expression: the function is stored in a variable.
const showMessage = function (text, element) {
    element.textContent = text;
};
 
// 2. Arrow function stored as a function reference.
const getElement = (id) => document.getElementById(id);
 
// Arrow function: shows feedback as a BS5 Alert (success = green, danger = red, warning = yellow).
const showAlert = (element, text, type) => {
    element.className = `alert alert-${type} mt-3 mb-0`;
    element.textContent = text;
};
 
// Removes the alert again.
const clearAlert = (element) => {
    element.className = "";
    element.textContent = "";
};
 
// 3. Closure: this function remembers its own count between calls.
function createFactCounter() {
    let count = 0;
    const facts = [
        "Lilo's name has four letters: L, I, L and O.",
        "Lilo was named after the character in Lilo and Stitch",
        "Lilo was found abandoned on a street in Hungary and found a new home with my sister during lockdown 2021."
    ];
 
    return function () {
        const fact = facts[count % facts.length];
        count++;
        return fact;
    };
}
 
const nextFact = createFactCounter();
 
getElement("factButton").addEventListener("click", function () {
    showMessage(nextFact(), getElement("factText"));
});
 
// BS5 Collapse: Bootstrap opens and closes the About section (this replaces the jQuery slideToggle).
// We only change the button text when Bootstrap tells us it opens or closes.
getElement("aboutContent").addEventListener("hide.bs.collapse", function () {
    getElement("toggleAbout").textContent = "Show Lilo facts ▼";
});
 
getElement("aboutContent").addEventListener("show.bs.collapse", function () {
    getElement("toggleAbout").textContent = "Hide Lilo facts ▲";
});
 
// 4. Callback: handleFormSubmit is passed to addEventListener and called on submit.
 
getElement("signupForm").addEventListener("submit", handleFormSubmit);
 
const SUPABASE_URL = "https://kyseloveffphvjdnyphn.supabase.co";
const SUPABASE_KEY = "sb_publishable__zOeLViD-5M9K7MOGwugeQ_ARiuzL_F";
 
async function handleFormSubmit(event) {
    event.preventDefault();
 
    const form = getElement("signupForm");
    const email = getElement("email").value.trim();
    const wantsUpdates = getElement("dogUpdates").checked;
    const message = getElement("message");
 
    // BS5 Form Validation: the browser checks the email, Bootstrap shows the red feedback text.
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        clearAlert(message);
        return;
    }
    form.classList.remove("was-validated");
 
    showAlert(message, "Signing you up...", "secondary");
 
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/lilo_signups`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify({
                    email: email,
                    wants_updates: wantsUpdates
                })
            }
        );
 
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Supabase error:", errorText);
            throw new Error("Signup failed");
        }
 
        showAlert(message, "Thanks for signing up for Lilo updates! 🐾", "success");
 
        form.reset();
 
    } catch (error) {
        console.error(error);
        showAlert(message, "Sorry, signup failed. Please try again.", "danger");
    }
}
 
// 5. DOM form handling and conditional logic.
getElement("walkForm").addEventListener("submit", (event) => {
    event.preventDefault();
 
    const input = getElement("walks");
    const walks = Number(input.value);
    const message = getElement("walkMessage");
 
    if (!input.value || !Number.isInteger(walks) || walks < 1 || walks > 20) {
        showAlert(message, "Please enter a whole number between 1 and 20.", "warning");
    } else if (walks <= 2) {
        showAlert(message, "That sounds a little low. Lilo wants to go outside!", "warning");
    } else if (walks <= 4) {
        showAlert(message, "That sounds like a great amount of walks. Lilo would love that!", "success");
    } else {
        showAlert(message, "That's too many walks! Lilo needs to rest!", "danger");
    }
});
 
// 6. Event delegation: one callback handles clicks on both answer buttons (BS5 Button Group).
getElement("interactive").addEventListener("click", (event) => {
    const button = event.target.closest(".answer-button");
    if (!button) return;
 
    // Mark the chosen button as active
    document.querySelectorAll(".answer-button").forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
 
    const answer = button.dataset.answer;
    const message = getElement("quizMessage");
 
    if (answer === "no") {
        showAlert(message, "Correct! Lilo doesn't get along with other dogs.", "success");
    } else {
        showAlert(message, "Not quite! Lilo doesn't get along with other dogs.", "danger");
    }
});
 
// 7. Function declaration used as a form callback.
function handleFriendSubmit(event) {
    event.preventDefault();
 
    const name = getElement("friendName").value.trim();
    if (!name) {
        showAlert(getElement("friendMessage"), "Please enter a name!", "warning");
        return;
    }
 
    showAlert(getElement("friendMessage"), `${name} sounds like a great name for Lilo's best friend!`, "success");
}
 
getElement("friendForm").addEventListener("submit", handleFriendSubmit);
 
// 10. this, call(), apply() and bind() demonstration.
const liloProfile = {
    name: "Lilo",
    introduce(prefix, punctuation) {
        return `${prefix} ${this.name}${punctuation}`;
    }
};
 
const otherDog = { name: "Lilo's best friend" };
 
// call(): pass arguments one by one and choose the value of this.
const callExample = liloProfile.introduce.call(otherDog, "Meet", "!");
 
// apply(): pass arguments in an array and choose the value of this.
const applyExample = liloProfile.introduce.apply(liloProfile, ["Hello, this is", "."]);
 
// bind(): create a new function with this fixed for later.
const boundIntroduction = liloProfile.introduce.bind(liloProfile, "Say hi to");
 
// 11. IIFE: runs once immediately to set up the page.
(function initialisePage() {
    getElement("photoCaption").dataset.alternate = "false";
    console.info("Lilo's page is ready.");
})();
 
// 12. Function reference: pass the function itself, not the result of calling it.
getElement("resetButton").addEventListener("click", resetInteractiveAnswers);
 
function resetInteractiveAnswers() {
    getElement("walkForm").reset();
    getElement("friendForm").reset();
    document.querySelectorAll(".answer-button").forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
    });
    [
        "walkMessage",
        "quizMessage",
        "friendMessage"
    ].forEach((id) => {
        clearAlert(getElement(id));
    });
}
 
// 13. API with a BS5 Spinner while loading
getElement("dogButton").addEventListener("click", async () => {
    const button = getElement("dogButton");
    const message = getElement("dogMessage");
    const details = getElement("dogDetails");
 
    message.textContent = "Finding a dog...";
    button.disabled = true;
    getElement("dogSpinner").classList.remove("d-none"); // BS5 Spinner on
 
    try {
        const response = await fetch(
            "https://api.freeapi.app/api/v1/public/dogs/dog/random",
            {
                method: "GET",
                headers: {
                    accept: "application/json"
                }
            }
        );
 
        if (!response.ok) {
            throw new Error("The API request failed.");
        }
 
        const result = await response.json();
 
        // The dog information is inside result.data
        const dog = result.data;
 
        if (!result.success || !dog) {
            throw new Error("Dog information was not returned.");
        }
 
        // Display the dog's information
        getElement("dogName").textContent = dog.name;
        getElement("randomDog").src = dog.image.url;
        getElement("dogBreed").textContent =
            dog.breed_group || "Not available";
        getElement("dogTemperament").textContent =
            dog.temperament || "Not available";
        getElement("dogLifespan").textContent =
            dog.life_span || "Not available";
        getElement("dogWeight").textContent =
            dog.weight.metric
                ? dog.weight.metric + " kg"
                : "Not available";
 
        details.hidden = false;
        message.textContent = "Meet " + dog.name + "! 🐾";
 
    } catch (error) {
        message.textContent =
            "Sorry, we couldn't load a dog. Please try again.";
 
        console.error("Error fetching dog:", error);
 
    } finally {
        button.disabled = false;
        getElement("dogSpinner").classList.add("d-none"); // BS5 Spinner off
    }
});
 
// 14. jQuery: floating "Back to Lilo" button, now with Bootstrap button classes
$(document).ready(function () {
 
    // Create the floating button
    $("body").append(
        '<button type="button" id="backToLilo" class="btn btn-lilo rounded-pill shadow">Back to Lilo</button>'
    );
 
    // Position the button
    $("#backToLilo").css({
        position: "fixed",
        bottom: "25px",
        right: "25px",
        "z-index": "1000",
        display: "none"
    });
 
    // Show or hide the button while scrolling
    $(window).on("scroll", function () {
 
        if ($(window).scrollTop() > 300) {
            $("#backToLilo").fadeIn(400);
        } else {
            $("#backToLilo").fadeOut(400);
        }
 
    });
 
    // Scroll to Lilo's photo
    $("#backToLilo").on("click", function () {
 
        $("html, body").animate({
            scrollTop: $("#lilo").offset().top
        }, 600);
 
    });
 
});
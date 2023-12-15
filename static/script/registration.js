/**
 * The main function is a JavaScript code that validates a signup form and prevents submission if any
 * required fields are empty or if the email and password fields do not match.
 */
function main() {

        const form = document.getElementById("signup-form");
        const passwordInput = document.getElementById("password");
        const passwordAgainInput = document.getElementById("password-again");

        function validateForm() {
            const name = document.getElementById("name").value.trim();
            const surname = document.getElementById("surname").value.trim();
            const email = document.getElementById("email").value.trim();
            const emailAgain = document.getElementById("email-again").value.trim();
            const password = passwordInput.value;
            const passwordAgain = passwordAgainInput.value;

            let action = true;

            if (name === "" || surname === "" || email === "" || emailAgain === "" || password === "" || passwordAgain === "") {
                alert("Please fill in all the required fields");
                action = false;
            }

            if (email !== emailAgain) {
              alert("Emails do not match");
              action = false;
            }

            if (password !== passwordAgain) {
                alert("Passwords do not match");
              action = false;
            }

          return action;
        }

        form.addEventListener("submit", event => {
            if (!validateForm()) {
                event.preventDefault();
              console.log("validate form is false");
            } else {
              console.log("validate form is true");
              alert("Sign up successful");
            }
        });
}

main();
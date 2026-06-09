const form = document.getElementById("signupForm");

form.addEventListener("submit", async(ev) => {
    ev.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();
    console.log(data);
    if(data.username){
        sessionStorage.setItem("username", data.username)
    }
    console.log(data);
});
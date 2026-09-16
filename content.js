console.log("=================================");
console.log("EMAIL SUMMARIZER: Content script loaded");
console.log("=================================");


function extractEmail() {
    const subjectElement = document.querySelector("h2.hP");  //For subject

    const senderElement = document.querySelector(".gD");  //For sender

    const bodyElement = document.querySelector(".a3s");  //For body

    const subject = subjectElement ? subjectElement.innerText.trim() : "No subject found";

    const sender = senderElement ? senderElement.getAttribute("email") : "No sender found";

    const body = bodyElement ? bodyElement.innerText.trim() : "No body found";

    return {
        subject: subject,
        sender: sender,
        body: body
    };
}

function waitForEmail() {
    const checkEmail = setInterval(() => {
        const subjectElement = document.querySelector("h2.hP");
        const senderElement = document.querySelector(".gD");
        const bodyElement = document.querySelector(".a3s");

        if (subjectElement && senderElement && bodyElement){
            clearInterval(checkEmail);

            const email = extractEmail();
            console.log("Extracted Email:", email);
        }
    }, 500);
    //Wait for 500 milliseconds, then run code
    //If checkEmail not cleared, then wait for 500 milliseconds again.
}

waitForEmail();

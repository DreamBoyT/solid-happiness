// Manually provided sample data for upcoming events
const dailyEvents = {
    "2024-07-01": "Canada Day",
    "2024-07-02": "World UFO Day",
    "2024-07-03": "National Fried Clam Day",
    "2024-07-04": "Independence Day USA",
    "2024-07-05": "Chartered Accountants Day (India)",
    "2024-07-06": "World Zoonoses Day",
    "2024-07-07": "World Chocolate Day",
    "2024-07-08": "Islamic New Year",
    "2024-07-09": "National Sugar Cookie Day",
    "2024-07-10": "World Population Day",
    "2024-07-11": "National 7-Eleven Day",
    "2024-07-12": "Malala Day",
    "2024-07-13": "Paper Bag Day",
    "2024-07-14": "Bastille Day or French National Day",
    "2024-07-15": "World Youth Skills Day",
    "2024-07-16": "World Day for International Justice",
    "2024-07-17": "World Emoji Day",
    "2024-07-18": "International Nelson Mandela Day",
    "2024-07-19": "International Chess Day",
    "2024-07-20": "Moon Day",
    "2024-07-21": "Pi Approximation Day",
    "2024-07-22": "National Mango Day",
    "2024-07-23": "Chandrayaan 2 launching date",
    "2024-07-24": "National Thermal Engineer Day",
    "2024-07-25": "National Refreshment Day",
    "2024-07-26": "Kargil Vijay Diwas",
    "2024-07-27": "System Administrator Appreciation Day",
    "2024-07-28": "World Nature Conservation Day",
    "2024-07-29": "International Tiger Day",
    "2024-07-30": "International Friendship Day"
};


// Function to get the current date in the format "YYYY-MM-DD"
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Generate Default Image based on the event of the day
async function generateDefaultImage() {
    const currentDate = getCurrentDate();
    const event = dailyEvents[currentDate] || "A group of people celebrating"; // Default prompt

    if (event) {
        prompt = `An image representing ${event}`;
    }

    // Use the same image generation logic to generate the image
    const imageContainerCard1 = document.querySelector("#card1 .card1-image-container");
    const loadingSpinnerCard1 = document.createElement("div");
    loadingSpinnerCard1.className = "unique-loading-spinner";
    imageContainerCard1.innerHTML = "";
    imageContainerCard1.appendChild(loadingSpinnerCard1);

    const imageContainerCard2 = document.querySelector("#card2 .card2-image-container");
    // No loading spinner for card2; it retains the previous image

    fetch("https://dall-t.azurewebsites.net/api/httpTriggerts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        if (data.imageUrls) {
            const url = data.imageUrls[0];
            const imgCard1 = new Image();
            const imgCard2 = new Image();
            imgCard1.src = url;
            imgCard2.src = url;
            imgCard1.alt = prompt;
            imgCard2.alt = prompt;
            imgCard1.classList.add("card1-image");
            imgCard2.classList.add("card2-image");

            imgCard1.onload = () => {
                loadingSpinnerCard1.remove();
                imageContainerCard1.innerHTML = ""; // Clear loading spinner
                imageContainerCard1.appendChild(imgCard1);
                appendButtons();
                recycleButton.disabled = false;
                deleteButton.disabled = false;
                currentImageUrl = imgCard1.src; // Store the current image URL

                // Load image in card2 after imgCard1 is loaded
                imageContainerCard2.innerHTML = ""; // Clear previous image
                imageContainerCard2.appendChild(imgCard2);
                appendCard3Buttons();
                updateCarouselImages(url); // Update the carousel images with the new image URL
            };
        } else {
            loadingSpinnerCard1.remove();
            imageContainerCard1.innerHTML = `
                <span style="
                    color: #45474B; 
                    font-weight: bold; 
                    font-size: 60px; 
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
                    background: -webkit-linear-gradient(#45474B, #6B6E73); 
                    -webkit-background-clip: text; 
                    -webkit-text-fill-color: transparent;
                ">
                    Failed to generate image. Please try again...
                </span>`;
            // No changes to imageContainerCard2; it retains the previous image
        }
    })
    .catch(error => {
        console.error("Error generating image:", error);
        loadingSpinnerCard1.remove();
        imageContainerCard1.innerHTML = `
            <span style="
                color: #45474B; 
                font-weight: bold; 
                font-size: 60px; 
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
                background: -webkit-linear-gradient(#45474B, #6B6E73); 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent;
            ">
                Failed to generate image. Please try again later...
            </span>`;
        // No changes to imageContainerCard2; it retains the previous image
    });
}

// Automatic Update: Schedule daily image generation
function scheduleDailyImageUpdate() {
    const now = new Date();
    const nextUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0); // Next midnight
    const timeUntilNextUpdate = nextUpdate - now;

    setTimeout(() => {
        generateDefaultImage(); // Generate image at midnight
        scheduleDailyImageUpdate(); // Schedule the next update
    }, timeUntilNextUpdate);
}

// Initialize default image generation on page load
window.addEventListener('load', async () => {
    generateDefaultImage();
    scheduleDailyImageUpdate();
});



// --------------------------------------------------------------------------------
// MSAL configuration
const msalConfig = {
    auth: {
        clientId: "d24bfde1-e062-49da-8129-5bdcf609b00b", // Your client ID
        authority: "https://login.microsoftonline.com/4d4343c6-067a-4794-91f3-5cb10073e5b4", // Your tenant ID
        redirectUri: "https://salmon-flower-0b8cdc800.5.azurestaticapps.net" // Your redirect URI
    },
    cache: {
        cacheLocation: "localStorage", // or "sessionStorage"
        storeAuthStateInCookie: false
    }
};

// Initialize MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// DOM elements
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const userProfile = document.getElementById("userProfile");
const userNameElement = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");
const messageDiv = document.getElementById("message");
const submitButton = document.getElementById("submit"); // Update this line

// Update UI based on authentication status
async function updateUI() {
    const account = msalInstance.getActiveAccount();
    if (account) {
        // Update user profile information
        const displayName = account.name ?? "User";
        userNameElement.textContent = displayName;

        try {
            // Fetch user profile information including the avatar URL
            const profile = await fetchUserProfile(account);
            if (profile && profile.avatarUrl) {
                userAvatar.src = profile.avatarUrl;
            } else {
                userAvatar.src = "default-avatar.png"; // Default avatar image
            }

            // Toggle visibility of user profile elements
            userProfile.style.display = "block";
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Handle error or show a default avatar
            userAvatar.src = "default-avatar.png"; // Default avatar image
        }

        // Hide the login button and show the logout button
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
        
        // Enable the generate image button
        submitButton.disabled = false; // Update this line
    } else {
        // Clear user profile information
        userNameElement.textContent = "";
        userAvatar.src = "";

        // Hide user profile elements
        userProfile.style.display = "none";

        // Show the login button and hide the logout button
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
        
        // Disable the generate image button
        submitButton.disabled = true; // Update this line
    }
}

// Function to fetch user profile (including avatar URL)
async function fetchUserProfile(account) {
    const accessTokenRequest = {
        scopes: ["user.read"]
    };

    try {
        const response = await msalInstance.acquireTokenSilent(accessTokenRequest);
        const accessToken = response.accessToken;

        // Fetch user profile photo
        const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!photoResponse.ok) {
            throw new Error(`HTTP error! Status: ${photoResponse.status}`);
        }

        const photoBlob = await photoResponse.blob();
        const avatarUrl = URL.createObjectURL(photoBlob);

        return { avatarUrl };
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        throw error;
    }
}

// Login function
async function login() {
    try {
        const loginResponse = await msalInstance.loginPopup({
            scopes: ["user.read"]
        });

        console.log("Login successful:", loginResponse);
        msalInstance.setActiveAccount(loginResponse.account);
        await updateUI();
        window.location.reload(); // Reload the page after successful login
    } catch (error) {
        console.error("Login failed:", error);
        messageDiv.innerText = "Login failed. Please try again.";
    }
}

// Logout function
async function logout() {
    try {
        await msalInstance.logoutPopup();
        msalInstance.setActiveAccount(null);
        await updateUI();
        window.location.reload(); // Reload the page after successful logout
    } catch (error) {
        console.error("Logout failed:", error);
        messageDiv.innerText = "Logout failed. Please try again.";
    }
}

// Event listeners for login and logout buttons
loginButton.addEventListener("click", login);
logoutButton.addEventListener("click", logout);

// Check if the user is already logged in on page load
async function handlePageLoad() {
    try {
        const response = await msalInstance.handleRedirectPromise();
        if (response && response.account) {
            msalInstance.setActiveAccount(response.account);
        }
        await updateUI();
    } catch (error) {
        console.error("Failed to handle page load:", error);
        await updateUI();
    }
}

handlePageLoad(); // Call handlePageLoad() on initial page load

// ----------------------
let isGenerating = false;

// Function to toggle the sidebar
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

// Event listener for the submit button in the prompt field
document.getElementById("submit").addEventListener("click", () => {
    if (!isGenerating) {
        generateImage();
    }
});

// --------------------------------
function generateImage() {
    const prompt = document.getElementById("promptInput").value;
    const style = document.querySelector("#field1 .icon-btn.active")?.id || "";
    const quality = document.querySelector("#field2 .icon-btn.active")?.id || "";
    const size = document.querySelector("#field3 .icon-btn.active")?.id || "";
    const guide = document.querySelector("#field4 .icon-btn.active")?.id || "";

    if (prompt.trim() === "") {
        alert("Please enter an image description.");
        return;
    }

    const imageContainerCard1 = document.querySelector("#card1 .card1-image-container");
    const loadingSpinnerCard1 = document.createElement("div");
    loadingSpinnerCard1.className = "unique-loading-spinner";
    imageContainerCard1.innerHTML = "";
    imageContainerCard1.appendChild(loadingSpinnerCard1);

    const imageContainerCard2 = document.querySelector("#card2 .card2-image-container");
    // No loading spinner for card2; it retains the previous image

    const retryCount = 3; // Number of retries
    const initialDelay = 1000; // Initial delay in milliseconds
    let currentRetry = 0;

    function fetchImageWithRetry() {
        isGenerating = true; // Set flag to true to prevent multiple requests

        fetch("https://dall-t.azurewebsites.net/api/httpTriggerts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, style, quality, size }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            if (data.imageUrls) {
                const url = data.imageUrls[0];
                const imgCard1 = new Image();
                const imgCard2 = new Image();
                imgCard1.src = url;
                imgCard2.src = url;
                imgCard1.alt = prompt;
                imgCard2.alt = prompt;
                imgCard1.classList.add("card1-image");
                imgCard2.classList.add("card2-image");

                imgCard1.onload = () => {
                    loadingSpinnerCard1.remove();
                    imageContainerCard1.innerHTML = ""; // Clear loading spinner
                    imageContainerCard1.appendChild(imgCard1);
                    appendButtons();
                    recycleButton.disabled = false;
                    deleteButton.disabled = false;
                    currentImageUrl = imgCard1.src; // Store the current image URL

                    isGenerating = false; // Reset flag after successful image load

                    // Load image in card2 after imgCard1 is loaded
                    imageContainerCard2.innerHTML = ""; // Clear previous image
                    imageContainerCard2.appendChild(imgCard2);
                    appendCard3Buttons();
                    updateCarouselImages(url); // Update the carousel images with the new image URL
                };

                if (size === "Desktop" || size === "Website" || size === "Portrait" || size === "Landscape") {
                    let width, height;
                    switch(size) {
                        case "Desktop":
                            [width, height] = [1600, 900];
                            break;
                        case "Website":
                            [width, height] = [1800, 600];
                            break;
                        case "Portrait":
                            [width, height] = [1080, 1920];
                            break;
                        case "Landscape":
                            [width, height] = [1920, 1080];
                            break;
                    }
                    resizeImage(url, width, height).then(resizedUrl => {
                        imgCard1.src = resizedUrl;
                        imgCard2.src = resizedUrl;
                        updateCarouselImages(resizedUrl); // Update the carousel images with the resized URL
                    });
                }
            } else {
                loadingSpinnerCard1.remove();
                imageContainerCard1.innerHTML = `
                    <span style="
                        color: #45474B; 
                        font-weight: bold; 
                        font-size: 60px; 
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
                        background: -webkit-linear-gradient(#45474B, #6B6E73); 
                        -webkit-background-clip: text; 
                        -webkit-text-fill-color: transparent;
                    ">
                        Failed to generate image. Please try again...
                    </span>`;
                // No changes to imageContainerCard2; it retains the previous image

                isGenerating = false; // Reset flag on error
            }
        })
        .catch(error => {
            console.error("Error generating image:", error);
            if (currentRetry < retryCount) {
                const delay = initialDelay * Math.pow(2, currentRetry);
                currentRetry++;
                setTimeout(fetchImageWithRetry, delay);
            } else {
                loadingSpinnerCard1.remove();
                imageContainerCard1.innerHTML = `
                    <span style="
                        color: #45474B; 
                        font-weight: bold; 
                        font-size: 60px; 
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
                        background: -webkit-linear-gradient(#45474B, #6B6E73); 
                        -webkit-background-clip: text; 
                        -webkit-text-fill-color: transparent;
                    ">
                        Failed to generate image after retries. Please try again later...
                    </span>`;
                // No changes to imageContainerCard2; it retains the previous image

                isGenerating = false; // Reset flag after retries
            }
        });
    }

    // Initial fetch attempt
    fetchImageWithRetry();
}

// ----------------------------------------------

// Function to resize image
function resizeImage(url, width, height) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            }, "image/png");
        };
        img.onerror = reject;
        img.src = url;
    });
}

// Select the buttons
const recycleButton = document.getElementById('downloadButtonCard1');
const deleteButton = document.getElementById('deleteButtonCard1');
const downloadButton = document.getElementById('recycleButtonCard1');
const generate = document.getElementById('submit');

const leftArrowButtonCard3 = document.getElementById('leftArrowButtonCard2');
const rightArrowButtonCard3 = document.getElementById('rightArrowButtonCard2');
const copyButtonCard3 = document.getElementById('downloadButtonCard2');
const deleteButtonCard3 = document.getElementById('deleteButtonCard2'); 
const downloadButtonCard3 = document.getElementById('copyButtonCard2');

const card3ImageContainer = document.querySelector('.card2-image-container');
let card3Images = [];
let currentCard3ImageIndex = 0;

// Initially disable the recycle and delete buttons
recycleButton.disabled = true;
deleteButton.disabled = true;

let currentImageUrl = ""; // Store the current generated image URL

// Ensure buttons are positioned on top of the image
function appendButtons() {
    const imageContainer = document.querySelector("#card1 .card1-image-container");
    imageContainer.appendChild(recycleButton);
    imageContainer.appendChild(deleteButton);
    imageContainer.appendChild(downloadButton);
}

// Ensure buttons are positioned on top of the image in Card 3
function appendCard3Buttons() {
    const card3ImageContainer = document.querySelector(".card2-image-container");
    card3ImageContainer.appendChild(leftArrowButtonCard3);
    card3ImageContainer.appendChild(rightArrowButtonCard3);
    card3ImageContainer.appendChild(copyButtonCard3);
    card3ImageContainer.appendChild(deleteButtonCard3);
    card3ImageContainer.appendChild(downloadButtonCard3);
}

// Event listener for the icon buttons to toggle active class
document.querySelectorAll(".icon-btn").forEach(button => {
    button.addEventListener("click", function() {
        const buttons = this.closest(".field").querySelectorAll(".icon-btn");
        buttons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
    });
});

// Event listener for the download button in Card 2
downloadButton.addEventListener('click', () => {
    if (currentImageUrl) {
        const link = document.createElement('a');
        link.href = currentImageUrl;
        link.download = 'generated_image.png'; // You can change the default download name
        link.target = '_blank'; // Open in a new tab
        link.click();
    } else {
        alert("No image to download.");
    }
});

// Event listener for the delete button in Card 2
deleteButton.addEventListener('click', () => {
    const imageContainer = document.querySelector("#card1 .card1-image-container");
    imageContainer.innerHTML = ""; // Clear the current image
    const sampleImage = new Image();
    sampleImage.src = "image1.png"; // Path to the sample image
    sampleImage.alt = "Sample Image";
    sampleImage.classList.add("card2-image");
    imageContainer.appendChild(sampleImage);
    appendButtons(); // Re-append the buttons
    currentImageUrl = ""; // Clear the current image URL
});

// Event listener for the recycle button in Card 2
recycleButton.addEventListener('click', () => {
    if (currentImageUrl && !isGenerating) {
        const card3Image = new Image();
        card3Image.src = currentImageUrl;
        card3Image.alt = "Previously Generated Image";
        card3Image.classList.add("card2-image");

        card3Images.unshift(card3Image);
        displayCard3Image(0);
        generateImage();
        card3ImageContainer.scrollTop = 0; // Scroll to the top
    } else if (!currentImageUrl) {
        alert("No image to regenerate.");
    }
});

// Event listener for the main generate button
generate.addEventListener('click', () => {
    if (currentImageUrl && !isGenerating) {
        const card2Image = new Image();
        card2Image.src = currentImageUrl;
        card2Image.alt = "Previously Generated Image";
        card2Image.classList.add("card2-image");

        card3Images.unshift(card2Image);
        displayCard3Image(0);
    }

    if (!isGenerating) {
        generateImage();
    }
    card3ImageContainer.scrollTop = 0; // Scroll to the top
});

// Event listener for the left arrow button in Card 3
leftArrowButtonCard3.addEventListener('click', () => {
    if (card3Images.length > 0) {
        currentCard3ImageIndex = (currentCard3ImageIndex - 1 + card3Images.length) % card3Images.length;
        displayCard3Image(currentCard3ImageIndex);
    }
});

// Event listener for the right arrow button in Card 3
rightArrowButtonCard3.addEventListener('click', () => {
    if (card3Images.length > 0) {
        currentCard3ImageIndex = (currentCard3ImageIndex + 1) % card3Images.length;
        displayCard3Image(currentCard3ImageIndex);
    }
});

// Function to display image in Card 3 based on the index
function displayCard3Image(index) {
    card3ImageContainer.innerHTML = "";
    if (card3Images.length > 0) {
        const img = card3Images[index];
        card3ImageContainer.appendChild(img);
        appendCard3Buttons();
    } else {
        const sampleImage = new Image();
        sampleImage.src = "image2.png"; // Path to the default image
        sampleImage.alt = "Sample Image";
        sampleImage.classList.add("card2-image");
        card3ImageContainer.appendChild(sampleImage);
        appendCard3Buttons();
    }
}

// Event listener for the download button in Card 3
downloadButtonCard3.addEventListener('click', () => {
    if (card3Images.length > 0 && currentCard3ImageIndex >= 0 && currentCard3ImageIndex < card3Images.length) {
        const link = document.createElement('a');
        link.href = card3Images[currentCard3ImageIndex].src;
        link.download = 'generated_image.png';
        link.target = '_blank';
        link.click();
    } else {
        alert("No image to download.");
    }
});

// Event listener for the delete button in Card 3
deleteButtonCard3.addEventListener('click', () => {
    if (card3Images.length > 0 && currentCard3ImageIndex >= 0 && currentCard3ImageIndex < card3Images.length) {
        card3Images.splice(currentCard3ImageIndex, 1);
        currentCard3ImageIndex = Math.min(currentCard3ImageIndex, card3Images.length - 1);
        displayCard3Image(currentCard3ImageIndex);
    } else {
        alert("No image to delete.");
    }
});

// Event listener for the copy prompt button in Card 3
copyButtonCard3.addEventListener('click', () => {
    const promptText = document.getElementById('promptInput').value;
    if (promptText.trim() !== "") {
        navigator.clipboard.writeText(promptText)
            .then(() => alert("Prompt copied to clipboard successfully!"))
            .catch(err => console.error("Error copying prompt:", err));
    } else {
        alert("No prompt text to copy.");
    }
});

// Toggle active class for icon buttons
function toggleActive(button, group) {
    const groupMap = {
        style: 1,
        quality: 2,
        size: 3,
        guide: 4
    };

    const buttons = document.querySelectorAll(`#field${groupMap[group]} .icon-btn`);
    buttons.forEach(btn => {
        if (btn !== button) {
            btn.classList.remove('active');
        }
    });

    if (button.classList.contains('active')) {
        button.classList.remove('active');
    } else {
        button.classList.add('active');
    }
}

// Event listener for the Enter key in the prompt input field
document.getElementById('promptInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !isGenerating) {
        document.getElementById('submit').click();
    }
});

// Function to update the carousel images array
function updateCarouselImages(url) {
    const card3Image = new Image();
    card3Image.src = url;
    card3Image.alt = "Generated Image";
    card3Image.classList.add("card2-image");

    card3Images.unshift(card3Image);
    currentCard3ImageIndex = 0;
    displayCard3Image(currentCard3ImageIndex);
}

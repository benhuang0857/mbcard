// include fetch
const fetchUserData_get = () => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to login first!");
            window.location.href = "/login";
            reject("No token found");
            return;
        }

        fetch("/api/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    alert("Session expired. Please login again.");
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        })
        .then(resolve)
        .catch(error => {
            console.error("Error fetching user data:", error);
            alert("Failed to fetch user data. Please try again.");
            reject(error);
        });
    });
};

const getMember = () => {
    fetchUserData_get().then(data => {
        document.getElementById("member-name").textContent = data.name;
        document.getElementById("member-email").textContent = data.email || "N/A";
        document.getElementById("member-phone").textContent = data.mobile || "N/A";
        document.getElementById("member-address").textContent = data.address || "N/A";
        document.getElementById("member-description").textContent = data.description || "N/A";

        if (data.avatar) {
            document.getElementById("member-avatar").src = data.avatar;
            document.getElementById("member-avatar").style.display = "block";
        }

        // Portfolio Info
        if (data.portfolio) {
            document.getElementById("portfolio-bg").textContent = data.portfolio.bg_color || "N/A";
            if (data.portfolio.video) {
                document.getElementById("portfolio-video").href = data.portfolio.video;
                document.getElementById("portfolio-video").style.display = "block";
            }
            if (data.portfolio.voice) {
                document.getElementById("portfolio-voice").href = data.portfolio.voice;
                document.getElementById("portfolio-voice").style.display = "block";
            }
        }

        // Companies Info
        const companiesList = document.getElementById("companies-list");
        companiesList.innerHTML = "";
        if (data.companies && data.companies.length > 0) {
            data.companies.forEach(company => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${company.name || "Company"}</strong>: ${company.description || "No description"}`;
                companiesList.appendChild(li);
            });
        }
    });
};

const updateUserData_put = (field, value) => {
    return fetchUserData_get().then((data) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to login first!");
            window.location.href = "/login";
            return Promise.reject("No token found");
        }

        if (!data.account) {
            console.error("Error: 'account' field is missing.");
            alert("Error: Unable to retrieve user account.");
            return Promise.reject("No account data");
        }

        return fetch(`/api/members/${encodeURIComponent(data.account)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ [field]: value }), // Dynamic field update
        })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to update ${field}`);
            return response.json();
        });
    });
};


// doesn't directly use fetch
const editTrigger_name = (value) => {
    const target = document.getElementById(`${value}-section`);
    const status = target.dataset.status;

    if (status === "show") {
        target.innerHTML = `
        <form class="row animate__animated animate__fadeIn">
            <div class="col-12">
                <div class="c-edit">
                    <input id="input-${value}" class="c-edit__titleEdit text-center" type="text" placeholder="Enter new value">
                    <span class="c-edit__penEdit" onclick="editTrigger_name('${value}')"><i class="bi bi-toggle-on"></i></span>
                </div>
            </div>
        </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const newInsert = document.getElementById(`input-${value}`).value.trim();
        console.log( 'trigger part' + newInsert);

        if (newInsert) {
            updateValue(value); // ✅ Fix: No `${}` inside function call
        }

        target.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="c-edit animate__animated animate__fadeIn">
                    <h1 id="member-${value}" class="c-edit__title text-center">${newInsert || `No ${value}`}</h1>
                    <span class="c-edit__pen" onclick="editTrigger_name('${value}')"><i class="bi bi-toggle-off text-center"></i></span>
                </div>
            </div>
        </div>
        `;
        target.dataset.status = "show";
    }
};


const editTrigger_text = (value) => {
    const target = document.getElementById(`${value}-section`);
    const status = target.dataset.status;

    if (status === "show") {
        target.innerHTML = `
        <!-- input part -->
        <form class="row p-2 animate__animated animate__fadeIn">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <h2 class="c-edit__titleEdit text-center o-title">自我介紹</h2>
                    <span class="c-edit__penEdit"  onclick="editTrigger_text('description')"><i class="bi bi-toggle-on text-center"></i></span>
                </div>
            </div>
            <div class="col-12 c-edit__contentEdit">
                <textarea id="input-description" class="c-edit__contentEdit__text"></textarea>
            </div>
        </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const newInsert = document.getElementById(`input-${value}`).value.trim();
        console.log(newInsert);
        if (newInsert) {
            updateValue(`${value}`);
        }

        target.innerHTML = `
        <div class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__title text-center o-title">自我介紹</h2>
                        <span class="c-edit__pen" onclick="editTrigger_text('${value}')"><i class="bi bi-toggle-off text-center"></i></span>
                    </div>
                </div>
                <div class="col-12 c-edit__content">
                    <p id="member-description" class="c-edit__content__text">${newInsert || `No ${value}`}</p>
                </div>
        </div>
        `;
        target.dataset.status = "show";
    }
};

const editTrigger_contact = (e) => {
    const target = e.target.closest("#contact-section"); // Ensure we target the correct section

    if (!target) return; // Exit if clicked outside the contact section

    const status = target.dataset.status;

    if (status === "show") {
        target.innerHTML = `
        <!-- Input part -->
        <form class="row p-2">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <h2 class="c-edit__titleEdit text-center o-title">聯絡資訊</h2>
                    <span class="c-edit__penEdit"><i class="bi bi-toggle-on text-center"></i></span>
                </div>
            </div>
            <div class="col-12 c-edit__contactEdit">
                <!-- Email -->
                <div class="row c-edit__contactEdit__string">
                    <i class="col-1 bi bi-envelope text-black"></i>
                    <input id="input-email" class="col-9 text-center" type="text" placeholder="Enter new email">
                    <span class="col-1 text-center" onclick="editTrigger_contact(event, 'email')"><i class="bi bi-toggle-on text-center"></i></span>
                </div>
                <!-- Address -->
                <div class="row c-edit__contactEdit__string">
                    <i class="col-1 bi bi-geo-alt text-black"></i>
                    <input id="input-address" class="col-9 text-center" type="text" placeholder="Enter new address">
                    <span class="col-1 text-center" onclick="editTrigger_contact(event, 'address')"><i class="bi bi-toggle-on text-center"></i></span>
                </div>
                <!-- Phone -->
                <div class="row c-edit__contactEdit__string">
                    <i class="col-1 bi bi-telephone text-black"></i>
                    <input id="input-phone" class="col-9 text-center" type="text" placeholder="Enter new phone number">
                    <span class="col-1 text-center" onclick="editTrigger_contact(event, 'phone')"><i class="bi bi-toggle-on text-center"></i></span>
                </div>
            </div>
        </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        updateContactValue(target);
    }
};
const updateContactValue = (target) => {
    const email = document.getElementById("input-email")?.value.trim();
    const address = document.getElementById("input-address")?.value.trim();
    const phone = document.getElementById("input-phone")?.value.trim();

    if (email) updateValue("email");
    if (address) updateValue("address");
    if (phone) updateValue("phone");

    target.innerHTML = `
    <div class="row p-2">
        <div class="col-12 p-5 pt-3 pb-0">
            <div class="c-edit">
                <h2 class="c-edit__title text-center o-title">聯絡資訊</h2>
                <span class="c-edit__pen" onclick="editTrigger_contact(event)"><i class="bi bi-toggle-off text-center"></i></span>
            </div>
        </div>
        <div class="col-12 c-edit__content">
            <div class="row">
                <i class="col-1 bi bi-envelope text-black"></i>
                <p id="member-email" class="col-11 c-edit__content__text">${email || "No Email"}</p>
            </div>
            <div class="row">
                <i class="col-1 bi bi-geo-alt text-black"></i>
                <p id="member-address" class="col-11 c-edit__content__text">${address || "No Address"}</p>
            </div>
            <div class="row">
                <i class="col-1 bi bi-telephone text-black"></i>
                <p id="member-phone" class="col-11 c-edit__content__text">${phone || "No Phone Number"}</p>
            </div>
        </div>
    </div>
    `;
    target.dataset.status = "show";
};


const updateValue = (value) => {
    const newValue = document.getElementById(`input-${value}`).value.trim();
    console.log('update value part:' + newValue);
    if (!newValue) {
        alert(`Please enter a valid ${value}.`);
        return;
    }

    updateUserData_put(`${value}`, newValue)
        .then(updatedData => {
            console.log('api put part '+ `${value}` + newValue);
            document.getElementById(`member-${value}`).textContent = updatedData[value];
        })
        .catch(error => {
            console.error(`Error updating user ${value}:`, error);
            alert(`Failed to update user ${value} in updateUserData_put function. Please try again.`);
        });
};




// fin
// Function to handle return button click
const editFin = () => {
    fetchUserData_get().then((data) => {
        window.location.href = `/member/${data.account}`;
    })
};

// temp
// back image and potriat function (edit needed)
const setBackgroundImage = (selector, dataAttr) => {
    const element = $(selector);
    if (element.length) {
        element.css("background-image", `url(${element.attr(dataAttr)})`);
    } else {
        console.error(`Element with selector '${selector}' not found.`);
    }
};

// Call functions
getMember();

setBackgroundImage("#heroBanner", "data-banner");
setBackgroundImage("#portriat", "data-portriat");




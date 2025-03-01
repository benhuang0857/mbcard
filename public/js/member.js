// fetch get (inticial get)
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

const fetchCompanies = (account) => {
    return fetch("../api/companies/")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch companies");
            }
            return response.json();
        })
        .then(companies => {
            // Filter companies for the current user
            return companies.filter(company => company.uid === account);
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
            return []; // Return an empty array in case of an error
        });
};

const getMember = () => {
    fetchUserData_get().then(data => {
        document.getElementById("member-name").textContent = data.name;
        document.getElementById("member-email").textContent = data.email || "N/A";
        document.getElementById("member-mobile").textContent = data.mobile || "N/A";
        document.getElementById("member-address").textContent = data.address || "N/A";
        document.getElementById("member-description").textContent = data.description || "N/A";
        if (data.avatar) {
            const baseUrl = window.location.origin; // Dynamically get the base URL
            const avatarUrl = data.avatar.startsWith("http") ? data.avatar : `${baseUrl}/${data.avatar}`;
            document.getElementById("member-avatar").style.backgroundImage = `url(${avatarUrl})`;
        }
        if (data.banner) {
            const baseUrl = window.location.origin; // Dynamically get the base URL
            const bannerUrl = data.avatar.startsWith("http") ? data.banner : `${baseUrl}/${data.banner}`;
            document.getElementById("member-banner").style.backgroundImage = `url(${bannerUrl})`;
        }
    });
};

const getCompany = () => {
    fetchUserData_get().then(data => {
        fetchCompanies(data.account).then(userCompanies => {
            const companiesList = document.getElementById("companies-list");
            companiesList.innerHTML = "";

            userCompanies.forEach(company => {
                const singleCompany = document.createElement("section");
                singleCompany.setAttribute("id", `company-${company.id}-section`);
                singleCompany.setAttribute("class", "container");
                singleCompany.dataset.status = "show"; // Ensures status tracking

                // Row container
                const rowDiv = document.createElement("div");
                rowDiv.classList.add("row", "p-2");

                // Header section
                const headerDiv = document.createElement("div");
                headerDiv.classList.add("col-12", "p-5", "pt-3", "pb-0");
                const editDiv = document.createElement("div");
                editDiv.classList.add("c-edit");

                const title = document.createElement("h2");
                title.classList.add("c-edit__title", "text-center", "o-title");
                title.textContent = company.name || `Company ID ${company.id}`;

                const penIcon = document.createElement("span");
                penIcon.classList.add("c-edit__pen");
                penIcon.innerHTML = `<i class="bi bi-toggle-off text-center" onclick="editTrigger_company(${company.id}, '${company.name || ''}')"></i>`;

                editDiv.appendChild(title);
                editDiv.appendChild(penIcon);
                headerDiv.appendChild(editDiv);
                rowDiv.appendChild(headerDiv);

                // Content section
                const contentDiv = document.createElement("div");
                contentDiv.classList.add("col-12", "c-edit__content");

                const description = document.createElement("p");
                description.classList.add("c-edit__content__text");
                description.textContent = company.description || "No description";

                contentDiv.appendChild(description);
                contentDiv.appendChild(document.createElement("hr"));

                // Social media row (conditionally displayed)
                const socialRow = document.createElement("div");
                socialRow.classList.add("row", "justify-content-center");

                // Function to add social media icons
                const addSocialIcon = (platform, iconClass) => {
                    if (company[platform]) {
                        const aHref = document.createElement("a");
                        aHref.setAttribute("href", company[platform]); // Set the link dynamically
                        aHref.setAttribute("target", "_blank"); // Open in a new tab
                        aHref.classList.add("col-2", "text-center");

                        const icon = document.createElement("i");
                        icon.classList.add("bi", iconClass, "o-socialBtn");

                        aHref.appendChild(icon); // Append icon inside anchor tag
                        socialRow.appendChild(aHref); // Append column to the row
                    }
                };

                addSocialIcon("facebook", "bi-facebook");
                addSocialIcon("instagram", "bi-instagram");
                addSocialIcon("video", "bi-play-circle-fill");
                addSocialIcon("linkedin", "bi-linkedin");
                addSocialIcon("line", "bi-line");

                if (socialRow.children.length > 0) {
                    contentDiv.appendChild(socialRow);
                }

                rowDiv.appendChild(contentDiv);
                singleCompany.appendChild(rowDiv);
                companiesList.appendChild(singleCompany);
            });
        });
    });
};

// update function
// for user
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
        console.log('trigger part' + newInsert);

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
    const target = document.getElementById("contact-section"); // Fix targeting
    const status = target.dataset.status;

    if (status === "show") {
        fetchUserData_get().then(data => {
            target.innerHTML = `
            <!-- Input part -->
            <form class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__titleEdit text-center o-title">聯絡資訊</h2>
                        <span class="c-edit__penEdit" onclick="editTrigger_contact(event)"><i class="bi bi-toggle-on text-center"></i></span>
                    </div>
                </div>
                <div class="col-12 c-edit__contactEdit">
                    <!-- Email -->
                    <div class="row c-edit__contactEdit__string">
                        <i class="col-1 bi bi-envelope text-black"></i>
                        <input id="input-email" class="col-9 text-center" type="text">
                    </div>
                    <!-- Address -->
                    <div class="row c-edit__contactEdit__string">
                        <i class="col-1 bi bi-geo-alt text-black"></i>
                        <input id="input-address" class="col-9 text-center" type="text">
                    </div>
                    <!-- Mobile -->
                    <div class="row c-edit__contactEdit__string">
                        <i class="col-1 bi bi-telephone text-black"></i>
                        <input id="input-mobile" class="col-9 text-center" type="text">
                    </div>
                </div>
            </form>
            `;
            document.getElementById("input-email").value = data.email || "N/A";
            document.getElementById("input-mobile").value = data.mobile || "N/A";
            document.getElementById("input-address").value = data.address || "N/A";
        });

        target.dataset.status = "edit";
    } else if (status === "edit") {
        updateContactValue(target); // Pass target correctly
    }
};

const updateContactValue = (target) => {
    const email = document.getElementById("input-email")?.value.trim();
    const address = document.getElementById("input-address")?.value.trim();
    const mobile = document.getElementById("input-mobile")?.value.trim();

    if (email) updateValue("email", email);
    if (address) updateValue("address", address);
    if (mobile) updateValue("mobile", mobile);

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
                <p id="member-mobile" class="col-11 c-edit__content__text">${mobile || "No Mobile Number"}</p>
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
            console.log('api put part ' + `${value}` + newValue);
            document.getElementById(`member-${value}`).textContent = updatedData[value];
        })
        .catch(error => {
            console.error(`Error updating user ${value}:`, error);
            alert(`Failed to update user ${value} in updateUserData_put function. Please try again.`);
        });
};

// for company
// 1️⃣ Fetch company data (GET request)
const fetchCompanyData = (companyId) => {
    return fetch(`../api/companies/${companyId}/`)
        .then(response => response.json())
        .catch(error => console.error("Error fetching company data:", error));
};

// 2️⃣ Generates the input fields for editing (social media links)
const generateSocialMediaInputs = (company) => {
    const socialPlatforms = [
        { key: "facebook", icon: "bi-facebook", color: "o-socialBtn__dark" },
        { key: "instagram", icon: "bi-instagram", color: "o-socialBtn__gray" },
        { key: "linkedin", icon: "bi-linkedin", color: "o-socialBtn__gray" },
        { key: "line", icon: "bi-line", color: "o-socialBtn__gray" }
    ];

    return socialPlatforms.map(platform => `
        <div class="row justify-content-center p-1">
            <div class="col-2 text-center">
                <i class="bi ${platform.icon} ${platform.color}"></i>
            </div>
            <input id="input-company-${platform.key}" type="text" class="col-10" value="${company[platform.key] || ""}">
        </div>
    `).join("");
};

// 3️⃣ Main function to trigger editing mode
const editTrigger_company = (companyId, companyName) => {
    const target = document.getElementById(`company-${companyId}-section`);
    const status = target.dataset.status;

    if (status === "show") {
        fetchCompanyData(companyId).then(company => {
            target.innerHTML = `
            <form class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__titleEdit text-center o-title">${companyName || "營運公司"}</h2>
                        <span class="c-edit__penEdit" onclick="editTrigger_company(${companyId}, '${companyName}')"><i class="bi bi-toggle-on text-center"></i></span>
                    </div>
                </div>
                <div class="col-12 c-edit__contentEdit">
                    <textarea id="input-company-description" class="c-edit__contentEdit__text">${company.description || ""}</textarea>
                    <hr>
                    <div class="container">
                        ${generateSocialMediaInputs(company)}
                    </div>
                </div>
            </form>
            `;
        });

        target.dataset.status = "edit";
    } else if (status === "edit") {
        updateCompanyValue(companyId);
    }
};

// 4️⃣ Function to update the company data (PUT request)
const updateCompanyValue = (companyId) => {
    const target = document.getElementById(`company-${companyId}-section`);
    const newDescription = document.getElementById("input-company-description").value.trim();
    const updatedData = {
        description: newDescription,
        facebook: document.getElementById("input-company-facebook").value.trim(),
        instagram: document.getElementById("input-company-instagram").value.trim(),
        linkedin: document.getElementById("input-company-linkedin").value.trim(),
        line: document.getElementById("input-company-line").value.trim()
    };

    console.log("Updated company data:", updatedData); // Debugging

    fetch(`../api/companies/${companyId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(updatedCompany => {
        console.log("Company updated successfully:", updatedCompany);
        
        target.innerHTML = `
        <div class="row p-2">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <h2 class="c-edit__title text-center o-title">${updatedCompany.name}</h2>
                    <span class="c-edit__pen" onclick="editTrigger_company(${companyId}, '${updatedCompany.name}')"><i class="bi bi-toggle-off text-center"></i></span>
                </div>
            </div>
            <div class="col-12 c-edit__content">
                <p class="c-edit__content__text">${updatedCompany.description || "No description"}</p>
                <hr>
                <div class="container">
                    <div class="row justify-content-center">
                        ${generateSocialMediaDisplay(updatedCompany)}
                    </div>
                </div>
            </div>
        </div>
        `;

        target.dataset.status = "show";
    })
    .catch(error => console.error("Error updating company:", error));
};

// 5️⃣ Generates social media links for display mode
const generateSocialMediaDisplay = (company) => {
    const socialPlatforms = [
        { key: "facebook", icon: "bi-facebook" },
        { key: "instagram", icon: "bi-instagram" },
        { key: "linkedin", icon: "bi-linkedin" },
        { key: "line", icon: "bi-line" }
    ];

    return socialPlatforms.map(platform => 
        company[platform.key] ? `
            <div class="col-2 text-center">
                <a href="${company[platform.key]}" target="_blank">
                    <i class="bi ${platform.icon} o-socialBtn"></i>
                </a>
            </div>` : ""
    ).join("");
};



// fin
// Function to handle return button click
const editFin = () => {
    fetchUserData_get().then((data) => {
        window.location.href = `/member/${data.account}`;
    })
};

// Call functions
getMember();
getCompany();



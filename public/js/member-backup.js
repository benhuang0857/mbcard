// Fetch functions
const fetchUserData = () => {
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
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                alert("Failed to fetch user data. Please try again.");
                reject(error);
            });
    });
};

const fetchCompanies = (id) => {
    return fetch("../api/companies/")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch companies");
            }
            return response.json();
        })
        .then(companies => {
            console.log("Fetched companies:", companies);
            return companies.filter(company => company.uid === id);
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
            return [];
        });
};

const fetchPortfolios = (account) => {
    return fetch("../api/portfolios/")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch portfolios");
            }
            return response.json();
        })
        .then(portfolios => portfolios.filter(portfolio => portfolio.uid === account))
        .catch(error => {
            console.error("Error fetching portfolios:", error);
            return [];
        });
};

// Update functions
const updateUserData = (field, value) => {
    return fetchUserData().then((data) => {
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

        const options = {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        };

        if (value instanceof File) {
            const formData = new FormData();
            formData.append(field, value);
            options.body = formData;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify({ [field]: value });
        }

        return fetch(`/api/members/${encodeURIComponent(data.account)}`, options)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to update ${field}`);
                return response.json();
            })
            .then(updatedData => {
                if (field === 'avatar') {
                    const baseUrl = window.location.origin;
                    const avatarUrl = updatedData.avatar.startsWith("http") ? updatedData.avatar : `${baseUrl}/storage/${updatedData.avatar}`;
                    document.getElementById('member-avatar').style.backgroundImage = `url(${avatarUrl})`;
                }
                return updatedData;
            })
            .catch(error => {
                console.error(`Error updating ${field}:`, error);
                alert(`Failed to update ${field}. Please try again.`);
            });
    });
};

const updatePortfolio = (field, value) => {
    return fetchUserData().then((data) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to login first!');
            window.location.href = '/login';
            return;
        }

        const url = `/api/portfolios/${encodeURIComponent(data.id)}`;
        const options = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        if (value instanceof File) {
            const formData = new FormData();
            formData.append(field, value);
            options.body = formData;
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify({ [field]: value });
        }

        return fetch(url, options)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to update ${field}`);
                return response.json();
            })
            .then(updatedData => {
                if (field === 'bg_color') {
                    document.querySelector('body').style.backgroundColor = updatedData.bg_color;
                } else if (field === 'avatar') {
                    const baseUrl = window.location.origin;
                    const avatarUrl = updatedData.avatar.startsWith("http") ? updatedData.avatar : `${baseUrl}/${updatedData.avatar}`;
                    document.getElementById('member-avatar').style.backgroundImage = `url(${avatarUrl})`;
                }
            })
            .catch(error => {
                console.error(`Error updating ${field}:`, error);
                alert(`Failed to update ${field}. Please try again.`);
            });
    });
};

// Display functions
const displayMember = (data) => {
    console.log(data);
    document.getElementById("member-name").textContent = data.name;
    document.getElementById("member-email").textContent = data.email || "N/A";
    document.getElementById("member-mobile").textContent = data.mobile || "N/A";
    document.getElementById("member-address").textContent = data.address || "N/A";
    document.getElementById("member-description").textContent = data.description || "N/A";
    if (data.avatar) {
        const baseUrl = window.location.origin;
        const avatarUrl = data.avatar.startsWith("http") ? data.avatar : `${baseUrl}/${data.avatar}`;
        document.getElementById("member-avatar").style.backgroundImage = `url(${avatarUrl})`;
    }
    if (data.banner) {
        const baseUrl = window.location.origin;
        const bannerUrl = data.avatar.startsWith("http") ? data.banner : `${baseUrl}/${data.banner}`;
        document.getElementById("member-banner").style.backgroundImage = `url(${bannerUrl})`;
    }
};

const displayCompanies = (userCompanies) => {
    const companiesList = document.getElementById("companies-list");
    companiesList.innerHTML = "";

    userCompanies.forEach(company => {
        const singleCompany = document.createElement("section");
        singleCompany.setAttribute("id", `company-${company.id}-section`);
        singleCompany.setAttribute("class", "container");
        singleCompany.dataset.status = "show";

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row", "p-2");

        const headerDiv = document.createElement("div");
        headerDiv.classList.add("col-12", "p-5", "pt-3", "pb-0");
        const editDiv = document.createElement("div");
        editDiv.classList.add("c-edit");

        const title = document.createElement("h2");
        title.classList.add("c-edit__title", "text-center", "o-title");
        title.textContent = company.name || `Company ID ${company.id}`;

        const penIcon = document.createElement("span");
        penIcon.classList.add("c-edit__pen");
        penIcon.innerHTML = `<i class="bi bi-pencil text-center" onclick="editTrigger_company(${company.id}, '${company.name || ''}')"></i>`;

        editDiv.appendChild(title);
        editDiv.appendChild(penIcon);
        headerDiv.appendChild(editDiv);
        rowDiv.appendChild(headerDiv);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("col-12", "c-edit__content");

        const description = document.createElement("p");
        description.classList.add("c-edit__content__text");
        description.textContent = company.description || "No description";

        contentDiv.appendChild(description);
        contentDiv.appendChild(document.createElement("hr"));

        const socialRow = document.createElement("div");
        socialRow.classList.add("row", "justify-content-center");

        const addSocialIcon = (platform, iconClass) => {
            if (company[platform]) {
                const aHref = document.createElement("a");
                aHref.setAttribute("href", company[platform]);
                aHref.setAttribute("target", "_blank");
                aHref.classList.add("col-2", "text-center");

                const icon = document.createElement("i");
                icon.classList.add("bi", iconClass, "o-socialBtn");

                aHref.appendChild(icon);
                socialRow.appendChild(aHref);
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
};

const displayPortfolio = (userPortfolio) => {
    if (userPortfolio.length > 0) {
        document.body.style.backgroundColor = userPortfolio[0].bg_color;
        const portfolioSocial = document.getElementById("portfolio-social-section");
        const socialPlatforms = [
            { key: "facebook", icon: "bi-facebook" },
            { key: "instagram", icon: "bi-instagram" },
            { key: "linkedin", icon: "bi-linkedin" },
            { key: "line", icon: "bi-line" }
        ];

        const socialLinks = socialPlatforms.map(platform => {
            if (userPortfolio[0][platform.key]) {
                return `<a href='${userPortfolio[0][platform.key]}' target="_blank" class="col-2 text-center"><i class="bi ${platform.icon} text-center o-socialBtn"></i></a>`;
            }
            return '';
        }).join('');

        portfolioSocial.innerHTML = `
        <div class="row justify-content-center">
            ${socialLinks}
            <a href="https://google.com" target="_blank" class="col-2 text-center"><i class="bi bi-plus-circle-dotted text-center o-socialBtn"></i></a>
        </div>
        `;
        console.log(userPortfolio);
    } else {
        console.warn("No portfolio found for this user.");
    }
};

// Trigger functions
const editTrigger = (field, value) => {
    const target = document.getElementById(`${field}-section`);
    const status = target.dataset.status;

    if (status === "show") {
        target.innerHTML = `
        <form class="row animate__animated animate__fadeIn">
            <div class="col-12">
                <div class="c-edit">
                    <input id="input-${field}" class="c-edit__titleEdit text-center" type="text" placeholder="Enter new value">
                    <span class="c-edit__penEdit" onclick="editTrigger('${field}')"><i class="bi bi-pencil"></i></span>
                </div>
            </div>
        </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const newInsert = document.getElementById(`input-${field}`).value.trim();
        if (newInsert) {
            updateUserData(field, newInsert);
        }

        target.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="c-edit animate__animated animate__fadeIn">
                    <h1 id="member-${field}" class="c-edit__title text-center">${newInsert || `No ${field}`}</h1>
                    <span class="c-edit__pen" onclick="editTrigger('${field}')"><i class="bi bi-pencil text-center"></i></span>
                </div>
            </div>
        </div>
        `;
        target.dataset.status = "show";
    }
};

const editTrigger_contact = () => {
    const target = document.getElementById("contact-section");
    const status = target.dataset.status;

    if (status === "show") {
        fetchUserData().then(data => {
            target.innerHTML = `
            <form class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__titleEdit text-center o-title">聯絡資訊</h2>
                        <span class="c-edit__penEdit" onclick="editTrigger_contact()"><i class="bi bi-pencil text-center"></i></span>
                    </div>
                </div>
                <div class="col-12 c-edit__contactEdit">
                    <div class="row c-edit__contactEdit__string">
                        <i class="col-1 bi bi-envelope text-black"></i>
                        <input id="input-email" class="col-9 text-center" type="text">
                    </div>
                    <div class="row c-edit__contactEdit__string">
                        <i class="col-1 bi bi-geo-alt text-black"></i>
                        <input id="input-address" class="col-9 text-center" type="text">
                    </div>
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
        const email = document.getElementById("input-email")?.value.trim();
        const address = document.getElementById("input-address")?.value.trim();
        const mobile = document.getElementById("input-mobile")?.value.trim();

        if (email) updateUserData("email", email);
        if (address) updateUserData("address", address);
        if (mobile) updateUserData("mobile", mobile);

        target.innerHTML = `
        <div class="row p-2">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <h2 class="c-edit__title text-center o-title">聯絡資訊</h2>
                    <span class="c-edit__pen" onclick="editTrigger_contact()"><i class="bi bi-pencil text-center"></i></span>
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
    }
};

const editTrigger_avatar = () => {
    const target = document.getElementById('avatar-button');
    const main = document.querySelector('main');
    const status = target.dataset.status;

    if (status === 'hide') {
        fetchUserData().then(data => {
            main.innerHTML += `
            <section id="avatar-popup" class="container c-bg" data-status="hide">
                <form class="row p-2 animate__animated animate__slideInUp">
                    <div class="col-12 p-5 pt-3 pb-0">
                        <div class="c-edit">
                            <h2 class="c-edit__titleEdit text-center o-title">更新封面圖</h2>
                            <span class="c-edit__penEdit" onclick="editTrigger_avatar()"><i class="bi bi-pencil text-center"></i></span>
                        </div>
                    </div>
                    <div class="col-12 c-edit__contentEdit pt-5 p-3 d-flex justify-content-center">
                        <div class="row">
                        <p class="text-black">頭像</p>
                        <input type="file" id="input-avatar" class="col-12 fs-6" accept="image/jpeg">
                        <hr>
                        <p class="text-black">封面</p>
                        <input type="file" id="input-banner" class="col-12 fs-6" accept="image/jpeg">
                        </div>
                    </div>
                </form>
            </section>
            `;
            target.dataset.status = 'edit';
        });
    } else if (status === 'edit') {
        const popupAvatar = document.getElementById('avatar-popup');
        updateUserData('avatar', document.getElementById('input-avatar').files[0]);
        popupAvatar.remove();
        target.dataset.status = 'show';
    }
};

const editTrigger_bgColor = () => {
    const target = document.getElementById('bgColor-button');
    const main = document.querySelector('main');
    const status = target.dataset.status;

    if (status === 'hide') {
        fetchUserData().then(data => {
            fetchPortfolios(data.account).then(userPortfolio => {
                main.innerHTML += `
                <section id="bgColor-popup" class="container c-bg" data-status="hide">
                    <form class="row p-2 animate__animated animate__slideInUp">
                        <div class="col-12 p-5 pt-3 pb-0">
                            <div class="c-edit">
                                <h2 class="c-edit__titleEdit text-center o-title">更新背景顏色</h2>
                                <span class="c-edit__penEdit" onclick="editTrigger_bgColor()"><i class="bi bi-pencil text-center"></i></span>
                            </div>
                        </div>
                        <div class="col-12 c-edit__contentEdit pt-5 p-3 d-flex justify-content-center">
                            <input type="color" id="input-bgColor" class="col" value='${userPortfolio[0].bg_color}'>
                        </div>
                    </form>
                </section>
                `;
                target.dataset.status = 'edit';
            });
        });
    } else if (status === 'edit') {
        const popupBg = document.getElementById('bgColor-popup');
        const newInsert = document.getElementById('input-bgColor').value.trim();
        if (newInsert) {
            updatePortfolio('bg_color', newInsert);
        }
        popupBg.remove();
        target.dataset.status = 'show';
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
                    <span class="c-edit__penEdit"  onclick="editTrigger_text('description')"><i class="bi bi-pencil text-center"></i></span>
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
        if (newInsert) {
            updateUserData(value, newInsert);
        }

        target.innerHTML = `
        <div class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__title text-center o-title">自我介紹</h2>
                        <span class="c-edit__pen" onclick="editTrigger_text('${value}')"><i class="bi bi-pencil text-center"></i></span>
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
                        <span class="c-edit__penEdit" onclick="editTrigger_company(${companyId}, '${companyName}')"><i class="bi bi-pencil text-center"></i></span>
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

// new company edit trigger
const editTrigger_newCompany = (userId) => {
    const target = document.getElementById("add-company-section");
    const status = target.dataset.status;

    if (status === "show") {
        target.innerHTML = `
            <form class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__titleEdit text-center o-title">新公司</h2>
                        <span class="c-edit__penEdit" onclick="editTrigger_newCompany('${userId}')"><i class="bi bi-pencil text-center"></i></span>
                    </div>
                </div>
                <div class="col-12 c-edit__contentEdit">
                    <textarea id="input-newCompany-description" class="c-edit__contentEdit__text"></textarea>
                </div>
            </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const newDescription = document.getElementById("input-newCompany-description").value.trim();
        if (newDescription) {
            fetch("/api/companies/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ uid: userId, description: newDescription })
            })
                .then(response => response.json())
                .then(() => {
                    // initCompanies();
                    window.location.reload();
                    // target.dataset.status = "show";
                })
                .catch(error => console.error("Error creating new company:", error));
        }
    }

}

const fetchCompanyData = (companyId) => {
    return fetch(`/api/companies/${companyId}/`)
        .then(response => response.json())
        .catch(error => console.error("Error fetching company data:", error));
};

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

const updateCompanyValue = (companyId) => {
    const target = document.getElementById(`company-${companyId}-section`);
    const newDescription = document.getElementById("input-company-description").value.trim();
    console.log("New Description:", newDescription); // Log the newDescription value

    const updatedData = {
        description: newDescription,
        facebook: document.getElementById("input-company-facebook").value.trim(),
        instagram: document.getElementById("input-company-instagram").value.trim(),
        linkedin: document.getElementById("input-company-linkedin").value.trim(),
        line: document.getElementById("input-company-line").value.trim()
    };
    console.log("Updated Data:", updatedData); // Log the updatedData object

    fetch(`/api/companies/${companyId}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
        .then(response => response.json())
        .then(updatedCompany => {
            target.innerHTML = `
        <div class="row p-2">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <h2 class="c-edit__title text-center o-title">${updatedCompany.name}</h2>
                    <span class="c-edit__pen" onclick="editTrigger_company(${companyId}, '${updatedCompany.name}')"><i class="bi bi-pencil text-center"></i></span>
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
            console.log("Updated Company Response:", updatedCompany);
            target.dataset.status = "show";
        })
        .catch(error => console.error("Error updating company:", error));
};

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

// Initialization functions
const initMember = () => {
    fetchUserData().then(displayMember);
};

const initCompanies = () => {
    fetchUserData().then(data => {
        fetchCompanies(data.id).then(displayCompanies).then(() => {
            const target = document.querySelector("main");
            target.innerHTML += `
            <section id="add-company-section" class="container" data-status="show">
                <div class="p-3 w-100 d-flex flex-column align-items-center justify-content-center">
                    <h2 class="o-title text-center w-75">新增店家</h2>
                    <i id="new-company" class="bi bi-plus-circle-dotted text-center o-addCompanyBtn" onclick="editTrigger_newCompany('${data.id}')" ></i>
                </div>
            </section>
            `;
        });
    });
};

const initPortfolio = () => {
    fetchUserData().then(data => fetchPortfolios(data.account).then(displayPortfolio));
};

// Call initialization functions
initMember();
// initCompanies();
// initPortfolio();



// token storage ---------------------------
const tokenGet = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first!");
        window.location.href = "/login";
    };
    return token;
}

// sheets ---------------------------
const userSheet = [];
const seeSheet = () => { console.log(userSheet); };

const companiesSheet = [];
const seeCompaniesSheet = () => { console.log(companiesSheet); };

// Fetch functions ---------------------------
// fetch me get
const fetchUserData = async () => {
    const token = tokenGet();

    try {
        const response = await fetch("/api/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        userSheet.length = 0;
        userSheet.push(data);
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data. Please try again.");
        throw error;
    }
};

// fetch portfolio get
const fetchPortfolioData = async () => {
    try {
        const user = await fetchUserData();
        // console.log('user info ' + user.id);
        const token = tokenGet();
        const response = await fetch(`/api/portfolios/${user.id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        // console.log(data);
        return data;

    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
};

// fetch company get
const fetchCompaniesData = async () => {
    try {
        const token = tokenGet();
        const response = await fetch(`/api/companies/`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
            throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        companiesSheet.length = 0;
        companiesSheet.push(data);
        return data;

    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

// triggers ---------------------------

// name trigger
const editTrigger_name = async () => {
    const target = document.getElementById('name-section');
    const status = target.dataset.status;
    if (status === "show") {
        fetchUserData().then(data => {
            target.innerHTML = `
        <form class="row animate__animated animate__fadeIn">
            <div class="col-12">
                <div class="c-edit">
                    <input id="input-name" class="c-edit__titleEdit text-center" type="text" placeholder="Enter new value">
                    <span class="c-edit__penEdit" onclick="editTrigger_name()"><i class="bi bi-check-circle"></i></span>
                </div>
            </div>
        </form>
        `;
            document.getElementById("input-name").value = data.name;
        });
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const token = tokenGet();
        const newName = document.getElementById('input-name').value;
        console.log(newName);
        fetch("/api/me", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: newName }),
        })
            .then(async response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        alert("Session expired. Please login again.");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                    const errorText = await response.text();
                    console.error("Error response from server:", errorText);
                    throw new Error("Failed to update user data");
                }
                const data = await response.json().catch(async () => {
                    const text = await response.text();
                    console.error("Non-JSON response received:", text);
                    throw new Error("Failed to parse server response as JSON");
                });
                console.log("Server response:", data);
                target.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <div class="c-edit animate__animated animate__fadeIn">
                        <h1 id="member-name" class="c-edit__title text-center">${data.name}</h1>
                        <span class="c-edit__pen" onclick="editTrigger_name()"><i class="bi bi-pencil text-center"></i></span>
                    </div>
                </div>
            </div>
            `;
                target.dataset.status = "show";
            })
            .catch(error => {
                console.error("Error updating user data:", error);
                alert("Failed to update user data. Please try again.");
            });
    }
};

// imgs trigger
const editTrigger_img = async () => {
    const target = document.getElementById('img-button');
    const main = document.querySelector('main');
    const status = target.dataset.status;

    if (status === 'hide') {
        main.innerHTML += `
            <section id="avatar-popup" class="container c-bg" data-status="hide">
                <form class="row p-2 animate__animated animate__slideInUp">
                    <div class="col-12 p-5 pt-3 pb-0">
                        <div class="c-edit">
                            <h2 class="c-edit__titleEdit text-center o-title">更新封面圖</h2>
                            <span class="c-edit__penEdit" onclick="editTrigger_img()"><i class="bi bi-pencil text-center"></i></span>
                        </div>
                    </div>
                    <div class="col-12 c-edit__contentEdit pt-5 p-3 d-flex justify-content-center">
                        <div class="row">
                        <p class="text-black" for="avatar">頭像</p>
                        <input type="file" id="input-avatar" class="col-12 fs-6" name="avatar" accept="image/*">
                        <hr>
                        <p class="text-black" for="banner">封面</p>
                        <input type="file" id="input-banner" class="col-12 fs-6" name="banner" accept="image/*">
                        </div>
                    </div>
                </form>
            </section>
            `;
        target.dataset.status = 'edit';
    } else if (status === 'edit') {
        const token = tokenGet();
        console.log('token in trigger' + token);
        const formData = new FormData();
        const avatarFile = document.getElementById('input-avatar').files[0];
        const bannerFile = document.getElementById('input-banner').files[0];
        const name = document.getElementById('member-name').textContent;

        if (bannerFile) {
            formData.append("banner", bannerFile);
            console.log('formdata' + formData);
        }
        if (avatarFile) {
            formData.append("avatar", avatarFile);
            console.log('formdata' + formData);
        }

        formData.append("name", name);

        // Uncomment and modify the fetch request for real API call
        fetch("/api/me", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        alert("Session expired. Please login again.");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                    return response.text().then(errorText => {
                        console.error("Error response from server:", errorText);
                        throw new Error("Failed to update user data");
                    });
                }
                return response.json().catch(() => {
                    return response.text().then(text => {
                        console.error("Non-JSON response received:", text);
                        throw new Error("Failed to parse server response as JSON");
                    });
                });
            })
            .then(data => {
                console.log("Server response:", data);
                alert("Files uploaded successfully!");
                window.location.reload();
            })
            .catch(error => {
                console.error("Error updating user data:", error);
                alert("Failed to update user data. Please try again.");
            });
    }
};

// intro trigger
const editTrigger_intro = async () => {
    const target = document.getElementById('intro-section');
    const status = target.dataset.status;

    if (status === "show") {
        fetchUserData().then(data => {
            target.innerHTML = `
            <!-- input part -->
            <form class="row p-2 animate__animated animate__fadeIn">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__titleEdit text-center o-title">自我介紹</h2>
                        <span class="c-edit__penEdit"  onclick="editTrigger_intro()"><i class="bi bi-check-circle text-center"></i></span>
                    </div>
                </div>
                <div class="col-12 c-edit__contentEdit">
                    <textarea id="input-intro" class="c-edit__contentEdit__text"></textarea>
                </div>
            </form>
            `;
            document.getElementById("input-intro").value = data.description || "N/A";
        });
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const token = tokenGet();
        const newIntro = {
            name: document.getElementById('member-name').textContent,
            description: document.getElementById('input-intro').value
        }
        console.log(newIntro);
        fetch("/api/me", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newIntro),
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        alert("Session expired. Please login again.");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }
                    return response.text().then(errorText => {
                        console.error("Error response from server:", errorText);
                        throw new Error("Failed to update user data");
                    });
                }
                return response.json().catch(() => {
                    return response.text().then(text => {
                        console.error("Non-JSON response received:", text);
                        throw new Error("Failed to parse server response as JSON");
                    });
                });
            })
            .then(data => {
                console.log("Server response:", data);
                target.innerHTML = `
                <div class="row p-2">
                    <div class="col-12 p-5 pt-3 pb-0">
                        <div class="c-edit">
                            <h2 class="c-edit__title text-center o-title">自我介紹</h2>
                            <span class="c-edit__pen" onclick="editTrigger_intro()"><i class="bi bi-pencil text-center"></i></span>
                        </div>
                    </div>
                    <div class="col-12 c-edit__content">
                        <p id="member-description" class="c-edit__content__text">${data.description}</p>
                    </div>
                </div>
            `;
                target.dataset.status = "show";
            })
            .catch(error => {
                console.error("Error updating user data:", error);
                alert("Failed to update user data. Please try again.");
            });
    }

};

// contact trigger
const editTrigger_contact = async () => {
    const target = document.getElementById("contact-section");
    const status = target.dataset.status;
    if (status === "show") {
        fetchUserData().then(data => {
            target.innerHTML = `
            <form class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__titleEdit text-center o-title">聯絡資訊</h2>
                        <span class="c-edit__penEdit" onclick="editTrigger_contact()"><i class="bi bi-check-circle text-center"></i></span>
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
        const token = tokenGet();
        const newContact = {
            name: document.getElementById("member-name").textContent,
            email: document.getElementById("input-email").value,
            mobile: document.getElementById("input-mobile").value,
            address: document.getElementById("input-address").value
        }

        fetch("/api/me", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newContact),
        })
            .then(response => response.json())
            .then(data => {
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
                            <p id="member-email" class="col-11 c-edit__content__text">${data.email || "No Email"}</p>
                        </div>
                        <div class="row">
                            <i class="col-1 bi bi-geo-alt text-black"></i>
                            <p id="member-address" class="col-11 c-edit__content__text">${data.address || "No Address"}</p>
                        </div>
                        <div class="row">
                            <i class="col-1 bi bi-telephone text-black"></i>
                            <p id="member-mobile" class="col-11 c-edit__content__text">${data.mobile || "No Mobile Number"}</p>
                        </div>
                    </div>
                </div>
                `;
            })
            .then(target.dataset.status = "show")
            .catch(error => console.error("Error updating user data:", error));

    };
};

// portsocial trigger
const editTrigger_portfolio_social = async () => {
    const target = document.getElementById('portfolio-social-section');
    const status = target.dataset.status;

    if (status === "show") {
        const data = await fetchPortfolioData();
        const socialPlatforms = [
            { key: "facebook", icon: "bi-facebook", color: "o-socialBtn__dark" },
            { key: "instagram", icon: "bi-instagram", color: "o-socialBtn__gray" },
            { key: "linkedin", icon: "bi-linkedin", color: "o-socialBtn__gray" },
            { key: "line", icon: "bi-line", color: "o-socialBtn__gray" }
        ];

        const socialLinks = socialPlatforms.map(platform => {
            return `
            <div class="row c-edit__contactEdit__string">
                <i class="col-1 bi ${platform.icon} ${platform.color}"></i>
                <input value='${data[platform.key] || ""}' id="input-${platform.key}" class="col-10 text-center" type="text" spellcheck="false" data-ms-editor="true">
            </div>
            `;
        }).join('');

        target.innerHTML = `
        <form class="row p-2 animate__animated animate__fadeIn">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <h2 class="c-edit__titleEdit text-center o-title">social</h2>
                    <span class="c-edit__penEdit" onclick="editTrigger_portfolio_social()"><i class="bi bi-check-circle text-center"></i></span>
                </div>
            </div>
            <div class="col-12 c-edit__contactEdit">
                ${socialLinks}
            </div>
        </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const token = tokenGet();
        const data = await fetchPortfolioData();
        const newSocial = {
            uid: data.uid,
            facebook: document.getElementById("input-facebook").value,
            instagram: document.getElementById("input-instagram").value,
            linkedin: document.getElementById("input-linkedin").value,
            line: document.getElementById("input-line").value
        };

        console.log(newSocial);

        fetch(`/api/portfolios/${data.id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newSocial),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(err => { throw new Error(err); }); // Handle errors
                }
                return response.json(); // ✅ Ensure JSON is returned for the next .then()
            })
            .then(data => {
                console.log("Server response:", data);
                target.dataset.status = "show";
            })
            .catch(error => {
                console.error("Error updating portfolio data:", error);
                alert("Failed to update portfolio data. Please try again.");
            });

            window.location.reload();
    }
};

// company trigger
const editTrigger_company = async (id) => {
    const companySheet = userSheet[0].companies.find(company => company.id === id);
    const target = document.getElementById(`company-${id}-section`);
    const status = target.dataset.status;

    if (status === "show") {
        const socialPlatforms = [
            { key: "facebook", icon: "bi-facebook", color: "o-socialBtn__dark" },
            { key: "instagram", icon: "bi-instagram", color: "o-socialBtn__gray" },
            { key: "linkedin", icon: "bi-linkedin", color: "o-socialBtn__gray" },
            { key: "line", icon: "bi-line", color: "o-socialBtn__gray" }
        ];

        const socialLinks = socialPlatforms.map(platform => {
            const companyValue = companySheet[platform.key] || "";
            return `
            <div class="row c-edit__contactEdit__string">
                <i class="col-1 bi ${platform.icon} ${platform.color}"></i>
                <input value="${companyValue}" id="input-${platform.key}" class="col-10 text-center" type="text" spellcheck="false" data-ms-editor="true">
            </div>
            `;
        }).join('');
        target.innerHTML = `
        <form class="row p-2">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <input id="input-name" class="c-edit__titleEdit text-center o-title border border-dark" value="${companySheet.name}">
                    <span class="c-edit__penEdit" onclick="editTrigger_company(${id})"><i class="bi bi-check-circle text-center"></i></span>
                </div>
            </div>
            <div class="col-12 c-edit__contentEdit">
                <textarea id="input-company-description" class="c-edit__contentEdit__text">${companySheet.description}</textarea>
                <hr>
                <div class="container c-edit__contactEdit">
                ${socialLinks}
                </div>
                <div class="d-flex justify-content-center"><span class="c-edit__penEdit" onclick="editTriger_delete_company(${id})"><i class="bi bi-trash text-center"></i></span></div>
            </div>
        </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const OldCompany = document.getElementById(`companies-section`);
        const token = tokenGet();
        const updateCompany = {
            id: companySheet.id,
            uid: companySheet.uid,
            name: document.getElementById("input-name").value,
            description: document.getElementById("input-company-description").value,
            facebook: document.getElementById("input-facebook").value.trim(),
            instagram: document.getElementById("input-instagram").value.trim(),
            linkedin: document.getElementById("input-linkedin").value.trim(),
            line: document.getElementById("input-line").value.trim()
        };
        console.log(updateCompany);
        fetch(`/api/companies/${companySheet.id}/`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateCompany)
        })
            .then(response => response.json())
            .then(() => {
                OldCompany.innerHTML = ``;
                fetchUserData().then(data => {
                    displayCompanies(data);
                });
            })
    }
};

// add company trigger
const editTrigger_add_company = async () => {
    fetchCompaniesData();
    const target = document.getElementById("add-company-section");
    const status = target.dataset.status;

    if (status === "show") {
        const socialPlatforms = [
            { key: "facebook", icon: "bi-facebook", color: "o-socialBtn__dark" },
            { key: "instagram", icon: "bi-instagram", color: "o-socialBtn__gray" },
            { key: "linkedin", icon: "bi-linkedin", color: "o-socialBtn__gray" },
            { key: "line", icon: "bi-line", color: "o-socialBtn__gray" }
        ];

        const socialLinks = socialPlatforms.map(platform => {
            return `
            <div class="row c-edit__contactEdit__string">
                <i class="col-1 bi ${platform.icon} ${platform.color}"></i>
                <input id="input-${platform.key}" class="col-10 text-center" type="text" spellcheck="false" data-ms-editor="true">
            </div>
            `;
        }).join('');
        target.innerHTML = `
        <form class="row p-2">
            <div class="col-12 p-5 pt-3 pb-0">
                <div class="c-edit">
                    <input id="input-name" class="c-edit__titleEdit text-center o-title border border-dark">
                    <span class="c-edit__penEdit" onclick="editTrigger_add_company()"><i class="bi bi-check-circle text-center"></i></span>
                </div>
            </div>
            <div class="col-12 c-edit__contentEdit">
                <textarea id="input-company-description" class="c-edit__contentEdit__text"></textarea>
                <hr>
                <div class="container c-edit__contactEdit">
                ${socialLinks}
                </div>
            </div>
        </form>
        `;
        target.dataset.status = "edit";
    } else if (status === "edit") {
        const userUid = userSheet[0].id;
        const OldCompany = document.getElementById(`companies-section`);
        const addCompany = {
            uid: `${userUid}`,
            name: document.getElementById("input-name").value,
            status: 1,
            description: document.getElementById("input-company-description").value,
            facebook: document.getElementById("input-facebook").value,
            instagram: document.getElementById("input-instagram").value,
            linkedin: document.getElementById("input-linkedin").value,
            line: document.getElementById("input-line").value
        };
        console.log(addCompany);
        fetch(`/api/companies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(addCompany)
        })
            .then(response => response.text())
        OldCompany.innerHTML = ``;
        initMember();
    }
};

// delete company trigger
const editTriger_delete_company = async (id) => {
    const fetch_route = '/api/companies/' + id;
    const companySection = document.getElementById("companies-section");
    fetch(fetch_route, {
        method: "DELETE"
    })
    .then(console.log('deleted'))
    .then(companySection.innerHTML="")
    .then(()=>{
        fetchUserData().then(data => {
            displayMember(data);
            displayCompanies(data);
        });
    })
};

// bg color trigger
const editTrigger_bgColor = async () => {
    const oldColor = userSheet[0].portfolio.bg_color;
    const main = document.querySelector('main');
    const token = tokenGet();
    const target = document.getElementById('bgColor-button');
    const status = target.dataset.status;
    if (status === "hide") {
        main.innerHTML += `
            <section id="bgColor-popup" class="container c-bg" data-status="hide">
                <form class="row p-2 animate__animated animate__slideInUp">
                    <div class="col-12 p-5 pt-3 pb-0">
                        <div class="c-edit">
                            <h2 class="c-edit__titleEdit text-center o-title">更新背景顏色</h2>
                            <span class="c-edit__penEdit" onclick="editTrigger_bgColor()"><i class="bi bi-check-circle text-center"></i></span>
                        </div>
                    </div>
                    <div class="col-12 c-edit__contentEdit pt-5 p-3 d-flex justify-content-center">
                        <input type="color" id="input-bgColor" class="col" value="${oldColor}">
                    </div>
                </form>
            </section>
            `;
        target.dataset.status = 'edit';
    } else if (status === 'edit') {
        const popup = document.getElementById('bgColor-popup');
        const token = tokenGet();
        const userId = userSheet[0].id;
        const newColor = {
            bg_color: document.getElementById('input-bgColor').value
        };
        console.log(newColor);
        fetch(`/api/portfolios/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newColor),
        })
        const body = document.querySelector('body');
        body.style.backgroundColor = document.getElementById('input-bgColor').value;
        popup.remove();
    }

};

// Display functions ---------------------------
// basic display
const displayMember = async (data) => {
    document.getElementById("member-name").textContent = data.name || "N/A";
    document.getElementById("member-email").textContent = data.email || "N/A";
    document.getElementById("member-mobile").textContent = data.mobile || "N/A";
    document.getElementById("member-address").textContent = data.address || "N/A";
    document.getElementById("member-description").textContent = data.description || "N/A";
    if (data.avatar) {
        const baseUrl = window.location.origin;
        const avatarUrl = data.avatar.startsWith("http") ? data.avatar : `${baseUrl}/storage/${data.avatar}`;
        document.getElementById("member-avatar").style.backgroundImage = `url(${avatarUrl})`;
    }
    if (data.banner) {
        const baseUrl = window.location.origin;
        const bannerUrl = data.avatar.startsWith("http") ? data.banner : `${baseUrl}/storage/${data.banner}`;
        document.getElementById("member-banner").style.backgroundImage = `url(${bannerUrl})`;
    }
};

// portfolio display
const displayPortfolio = async (data) => {
    const body = document.querySelector('body');
    body.style.backgroundColor = data.bg_color;

    const portfolioSocial = document.getElementById('portfolio-social-section');

    const socialPlatforms = [
        { key: "facebook", icon: "bi-facebook" },
        { key: "instagram", icon: "bi-instagram" },
        { key: "linkedin", icon: "bi-linkedin" },
        { key: "line", icon: "bi-line" }
    ];

    const socialLinks = socialPlatforms.map(platform => {
        if (data[platform.key]) {
            return `<a href='${data[platform.key]}' target="_blank" class="col-2 text-center"><i class="bi ${platform.icon} text-center o-socialBtn"></i></a>`;
        }
        return '';
    }).join('');

    portfolioSocial.innerHTML = `
    <div class="row justify-content-center">
        ${socialLinks}
        <a class="col-2 text-center" onclick="editTrigger_portfolio_social()"><i class="bi bi-plus-circle-dotted text-center o-socialBtn"></i></a>
    </div>
    `;
};

// companies display
const displayCompanies = async (data) => {
    const companySection = document.getElementById('companies-section');
    const companiesList = data.companies;
    console.log(companiesList);
    companiesList.forEach(company => {
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
        title.textContent = company.name || `Company ID ${company.name}`;

        const penIcon = document.createElement("span");
        penIcon.classList.add("c-edit__pen");
        penIcon.innerHTML = `<i class="bi bi-pencil text-center" onclick="editTrigger_company(${company.id})"></i>`;

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
        companySection.appendChild(singleCompany);
    });
    companySection.innerHTML += `
    <section id="add-company-section" class="container" data-status="show">
        <div class="p-3 w-100 d-flex flex-column align-items-center justify-content-center">
            <h2 class="o-title text-center w-75">新增店家</h2>
            <i id="new-company" class="bi bi-plus-circle-dotted text-center o-addCompanyBtn" onclick="editTrigger_add_company()" ></i>
        </div>
    </section>
    `;
};

// Initialization functions ---------------------------
const initMember = () => {
    fetchUserData().then(data => {
        displayMember(data);
        displayCompanies(data);
    });
    fetchPortfolioData().then(displayPortfolio);
};

// logout function ---------------------------
const viewMode = () => {
    localStorage.removeItem("token");
    const userAccount = userSheet[0].account;
    fetch("/api/logout", {
        method: "POST",
    }).then(() => {
        window.location.href = "/member/" + userAccount;
    });
};

// Call initialization functions ---------------------------
initMember();




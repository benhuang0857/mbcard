const userSheet = [];
const seeSheet = () => { console.log(userSheet); };

const fetchGuestBcard = async () => {
    // 取得 URL 中的 account 參數
    let urlSegments = window.location.pathname.split('/');
    let account = urlSegments[urlSegments.length - 1];
    try {
        let response = await fetch('/api/members/' + account);
        if (!response.ok) {
            if (response.status === 404) {
                alert("Member not found.");
                window.location.href = "/";
            } else {
                const footer = document.querySelector('footer');
                footer.innerHTML += `<p style="color: red;">Failed to load member data.</p>`;
            }
            return;
        }
        let data = await response.json();
        userSheet.length = 0;
        userSheet.push(data);
    } catch (error) {
        const footer = document.querySelector('footer');
        footer.innerHTML += `<p style="color: red;">Failed to load member data.</p>`;
    }
}

const displayMember = async () => {
    document.getElementById("member-name").textContent = userSheet[0].name;
    document.getElementById("member-email").textContent = userSheet[0].email;
    document.getElementById("member-mobile").textContent = userSheet[0].mobile;
    document.getElementById("member-address").textContent = userSheet[0].address;
    document.getElementById("member-description").textContent = userSheet[0].description;
    if (userSheet[0].avatar) {
        const baseUrl = window.location.origin;
        const avatarUrl = userSheet[0].avatar.startsWith("http") ? userSheet[0].avatar : `${baseUrl}/storage/${userSheet[0].avatar}`;
        document.getElementById("member-avatar").style.backgroundImage = `url(${avatarUrl})`;
    }
    if (userSheet[0].banner) {
        const baseUrl = window.location.origin;
        const bannerUrl = userSheet[0].banner.startsWith("http") ? userSheet[0].banner : `${baseUrl}/storage/${userSheet[0].banner}`;
        document.getElementById("member-banner").style.backgroundImage = `url(${bannerUrl})`;
    }
};

// companies display
const displayCompanies = async () => {
    const companySection = document.getElementById('companies-section');
    const companiesList = userSheet[0].companies;
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

        editDiv.appendChild(title);
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
};

const displayPortfolio = async () => {
    const body = document.querySelector('body');
    body.style.backgroundColor = userSheet[0].portfolio.bg_color;

    const portfolioSocial = document.getElementById('portfolio-social-section');

    const socialPlatforms = [
        { key: "facebook", icon: "bi-facebook" },
        { key: "instagram", icon: "bi-instagram" },
        { key: "linkedin", icon: "bi-linkedin" },
        { key: "line", icon: "bi-line" }
    ];

    const socialLinks = socialPlatforms.map(platform => {
        if (userSheet[0].portfolio[platform.key]) {
            return `<a href='${userSheet[0].portfolio[platform.key]}' target="_blank" class="col-2 text-center"><i class="bi ${platform.icon} text-center o-socialBtn"></i></a>`;
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

// Call initialization functions ---------------------------
const initMember = () => {
    fetchGuestBcard().then(
        ()=>{
            displayMember();
            displayCompanies();
            displayPortfolio();
        }
    );
};

initMember();

// edit mode

const editMode =() => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first!");
        window.location.href = "/login";
        return;
    }
    window.location.href = "/admin/member";
}

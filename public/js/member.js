const getMember = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first!");
        window.location.href = "/login";
        return;
    }

    const fetchUserData = () => {
        fetch("/api/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
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
        .then((data) => {
            $("#member-name").text(data.name);
            $("#member-account").text(data.account);
            $("#member-email").text(data.email || "N/A");
            $("#member-phone").text(data.mobile || "N/A");
            $("#member-address").text(data.address || "N/A");
            $("#member-description").text(data.description || "N/A");

            if (data.avatar) {
                $("#member-avatar").attr("src", data.avatar).show();
            }

            // Portfolio info
            if (data.portfolio) {
                $("#portfolio-bg").text(data.portfolio.bg_color || "N/A");
                if (data.portfolio.video) {
                    $("#portfolio-video").attr("href", data.portfolio.video).show();
                }
                if (data.portfolio.voice) {
                    $("#portfolio-voice").attr("href", data.portfolio.voice).show();
                }
            }

            // Companies info
            $("#companies-list").empty();
            if (data.companies && data.companies.length > 0) {
                data.companies.forEach((company) => {
                    $("#companies-list").append(`<li><strong>${company.name || "Company"}</strong>: ${company.description || "No description"}</li>`);
                });
            }
        })
        .catch(() => {
            $("#error-message").show();
        });
    };

    fetchUserData();

    $("#logout").click(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    });
}

getMember();

const setBackgroundImage = (selector, dataAttr) => {
    const element = $(selector);
    if (element.length) {
        element.css("background-image", `url(${element.attr(dataAttr)})`);
    } else {
        console.error(`Element with selector '${selector}' not found.`);
    }
};

// Set background for hero banner
setBackgroundImage("#heroBanner", "data-banner");

// Set background for portrait
setBackgroundImage("#portriat", "data-portriat");

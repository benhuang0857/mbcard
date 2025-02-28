$(document).ready(function () {
    // 取得 URL 中的 account 參數
    let urlSegments = window.location.pathname.split('/');
    let account = urlSegments[urlSegments.length - 1];

    $.ajax({
        url: '/api/members/' + account,
        method: 'GET',
        success: function (response) {
            $('#member-name').text(response.name);
            $('#member-account').text(response.account);
            $('#member-email').text(response.email || 'N/A');
            $('#member-phone').text(response.mobile || 'N/A');
            $('#member-address').text(response.address || 'N/A');
            $('#member-description').text(response.description || 'N/A');
            if (response.avatar) {
                $('#member-avatar').attr('src', response.avatar).show();
            }

            // 顯示 Portfolio 資訊
            if (response.portfolio) {
                $('#portfolio-bg').text(response.portfolio.bg_color || 'N/A');
                if (response.portfolio.video) {
                    $('#portfolio-video').attr('href', response.portfolio.video).show();
                }
                if (response.portfolio.voice) {
                    $('#portfolio-voice').attr('href', response.portfolio.voice).show();
                }
            }

            // 顯示 Companies 資訊
            if (response.companies && response.companies.length > 0) {
                $('#companies-list').empty();
                response.companies.forEach(function (company) {
                    $('#companies-list').append('<li><strong>' + (company.name || 'Company') + '</strong>: ' + (company.description || 'No description') + '</li>');
                });
            }
        },
        error: function (xhr) {
            if (xhr.status === 404) {
                alert("Member not found.");
                window.location.href = "/";
            } else {
                const footer = document.querySelector('footer');
                footer.innerHTML += `<p style="color: red;">Failed to load member data.</p>`
            }
        }
    });
});

const editMode =() => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first!");
        window.location.href = "/login";
        return;
    }
    window.location.href = "/admin/member";
}

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
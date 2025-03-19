
// verification code popup
const verify_submit = () => {
    $('#forms').on("click", "#email-submit", (e) => {
        e.preventDefault(); // Prevent form submission
        $("#forms").append(`
            <form id="security-code" class="container">
                <div class="row gy-md-5 gy-3 p-2">
                    <p class="col-12 text__notice p-0">已發送驗證碼至信箱</p>
                    <div class="col-12">
                        <div class="row inputSubmit">
                            <input type="text" id="account" class="col-10 inputSubmit__input" name="account" placeholder="確認信箱輸入驗證碼" required>
                            <button id="reset-password" type="submit" class="col-2 inputSubmit__btn">
                                <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-6 p-0">
                        <button class="btn__security-submit" id="resend-code" onclick="verify_text(this)">重新發送驗證碼</button>
                    </div>
                    <div class="col-6 p-0">
                        <p class="col-12 text__alert p-0">驗證碼錯誤</p>
                    </div>
                </div>
            </form>
        `);
    })

    $('#forms').on("click", "#reset-password", (e) => {
        e.preventDefault(); // Prevent form submission
        $("#forms").append(`
            <form id="login-form" class="container">
    <div class="row gy-md-5 gy-3 p-2">
        <input type="text" id="account" class="col-12 input__main" name="account" placeholder="輸入舊密碼" required>
        <input type="password" id="password" class="col-12 input__main" name="password" placeholder="輸入新密碼" required>
        <input type="password" id="password" class="col-12 input__main" name="password" placeholder="再次輸入新密碼" required>
        <p class="col-12 text__alert p-0">密碼錯誤/or/兩次密碼不相符</p>
        <button type="submit" class="col-12 btn__submit">登入</button>
    </div>
</form>
        `);
    })
};
verify_submit();

// Verification code function
const verify_text = (e) => {
    e.textContent = "在30s後可再次發送";
}

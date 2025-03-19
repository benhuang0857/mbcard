<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Login</title>
    <!-- get react and react dom -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- get babel -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <!-- jquery and css links -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="{{ asset('css/mainStyle.css') }}">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</head>

<body class="container">
    <header class="row p-2">
        <a href="{{ asset('/login') }}"><i class="bi bi-arrow-left-circle text-dark fs-1"></i></a>
    </header>
    <main class="row">
        <div class="col-md-6 align-self-center h-25 text-center">
            <i class="bi bi-person-circle o-icon__large"></i>
        </div>

        <div id="forms" class="col-md-6 p-2 h-75">
            <h3 class="o-form-label__main">更改密碼</h3>
            <form class="container">
                <div class="row gy-md-5 gy-3 p-2">
                    <div class="col-12">
                        <div class="row o-inputSubmit">
                            <input type="text" id="account" class="col-10 o-inputSubmit__input" name="account" placeholder="輸入電子信箱" required>
                            <button id="email-submit" type="submit" class="col-2 o-inputSubmit__btn">
                                <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    <p class="col-12 o-text__alert p-0">信箱輸入錯誤</p>
                </div>
            </form>
            <p id="error-message" style="color: red; display: none;">Invalid credentials. Please try again.</p>
        </div>
    </main>
    <!-- login js -->
    <script src="{{ asset('js/forgetPassword.js') }}"></script>
</body>

</html>

<!-- 
<div id="forms" class="col-md-6 p-2 h-75">
    <h3 class="form-label__main">更改密碼</h3>
    <form class="container">
        <div class="row gy-md-5 gy-3 p-2">
            <div class="col-12">
                <div class="row inputSubmit">
                    <input type="text" id="account" class="col-10 inputSubmit__input" name="account" placeholder="輸入電子信箱" required>
                    <button id="email-submit" type="submit" class="col-2 inputSubmit__btn">
                        <i class="bi bi-arrow-right"></i>
                    </button>
                </div>
            </div>
            <p class="col-12 text__alert p-0">信箱輸入錯誤</p>
        </div>
    </form>
    <p id="error-message" style="color: red; display: none;">Invalid credentials. Please try again.</p>
</div> -->
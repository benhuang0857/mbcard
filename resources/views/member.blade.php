<!-- member.html -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Profile</title>
    <!-- jquery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- animate css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <!-- costumize -->
    <link rel="stylesheet" href="{{ asset('css/mainStyle.css') }}">
</head>

<body>
    <header class="c-header__member container">
        <div class="row">
            <div id="member-banner" class="col-12 c-hero__banner">
                <span id="img-button" class="c-edit__smallPen" onclick="editTrigger_img()" data-status="hide"><i class="bi bi-pencil text-center"></i></span>
            </div>
            <div class="col-12 c-hero__portrait">
                <div id="member-avatar" class="c-hero__portrait__img"></div>
            </div>
        </div>
    </header>
    <main>
        <!-- name -->
        <section id="name-section" class="container p-5 pt-3 pb-3" data-status="show">
            <div class="row">
                <div class="col-12">
                    <div class="c-edit animate__animated animate__fadeIn">
                        <h1 id="member-name" class="c-edit__title text-center"></h1>
                        <span class="c-edit__pen" onclick="editTrigger_name()"><i class="bi bi-pencil text-center"></i></span>
                    </div>
                </div>
            </div>
        </section>
        <!-- social icon -->
        <section id="portfolio-social-section" class="container" data-status="show">
        </section>
        <!-- description -->
        <section id="intro-section" class="container" data-status="show">
            <div class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__title text-center o-title">自我介紹</h2>
                        <span class="c-edit__pen" onclick="editTrigger_intro()"><i class="bi bi-pencil text-center"></i></span>
                    </div>
                </div>
                <div class="col-12 c-edit__content">
                    <p id="member-description" class="c-edit__content__text"></p>
                </div>
            </div>
        </section>
        <!-- contact -->
        <section id="contact-section" class="container" data-status="show">
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
                        <p id="member-email" class="col-11 c-edit__content__text"></p>
                    </div>
                    <div class="row">
                        <i class="col-1 bi bi-geo-alt text-black"></i>
                        <p id="member-address" class="col-11 c-edit__content__text"></p>
                    </div>
                    <div class="row">
                        <i class="col-1 bi bi-telephone text-black"></i>
                        <p id="member-mobile" class="col-11 c-edit__content__text"></p>
                    </div>
                </div>
            </div>
        </section>

        <!-- company -->
        <div id="companies-section">
        </div>
    </main>
    <footer>
        <div class="d-flex flex-column c-setting">
            <i id="bgColor-button" class="bi bi-palette" onclick="editTrigger_bgColor()" data-status="hide"></i>
            <i class="bi bi-gear-fill" onclick="viewMode()"></i>
        </div>
    </footer>
    <script src="{{ asset('js/member.js') }}"></script>
</body>

</html>
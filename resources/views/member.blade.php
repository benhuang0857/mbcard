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
                <span class="c-edit__smallPen"><i class="bi bi-pencil text-center"></i></span>
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
                        <span class="c-edit__pen" onclick="editTrigger_name('name')"><i class="bi bi-toggle-off text-center"></i></span>
                    </div>
                </div>
            </div>
        </section>
        <!-- social icon -->
        <section class="container">
            <div class="row justify-content-center">
                <a href="https://google.com" target="_blank" class="col-2 text-center"><i class="bi bi-plus-circle-dotted text-center o-socialBtn"></i></a>
            </div>
        </section>
        <!-- description -->
        <section id="description-section" class="container" data-status="show">
            <div class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <div class="c-edit">
                        <h2 class="c-edit__title text-center o-title">自我介紹</h2>
                        <span class="c-edit__pen" onclick="editTrigger_text('description')"><i class="bi bi-toggle-off text-center"></i></span>
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
                        <span class="c-edit__pen" onclick="editTrigger_contact()"><i class="bi bi-toggle-off text-center"></i></span>
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
        <div id="companies-list">
            <section id="company-1-section" class="container">
                <div class="row p-2">
                    <div class="col-12 p-5 pt-3 pb-0">
                        <div class="c-edit">
                            <h2 class="c-edit__title text-center o-title">營運公司(name)</h2>
                            <span class="c-edit__pen"><i class="bi bi-toggle-off text-center"></i></span>
                        </div>
                    </div>
                    <div class="col-12 c-edit__content">
                        <p class="c-edit__content__text"></p>
                        <hr>
                        <div class="row justify-content-center">
                            <div class="col-2 text-center">
                                <i class="bi bi-facebook o-socialBtn"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- add company -->
        <div id="add-company-section" class="p-3 w-100 d-flex flex-column align-items-center justify-content-center">
            <h2 class="o-title text-center w-75">新增店家</h2>
            <i class="bi bi-plus-circle-dotted text-center o-addCompanyBtn"></i>
        </div>
    </main>
    <footer>
        <i class="bi bi-gear-fill c-setting" onclick="editFin()"></i>
    </footer>
    <script src="{{ asset('js/member.js') }}"></script>
</body>

</html>


<!-- old code -->
<!-- 
<h2>Member Profile</h2>
<button id="logout">Logout</button>
<div id="member-info">
    <p><strong>Name:</strong> <span id="member-name"></span></p>
    <p><strong>Account:</strong> <span id="member-account"></span></p>
    <p><strong>Email:</strong> <span id="member-email"></span></p>
    <p><strong>Phone:</strong> <span id="member-phone"></span></p>
    <p><strong>Address:</strong> <span id="member-address"></span></p>
    <p><strong>Description:</strong> <span id="member-description"></span></p>
    <img id="member-avatar" src="" alt="Avatar" style="max-width: 150px; display: none;">

    <h3>Portfolio</h3>
    <div id="portfolio-info">
        <p><strong>Background Color:</strong> <span id="portfolio-bg"></span></p>
        <p><strong>Video:</strong> <a id="portfolio-video" href="#" target="_blank" style="display: none;">View Video</a></p>
        <p><strong>Voice:</strong> <a id="portfolio-voice" href="#" target="_blank" style="display: none;">Listen</a></p>
    </div>

    <h3>Companies</h3>
    <ul id="companies-list"></ul>
</div> -->
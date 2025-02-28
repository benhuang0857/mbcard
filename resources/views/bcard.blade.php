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
    <!-- costumize -->
    <link rel="stylesheet" href="{{ asset('css/mainStyle.css') }}">
</head>
<body>
<header class="c-header__member container">
        <div class="row">
            <div id="heroBanner" class="c-hero__banner" data-banner="{{asset('media/banner/default-banner.jpg')}}">
            </div>
            <div class="c-hero__portrait">
                <div id="portriat" class="c-hero__portrait__img" data-portriat="{{ asset('media/portrait/test-portrait.png') }}"></div>
            </div>
        </div>
    </header>
    <main>
        <!-- name -->
        <section class="container">
            <div class="row">
                <div class="col-12 p-5 pt-3 pb-3">
                    <h1 id="member-name" class="text-center o-title"></h1>
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
        <section class="container">
            <div class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <h2 class="text-center o-title">自我介紹</h2>
                </div>
                <div class="col-12 c-content">
                    <p id="member-description" class="c-content__text"></p>
                </div>
            </div>
        </section>
        <!-- description -->
        <section class="container">
            <div class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <h2 class="text-center o-title">聯絡資訊</h2>
                </div>
                <div class="col-12 c-content">
                    <p id="member-email" class="c-content__text"></p>
                    <p id="member-address" class="c-content__text"></p>
                    <p id="member-phone" class="c-content__text"></p>
                </div>
            </div>
        </section>

        <!-- company -->
        <section class="container">
            <div class="row p-2">
                <div class="col-12 p-5 pt-3 pb-0">
                    <h2 class="text-center o-title">營運公司</h2>
                </div>
                <div class="col-12 c-content">
                    <ul id="companies-list"></ul>
                </div>
            </div>
        </section>
    </main>
    <footer>
        <i class="bi bi-gear-fill c-setting" onclick="editMode()"></i>
    </footer>
    <script src="{{ asset('js/guest-bcard.js') }}"></script>
</body>
</html>

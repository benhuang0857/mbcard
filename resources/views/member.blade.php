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
                <div class="col-12 p-5">
                    <h1 id="member-name" class="text-center o-title"></h1>
                </div>
            </div>
        </section>
        <!-- social icon -->
        <section class="container">
            <div class="row">
                <i class="col-2 bi bi-plus-circle-dotted"></i>
            </div>
        </section>
    </main>
    <footer>
        <p id="error-message" style="color: red; display: none;">Failed to load member data.</p>
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
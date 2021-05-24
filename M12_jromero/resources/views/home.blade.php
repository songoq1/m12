<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Bot de JRomero</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        <!-- Styles -->
        
        <link rel="stylesheet" href="{{ URL::asset('css/main.css') }} ">
        <link rel="stylesheet" href="{{ URL::asset('css/bulma.css') }} ">
        <link rel="stylesheet" href="{{ URL::asset('css/font-awesome.min.css') }} ">
        <link rel="stylesheet" href="{{ URL::asset('css/prova.css') }} ">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.3/css/all.css" integrity="sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk" crossorigin="anonymous">


    </head>
    <body class="">
    <div class="hero-head">
				<header class="nav sticky topnav">
					<div class="container">
						<a class="nav-item active" href="{{ route('home') }}">
							<img src="{{ URL::asset('img/discord-logo.svg') }}" class="hideme" style="width: 6em;" alt="discord-logo">
						</a>
                        <a class="nav-item active icon" href="{{ route('home') }}">
                            <i class="fab fa-discord"></i>
						</a>
						<div class="nav-right" id="myLinks">
							<a href="{{ route('home') }}" class="nav-item is-active">
								Inici
							</a>
							<a href="{{ route('comandes') }}" class="nav-item ">
								Comandes
							</a>
							<a href="https://discord.gg/bKH3vV83Gb" target="_blank" class="nav-item">
								Uneix-te al nostre discord
							</a>
							<a href="https://discord.com/oauth2/authorize?client_id=837340929950089247&scope=bot&permissions=2081418489" target="_blank" class="nav-item " style="color: #ffffff;">
								<span>Invita Bot de JRomero al teu servidor</span>
							</a> 
                        </div>
                        <a href="javascript:void(0);" class="icon" onclick="myFunction()">
                            <i class="fas fa-bars"></i>
                        </a>
					</div>
				</header>
			</div>

        <!-- particles.js container --> 
        <div id="particles-js"></div> 

        <div class="text">
            <h1>Bot de JRomero</h1>
            <img src="{{ URL::asset('img/logo.png') }}" alt="logo">
            <h2>Un bot de <img src="{{ URL::asset('img/discord-logo.svg') }}" style="width: 5em; vertical-align: middle; margin-bottom: 0.2em;" alt="discord-logo"> basat en un "GACHA" de cartes.</h2>
            
            <h3>Creat per songoq1#2508</h3>
            <a href="https://discord.com/oauth2/authorize?client_id=837340929950089247&scope=bot&permissions=3423599809" target="_blank"><button>Invita Bot de JRomero al teu servidor</button></a>
        </div>

        <!-- particles.js lib - https://github.com/VincentGarreau/particles.js --> 
        <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script> 
        <script src="particules.js"></script>

        <script>
        function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}


        particlesJS(
            "particles-js", {
                "particles": {
                    "number": {
                    "value": 58,
                    "density": {
                        "enable": true,
                        "value_area": 700
                    }
                    },
                    "color": {
                    "value": ["#ffffff", "#ffffff", "#ffffff", "#ffffff"]
                    },
                    "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#ffffff"
                    },
                    "polygon": {
                        "nb_sides": 15
                    }
                    },
                    "opacity": {
                    "value": 0.7,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1.5,
                        "opacity_min": 0.15,
                        "sync": false
                    }
                    },
                    "size": {
                    "value": 2.5,
                    "random": false,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.15,
                        "sync": false
                    }
                    },
                    "line_linked": {
                    "enable": true,
                    "distance": 120,
                    "color": "#ffffff",
                    "opacity": 0.5,
                    "width": 1
                    },
                    "move": {
                    "enable": true,
                    "speed": 1.6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                    "onhover": {
                        "enable": false,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "push"
                    },
                    "resize": true
                    },
                    "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                        "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                    }
                },
                "retina_detect": true
            });
        </script>
    </body>
</html>

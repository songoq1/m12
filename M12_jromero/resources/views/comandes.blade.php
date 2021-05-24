<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Comandes</title>

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

        <div class="text-comandes">
            <h1>Comandes</h1>

            <h2>Invocacions</h2>
            <p>Un personatge invocat tindrà una reacció a la part de sota de la seva targeta, si no té propietari apareixarà 👍, si li dones reclamaràs el personatge, si té propietari apareixarà 💲, li pots clicar per rebre el preu del personatge. Només tens 10 segons per poder donar-li!<br><br>
            Tens 5 tirades per defecte cada hora, però només pots reclamar un personatge cada 3 hores.<br><br>
            Un altre usuari pot reclamar un dels personatges que tu has invocat, si tu reclames un personatge que ja ha sigut reclamat però que has invocat tú, pots reclamar-lo com teu. Això no funciona a la inversa, si tu reclames un personatge que has invocat, no el pot reclamar ningú més. D'igual manera funciona la reacció que apareix quan un personatge invocat ja té propietari.<br>
            </p>
            <p><b>jr!invocar</b> / <b>jr!i</b>: Invoca un personatge aleatori.</p>
            <p><b>jr!invocar home</b> / <b>jr!ih</b>: Invoca un personatge aleatori home.</p>
            <p><b>jr!invocar dona</b> / <b>jr!id</b>: Invoca un personatge aleatori dona.</p>
            
            <h2>Perfil</h2>
            <p><b>jr!perfil</b>: Mostra una targeta amb la teva info (Nivell, Crystals, Victories).</p>
            <p><b>jr!lvlup</b>: Puja el teu nivell per 5000 crystals. Pujar el teu nivell incrementa les invocacions que tens cada hora, 1 més per cada nivell.</p>
            <p><b>jr!daily</b>: Obtens 100 crystals, té un temps de reutilització cada 24h.</p>
            
            <h2>Interaccions amb personatges</h2>
            <p><b>jr!like &lt;nomPersonatge&gt;</b> / <b>jr!l &lt;nomPersonatge&gt;</b>: Incrementa el preu del personatge indicat en 1 crystal.</p>
            <p><b>jr!info &lt;nomPersonatge&gt;</b>: Mostra la targeta del personatge amb la seva info.</p>
            <p><b>jr!vendre &lt;nomPersonatge&gt;</b> / <b>jr!v &lt;nomPersonatge&gt;</b>: Ven el personatge i suma el seu preu als teus crystals.</p>
            <p><b>jr!lvl &lt;nomPersonatge&gt;</b>: Puja un nivell del personatge a canvi de 1000 crystals.</p>
            <p><b>jr!llista</b>: Llista els personatges en propietat.</p>
            <p><b>jr!top</b>: Llista tots els personatges per ordre de preu descendent.</p>
            
            <h2>Interaccions amb altres usuaris</h2>
            <p>Els combats entre usuaris funcionen de forma que s'agafa el nivell dels 2 personatges, se li suma 1 nivell a tots dos durant el combat (per evitar 0 vs 0, on no podria guanyar ningú o 1 vs 0 on sempre guanyaria el mateix), es suma el nivell total entre els dos i s'agafa un número aleatori d'entre 0 i (suma total -1), si aquest número és menor que el nivell del personatge de l'usuari que ha iniciat el combat guanya, sinò guanya l'altre.<br><br>D'aquesta manera té més probabilitats de guanyar qui té més nivell però no és impossible guanyar si és un nivell 1 vs un nivell 100.</p>
            <p><b>jr!combat &lt;nomUsuariDesafiat&gt; &lt;nomElTeuPersonatge&gt;</b>: Proposes un combat a un usuari i si accepta combateixes amb el personatge seleccionat.</p>
            <p><b>jr!intercanvi &lt;nomUsuari&gt; &lt;nomPersonatgeQueIntercanvies&gt;</b>: Proposes un intercanvi a un usuari i si accepta podrà oferir un PJ a canvi, després podràs acceptar o rebutjar.</p>
            

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

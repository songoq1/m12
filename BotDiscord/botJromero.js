const Discord = require('discord.js'); // Importa llibreria Discord.js https://discord.js.org/#/.
const config = require("./config.json"); // Importa el .json que conté les variables que li especifiques.
const mysql = require("mysql"); // Importa llibreria mysql.
const funcions = require("./funcions.js"); // Importa el js amb funcions.
// const Topgg = require('@top-gg/sdk');

// Variables
const client = new Discord.Client();
const prefix = config.prefix;
const token = config.token;
const idAdmin = config.idAdmin;

const dbHost = config.dbHost;
const dbPassword = config.dbPassword;
const dbUser = config.dbUser;
const dbDatabase = config.dbDatabase;
// const topgg = new Topgg.Api("");

// Definint els paràmetres de connexió a la base de dades.
const db = new mysql.createConnection({
  host: dbHost, // localhost
  password: dbPassword, // jromero
  user: dbUser, // jromero
  database: dbDatabase // jromero_m12
})

// En cas d'un error al connectar amb la BBDD l'escriurà per terminal, si tot és correcte ho farà saber també per terminal.
db.connect(function(err){
  if(err) throw err;
  console.log("Connexió correcta.");
})

// Funció que s'executarà quan iniciem el bot.
client.on('ready', () => {
  funcions.presence(client); // Estat de discord custom.
  funcions.resetInvocacionsRestants(db); // Reseteja les invocacions_restants al iniciar el bot.
  funcions.infiniteLoop_UpdateInvocacionsRestants(db, config.time_between_reset_invocacions); // Control del reset de les invocacions_restants a la BBDD.
  funcions.resetDailyCommand(db); // Reseteja el dailyCommand al iniciar el bot.
  funcions.infiniteLoop_UpdateDailyCommand(db, config.time_between_dailyCommand); // Control del reset del dailyCommand a la BBDD.
  funcions.resetCdReclamar(db); // Reseteja el cdReclamar al iniciar el bot.
  funcions.infiniteLoop_UpdateCdReclamar(db, config.time_between_cdReclamar); // Control del reset del cdReclamar a la BBDD.
  console.log('El bot està funcionant correctament!'); // Fem un console.log per asegurar-nos que s'ha iniciat correctament.
});

// Quan s'enviï un missatge per un canal de discord entrarà aquí:
client.on('message', async(message) => {

  if(message.author.bot) return; // 'if' per evitar bucles (dos bots responent-se mutuament infinitament).
  if(!message.content.startsWith(prefix)) return; // Si el missatge no comença amb el prefix que li hem especificat al config.json no continuarà la resta de la funció.

  // Neteja el missatge que rep per a que funcioni hi hagi espais o majúscules.
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  funcions.comprovarUsuariExisteix(message, db) // Aquesta consulta a base de dades comprova si l'usuari intentant utilitzar el nostre bot existeix, en cas negatiu el guarda.

  // Comanda que et respon pong a ping, serveix per comprovar que el bot està actiu desde un canal.
  if (command === 'ping') {
    message.channel.send('pong');
  }

  // Selecciona aleatoriament un personatge de la llista total el qual es podrà reclamar o rebre el seu preu en la moneda del joc si ja té propietari.
  else if(command === 'invocar' || command === 'i'){

    db.query(`SELECT * FROM personatge`, async (err, req) => { if(err) throw err;

      let randomNumber = Math.floor(Math.random() * req.length);
      let personatge = req[randomNumber];
      funcions.invocaPersonatge(personatge, message, Discord, db);

    });
  }

  // El mateix que la comanda invocar però només amb personatges que entrin en la categoria home.
  else if(command === 'invocar home' || command === 'ih'){

    db.query(`SELECT * FROM personatge WHERE id_categoria = 1`, async (err, req) => { if(err) throw err;

      let randomNumber = Math.floor(Math.random() * req.length);
      let personatge = req[randomNumber];
      funcions.invocaPersonatge(personatge, message, Discord, db);

    });
  }
  
  // El mateix que la comanda invocar però només amb personatges que entrin en la categoria dona.
  else if(command === 'invocar dona' || command === 'id'){

    db.query(`SELECT * FROM personatge WHERE id_categoria = 2`, async (err, req) => { if(err) throw err;

      let randomNumber = Math.floor(Math.random() * req.length);
      let personatge = req[randomNumber];
      funcions.invocaPersonatge(personatge, message, Discord, db);

    });
  }

  // Cada cop que algú executa prefix+like el següent bloc de codi mirarà si el primer argument es un nom que existeix a la base de dades, si existeix sumarà +1 al preu.
  // També comprovara que l'usuari no li hagi donat anteriorment un like a un personatge.
  else if(command === 'like' || command === 'l'){
    funcions.likePersonatge(args, db, message);
  }

  // Retorna un missatge amb la info que ha de mostrar un personatge quan es vol veure la seva targeta.
  else if(command === 'info'){
    funcions.infoPersonatge(args, message, Discord, db);
  }

  // Et permet vendre un personatge que poseeixes.
  else if(command === 'vendre' || command === 'v'){
    funcions.vendrePersonatge(args, message, db);
  }

  // Llista els teus personatges.
  else if(command === 'llista'){
    funcions.llistarPersonatges(message, Discord, db);
  }

  // Llista tots els personatges ordenats pel preu en ordre descendent.
  else if(command === 'top'){
    funcions.llistarPersonatgesTotals(message, Discord, db);
  }

  // Executa una comanda diaria per rebre crystals.
  else if(command === 'daily'){
    funcions.dailyCommand(message, db);
  }

  // Mostra el perfil de l'usuari.
  else if(command === 'perfil'){
    funcions.perfil(message, Discord, db);
  }

  // Et permet pujar de nivell un personatge que poseeixes.
  else if(command === 'lvl'){
    funcions.lvlUpPersonatge(args, message, db);
  }

  // Et permet pujar de nivell.
  else if(command === 'lvlup'){
    funcions.lvlUpUsuari(message, db);
  }

  // Combat entre l'usuari qui envia el missatge i un altre usuari que ha mencionat, l'usuari mencionat pot acceptar o no el combat.
  // Qui guanya i qui perd està basat en percentatges, quan més nivell tingui el personatge seleccionat pel combat més probabilitat de guanyar.
  else if(command === 'combat'){
    funcions.combat(args, message, Discord, db);
  }

  // Un usuari pot proposar un intercanvi a un altre usuari i si accepta podrà oferir un PJ a canvi, després qui ha iniciat l'intercanvi podrà acceptar o rebutjar.

  else if(command === 'intercanvi'){
    funcions.intercanvi(args, message, Discord, db);
  }

  // Envia un embed amb les comandes que l'usuari pot fer servir i amb un link amb més informació.
  else if(command === 'help'){
    funcions.help(message, Discord, client);
  }

  // Respon amb un enllaç que porta al patreon on l'usuari rebrà més informació sobre les avantatges de ser premium.
  else if(command === 'premium'){
    funcions.premium(message);
  }

  // COMANDES ADMIN

  // Comanda només pel creador. Serveix per posar un canal per fer la funcionalitat d'activar el premium.
  else if(command === 'setuppremium' && message.author.id === idAdmin){
    funcions.setupPremium(message, Discord, client, db);
  }

  // Comanda per poder executar querys des del canal de Discord.
  else if(command === 'query' && message.author.id === idAdmin){
    funcions.query(args, message, db);
  }

  // PROVA VOTE - PENDENT APPROVAL
  // else if(command === 'votar'){
  //   let voted = await topgg.hasVoted(message.author.id);
  //   if(!voted){
  //     message.channel.send('No me has votado.');
  //   }else{
  //     message.channel.send('Ya me has votado!');
  //   }
  // }

  // Respondrà amb aquest text a qualsevol missatge que comenci amb el prefix del bot i no sigui una comanda
  else{
    console.log(message.author);
    message.channel.send('Comanda desconeguda! Revisa la sintaxi.');
  }
});

client.login(token);
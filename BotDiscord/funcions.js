const { UserFlags } = require("discord.js");
const pagination = require("discord.js-pagination");
const config = require("./config.json"); // Importa el .json que conté les variables que li especifiques.

// Variables.
const prefix = config.prefix;

// Estat de discord custom.
function presence(client){
  client.user.setPresence({
    status:"online", // dnd, idle, invisible, online
    activity: {
      name: prefix+"help",
      type: "LISTENING" // LISTENING, PLAYING, STREAMING, WATCHING
    }
  })
}

// Aquesta consulta a base de dades comprova si l'usuari intentant utilitzar el nostre bot existeix, en cas negatiu el guarda.
function comprovarUsuariExisteix(message, db){
  const usuari = message.author.username + '#' + message.author.discriminator;
  db.query(`SELECT id FROM users WHERE user_id = '${message.author.id}'`, async (err, req) => {
    if(err) throw err;

    if(req.length<=0){
      db.query(`INSERT INTO users (user_id, name) VALUES ('${message.author.id}', '${usuari}')`, function(err){
        if (err) {
          db.query(`INSERT INTO users (user_id, name) VALUES ('${message.author.id}', '${message.author.id}')`, function(err){
            if(err) throw err;
            // message.channel.send('<@'+message.author.id+'>, Tens un nom d\'usuari invàlid!\nLa Base de Dades no té suport per aquests caràcters, si vols utilitzar el bot has d\'anar a: \n\nConfiguració > El meu compte > Nom d\'usuari > Editar\n\n I canviar el nom per un vàlid.');
          })
        };
      })
    }
  });
}

// Fa el mateix que l'anterior però aquesta s'utilitza en altres funcions quan no hi ha un objecte 'message'.
function comprovarUsuariExisteixAux(user, db){
  const usuari = user.username + '#' + user.discriminator;
  db.query(`SELECT id FROM users WHERE user_id = '${user.id}'`, async (err, req) => {
    if(err) throw err;

    if(req.length<=0){
      db.query(`INSERT INTO users (user_id, name) VALUES ('${user.id}', '${usuari}')`, function(err){
        if (err) {
          db.query(`INSERT INTO users (user_id, name) VALUES ('${user.id}', '${user.id}')`, function(err){
            if(err) throw err;
            // message.channel.send('<@'+message.author.id+'>, Tens un nom d\'usuari invàlid!\nLa Base de Dades no té suport per aquests caràcters, si vols utilitzar el bot has d\'anar a: \n\nConfiguració > El meu compte > Nom d\'usuari > Editar\n\n I canviar el nom per un vàlid.');
          })
        };
      })
    }
  });
}

// Retorna un missatge amb la info que ha de mostrar un personatge quan és invocat.
async function invocaPersonatge(personatge, message, Discord, db){

  db.query(`SELECT invocacions_restants FROM users WHERE user_id = '${message.author.id}'`, async (err, req) => { if(err) throw err; // Comprova que a l'usuari li quedin suficients invocacions.
    if(req.length>0){
    if(req[0].invocacions_restants > 0){
      db.query(`UPDATE users SET invocacions_restants = invocacions_restants - 1 WHERE user_id = '${message.author.id}'`, async (err) => { if(err) throw err;

        let messageEmbed = new Discord.MessageEmbed() // Base per als embeds tractats a la resta de la funció.
        .setColor('#f5dd42')
        .setTitle(personatge.nom)
        .setDescription('Preu: '+personatge.preu+' <:crystal:838793555304513536>')
        .addField('Nivell: '+personatge.nivell, '\u200b')
        .setImage(personatge.imatge+'.png');
    
        db.query(`SELECT name FROM users WHERE user_id='${personatge.id_propietari}'`,  (err, req) => { if (err) throw err;
    
          if (personatge.id_propietari != null){ if(err) throw err; // Crea l'embed amb les funcionalitats que ha de tenir al targeta en cas de que tingui propietari.

            let messageEmbed2 = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle(personatge.nom)
            .setDescription('Preu: '+personatge.preu+' <:crystal:838793555304513536>')
            .addField('Nivell: '+personatge.nivell, '\u200b')
            .setImage(personatge.imatge+'.png')
            .setFooter('Propietari: '+req[0].name);
    
            message.channel.send(messageEmbed2).then(embedMessage => { //Envia el missatge i afegeix les reaccions que faran de botons per utilitzar les funcionalitats
              embedMessage.react('💲');
              const filter = (reaction, user) => {
                
                if(user.id != '837340929950089247'){ // 'id' del bot, s'ha de posar un 'if' excloet-ho per evitar problemes, ja que quan afegeix la reacció a l'embed aquest filter s'activa amb l'id del bot.
                  
                  comprovarUsuariExisteixAux(user, db); // Aquesta consulta a base de dades comprova si l'usuari intentant utilitzar les reaccions del nostre bot existeix, en cas negatiu el guarda.
    
                  db.query(`UPDATE users SET crystals = crystals + ${personatge.preu} WHERE user_id = '${user.id}'`, async (err) => { if(err) throw err; // Si algú ha reaccionat el bot farà aquesta comanda a la BBDD, en aquest cas suma els crystals guanyats.
                    message.channel.send('<@'+user.id+'>, +'+personatge.preu+' crystals!');
                  });
                }
                return ['💲'].includes(reaction.emoji.name) && user.id === message.author.id;
              }; 
              embedMessage.awaitReactions(filter, { max: 1, time: 10000 }); // Espera el temps especificat en 'time' i rep el número de reaccions que tingui 'max'.
            });
            
          }else{ // Crea l'embed amb les funcionalitats que ha de tenir la targeta en cas de que NO tingui propietari.
            message.channel.send(messageEmbed).then(async(embedMessage) => { //Envia el missatge i afegeix les reaccions que faran de botons per utilitzar les funcionalitats
              embedMessage.react('👍');
              const filter = async(reaction, user) => {
                
                if(user.id != '837340929950089247'){ // 'id' del bot, s'ha de posar un 'if' excloet-ho per evitar problemes, ja que quan afegeix la reacció a l'embed aquest filter s'activa amb l'id del bot.
                  
                  comprovarUsuariExisteixAux(user, db); // Aquesta consulta a base de dades comprova si l'usuari intentant utilitzar les reaccions del nostre bot existeix, en cas negatiu el guarda.
    
                  await db.query(`SELECT cdReclamar FROM users WHERE user_id = '${user.id}'`, async (err, req) => { if(err) throw err;
                    if(req[0].cdReclamar == 1){
                      await db.query(`UPDATE personatge SET id_propietari = '${user.id}' WHERE nom = '${personatge.nom}'`, async (err) => { if(err) throw err; // Si algú ha reaccionat el bot farà aquesta comanda a la BBDD, en aquest cas fa propietari a l'usuari del personatge.
                        await db.query(`UPDATE users SET cdReclamar = 0 WHERE user_id = '${user.id}'`, async (err) => { if(err) throw err; 
                          db.query(`SELECT * FROM personatge WHERE nom = '${personatge.nom}'`, async (err, req) => { if(err) throw err; 

                            let id_userWhoReacted = req[0].id_propietari;
                            
                            db.query(`SELECT cdReclamar FROM users WHERE user_id = '${id_userWhoReacted}'`, async (err, req) => { if(err) throw err;
                                                            
                              if(req.length>0){

                                let messageEmbed2 = new Discord.MessageEmbed() // Definint aspecte per l'embed d'un personatge amb propietari.
                                .setColor('#ff0000')
                                .setTitle(personatge.nom)
                                .setDescription('Preu: '+personatge.preu+' <:crystal:838793555304513536>')
                                .addField('Nivell: '+personatge.nivell, '\u200b')
                                .setImage(personatge.imatge+'.png');
            
                                message.channel.send('<@'+id_userWhoReacted+'>, Ara \"'+personatge.nom+'\" et pertany!'); // Notifica personatge obtingut.
                                embedMessage.edit( // Canvia l'aspecte de l'embed amb el nou aspecte definit anteriorment.
                                  messageEmbed2
                                )  
                              }
                            })
                          })
                        })
                      })
                    }else{
                      message.channel.send(user.username+'#'+user.discriminator+', ja has reclamat un personatge fa poc! Pots reclamar un personatge cada 3 hores.');
                      return false;
                    }
                  })
                  return ['👍'].includes(reaction.emoji.name) && user.id === message.author.id;
                }
              }; 
              embedMessage.awaitReactions(filter, { max: 1, time: 10000 }) // Espera el temps especificat en 'time' i rep el número de reaccions que tingui 'max'.
              //.then(collected => {}) // Si algú ha reaccionat el bot farà aquest bloc de codi.
            });
          }
        })
      })
    }else{ // Si l'usuari intenta invocar un personatge i no té invocaions restants se li notificarà.
      message.channel.send("Les teves invocacions s'han acabat! Tens 5 invocacions cada 1h.");
    }
  }
  })
}

// Cada cop que algú executa prefix+like el següent bloc de codi mirarà si el primer argument es un nom que existeix a la base de dades, si existeix sumarà +1 al preu.
// També comprovara que l'usuari no li hagi donat anteriorment un like a un personatge.
function likePersonatge(args, db, message){

  if(args.length > 0){

    let nom = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(); // Agafa el nom introduït per l'usuari i adapta la string per permetre majúscules o minúscules on sigui.

    db.query(`SELECT * FROM personatge WHERE nom = '${nom}'`, async (err, req) => { if(err) throw err;

      if(req<=0) {

        message.channel.send('No existeix cap personatge anomenat \"'+ args[0] +'\" !\nSintaxi:  '+prefix+'like <nomPersonatge>  or  '+prefix+'l <nomPersonatge>');
      }else{

        db.query(`SELECT * FROM userLiked WHERE user_id = '${message.author.id}' AND nom = '${nom}'`, async (err, req) => { if(err) throw err;

          if(req.length>0){
            message.channel.send('Ja li has donat like a \"'+args[0]+'\"!');
          }else{
            db.query(`UPDATE personatge SET preu = preu + 1 WHERE nom = '${nom}'`, async (err) => { if(err) throw err;
    
              db.query(`INSERT INTO userLiked (user_id, nom) VALUES ('${message.author.id}', '${nom}')`, async (err) => { if(err) throw err; });
    
              db.query(`SELECT * FROM personatge WHERE nom = '${nom}'`, async (err, req) => { if(err) throw err;
    
                message.channel.send('Has incrementat el preu de \"'+args[0]+'\"! Ara té un preu de '+req[0].preu+' crystals.');
              });
            });
          }
        });
      }
    });
  }else{
    message.channel.send('Per donar like a un personatge la sintaxi és:  '+prefix+'like <nomPersonatge>  or  '+prefix+'l <nomPersonatge>');
  }
}

// Retorna un missatge amb la info que ha de mostrar un personatge quan es vol veure la seva targeta.
function infoPersonatge(args, message, Discord, db){
  if(args.length>=1){
    let nom = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(); // Agafa el nom introduït per l'usuari i adapta la string per permetre majúscules o minúscules on sigui.

    db.query(`SELECT * FROM personatge WHERE nom = '${nom}'`, async (err, req) => {
      if(err) throw err;

      if(req.length>0){ // Si el personatge especificat no existeix saltarà 'else' notificant que no existeix cap personatge anomenat com s'ha especificat.

        let personatge = req[0];
        let messageEmbed = new Discord.MessageEmbed() // Defineix l'embed per mostrar un personatge.
        .setColor('#f5dd42')
        .setTitle(personatge.nom)
        .setDescription('Preu: '+personatge.preu+' <:crystal:838793555304513536>')
        .addField('Nivell: '+personatge.nivell, '\u200b')
        .setImage(personatge.imatge+'.png');

        db.query(`SELECT name FROM users WHERE user_id='${personatge.id_propietari}'`,  (err, req) => { if (err) throw err;

          if (personatge.id_propietari != null){ if(err) throw err; // Comprova si el personatge té propietari, en cas afirmatiu canvia l'aspecte d l'embed.

            let messageEmbed2 = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setTitle(personatge.nom)
            .setDescription('Preu: '+personatge.preu+' <:crystal:838793555304513536>')
            .addField('Nivell: '+personatge.nivell, '\u200b')
            .setImage(personatge.imatge+'.png')
            .setFooter('Propietari: '+req[0].name);

            message.channel.send(messageEmbed2);
            
          }else{
            message.channel.send(messageEmbed);
          }
        })
      }else{
        message.channel.send('No existeix cap personatge anomenat \"'+args[0]+'\"!');
      }
    });
  }else{ // Si s'utilitza la comanda per veure la info, però no s'especifica cap nom, respondrà amb una breu explicació de la sintaxi.
    message.channel.send('Si vols veure la info d\'algun personatge la sintaxi és:  '+prefix+'info <nomPersonatge>');
  }
}

// Et permet vendre un personatge que poseeixes.
function vendrePersonatge(args, message, db){
  if(args.length>=1){
    let nom = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(); // Agafa el nom introduït per l'usuari i adapta la string per permetre majúscules o minúscules on sigui.

    db.query(`SELECT * FROM personatge WHERE nom = '${nom}' AND id_propietari = '${message.author.id}'`, async (err, req) => { if(err) throw err;

      if(req.length>0){ // Si el personatge especificat no existeix o no el poseeixes saltarà 'else' notificant que no poseeixes cap personatge anomenat com s'ha especificat.

        let personatge = req[0];
        db.query(`UPDATE personatge SET id_propietari = NULL WHERE nom = '${personatge.nom}'`, async (err) => { if(err) throw err; // Declara a la BBDD que el personatge ja no té propietari.
          db.query(`UPDATE users SET crystals = crystals + ${personatge.preu} WHERE user_id = '${message.author.id}'`, async (err) => { if(err) throw err;  // Suma el preu del personatge al total de monedes de l'usuari.
            message.reply('Has venut \"'+personatge.nom+'\", +'+personatge.preu+' crystals!'); // Notifica a l'usuari que la venta ha sigut exitosa i quants crystals ha guanyat.
          });
        });
      }else{
        message.channel.send('No poseeixes cap personatge anomenat \"'+args[0]+'\"!');
      }
    });
  }else{ // Si s'utilitza la comanda per vendre, però no s'especifica cap nom, respondrà amb una breu explicació de la sintaxi.
    message.channel.send('Si vols vendre algun personatge que poseeixes la sintaxi és:  '+prefix+'vendre <nomPersonatge>');
  }
}

// Llista els teus personatges.
function llistarPersonatges(message, Discord, db){
  db.query(`SELECT * FROM personatge WHERE id_propietari = '${message.author.id}'`, async (err, req) => { if(err) throw err;

    let llistaPersonatges = []; // Conté fins un màxim de X noms de personatges, X és el valor de la següent variable: \'personatgesPerPagina\'.
    let personatgesPerPagina = 10;  // Personatges per pàgina.
    let arrayLlistaPersonatges = []; // Serà un array d'arrays, guardarà tants 'llistaPersonatges' amb els seus continguts, com pàgines necessiti l'embed de la llista.
    let pages = parseInt((req.length/10)+1); // Número de pàgines basat en la longitud del request.
    let cont = 0; // Contador auxiliar, veure comentaris sobre la segona condició en els següents bucles.

    while(arrayLlistaPersonatges.length<pages){ // Guarda en 'arrayLlistaPersonatges' tants 'llistaPersonatges' com pàgines facin falta.
      while(llistaPersonatges.length<personatgesPerPagina && cont!=req.length){ // Aquest bucle guarda els noms dels personatges en 'llistaPersonatges', tants cops com el valor de 'personatgesPerPagina' permeti.
        llistaPersonatges.push(req[cont].nom);                                  // La segona condició,  'cont!=req.length', és necessaria per a que quan arribi a l'última pàgina i el número total de personatges
        cont++;                                                                 // no doni per omplir-la del tot pari d'intentar ficar noms o donarà un error per intentar agafar la propietat 'nom' d'un objecte no definit.
      }
      arrayLlistaPersonatges.push(llistaPersonatges);
      llistaPersonatges = []; // Un cop guardat 'llistaPersonatges' es torna a buidar per omplir-lo amb els noms de la següent pàgina.
    }
    
    let embedArray = []; // Array que contindrà els embeds de cada pàgina.

    arrayLlistaPersonatges.forEach(element => { // Bucle per crear els embeds de cada pàgina.

      let messageEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setAuthor('Llista de '+message.author.username, message.author.displayAvatarURL())
      .setDescription(element.join("\n"))

      embedArray.push(messageEmbed);
    });

    const emoji = ["⏪", "⏩"]; // Reaccions afegides a l'embed message que faran la funció de botons per navegar entre les pàgines.

    const timeout = "120000"; // Temps en que la paginació estarà activa en l'embed enviat pel canal de Discord.

    pagination(message, embedArray, emoji, timeout); // Funció de la llibreria pagination que ens permetrà juntar tots els elements per fer l'embed funcional.

  });
}

// Llista tots els personatges ordenats pel preu en ordre descendent.
function llistarPersonatgesTotals(message, Discord, db){
  db.query(`SELECT * FROM personatge ORDER BY preu DESC`, async (err, req) => { if(err) throw err;

    let llistaPersonatges = []; // Conté fins un màxim de X noms de personatges, X és el valor de la següent variable: \'personatgesPerPagina\'.
    let personatgesPerPagina = 10; // Personatges per pàgina.
    let arrayLlistaPersonatges = []; // Serà un array d'arrays, guardarà tants 'llistaPersonatges' amb els seus continguts, com pàgines necessiti l'embed de la llista.
    let pages = parseInt((req.length/10)+1); // Número de pàgines basat en la longitud del request.
    let cont = 0; // Contador auxiliar, veure comentaris sobre la segona condició en els següents bucles.

    while(arrayLlistaPersonatges.length<pages){ // Guarda en 'arrayLlistaPersonatges' tants 'llistaPersonatges' com pàgines facin falta.
      while(llistaPersonatges.length<personatgesPerPagina && cont!=req.length){ // Aquest bucle guarda els noms dels personatges en 'llistaPersonatges', tants cops com el valor de 'personatgesPerPagina' permeti.
        llistaPersonatges.push(req[cont].nom);                                  // La segona condició,  'cont!=req.length', és necessaria per a que quan arribi a l'última pàgina i el número total de personatges
        cont++;                                                                 // no doni per omplir-la del tot pari d'intentar ficar noms o donarà un error per intentar agafar la propietat 'nom' d'un objecte no definit.
      }
      arrayLlistaPersonatges.push(llistaPersonatges);
      llistaPersonatges = []; // Un cop guardat 'llistaPersonatges' es torna a buidar per omplir-lo amb els noms de la següent pàgina.
    }
    
    let embedArray = []; // Array que contindrà els embeds de cada pàgina.

    arrayLlistaPersonatges.forEach(element => {

      let messageEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('TOP Personatges')
      .setDescription(element.join("\n"))

      embedArray.push(messageEmbed);
    });

    const emoji = ["⏪", "⏩"]; // Reaccions afegides a l'embed message que faran la funció de botons per navegar entre les pàgines.

    const timeout = "120000"; // Temps en que la paginació estarà activa en l'embed enviat pel canal de Discord.

    pagination(message, embedArray, emoji, timeout); // Funció de la llibreria pagination que ens permetrà juntar tots els elements per fer l'embed funcional.

  });
}

// Executa una comanda diaria per rebre crystals.
function dailyCommand(message, db) {

  db.query(`SELECT dailyCommand FROM users WHERE user_id = '${message.author.id}'`, async (err, req) => { if(err) throw err; 
    if(req[0].dailyCommand == 1){ // Comprova que tingui la comanda diaria disponible
      db.query(`UPDATE users SET crystals = crystals + 100 WHERE user_id = '${message.author.id}'`, async (err) => { if(err) throw err;
        db.query(`UPDATE users SET dailyCommand = 0 WHERE user_id = '${message.author.id}'`, async (err) => { if(err) throw err;
          message.reply('Has rebut els 100 crystals diaris!');
        })
      })
    }else{
      message.reply('Ja has utilitzat la comanda diària! Té un temps de reutilització de 24h.');
    }
  })
}

// Mostra el perfil de l'usuari.
function perfil(message, Discord, db) {

  db.query(`SELECT * FROM users WHERE user_id = '${message.author.id}'`, async (err, req) => { if(err) throw err; 
    let messageEmbed = new Discord.MessageEmbed()
      .setColor('#0941db')
      .setAuthor('Perfil de '+req[0].name, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addField('Nivell ', req[0].nivell, true)
      .addField('Crystals ', req[0].crystals+'<:crystal:838793555304513536>', true)
      .addField('Victories ', req[0].victories, true)

    message.channel.send(messageEmbed);
  })
}

// Et permet pujar de nivell un personatge que poseeixes.
function lvlUpPersonatge(args, message, db) {

  if(args.length>=1){
    let nom = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(); // Agafa el nom introduït per l'usuari i adapta la string per permetre majúscules o minúscules on sigui.

    db.query(`SELECT * FROM personatge WHERE nom = '${nom}' AND id_propietari = '${message.author.id}'`, async (err, req) => { if(err) throw err;

      if(req.length>0){ // Si el personatge especificat no existeix o no el poseeixes saltarà 'else' notificant que no poseeixes cap personatge anomenat com s'ha especificat.

        let personatge = req[0];
        db.query(`SELECT * FROM users WHERE user_id = '${message.author.id}'`, async (err, req) => { if(err) throw err;

          if(req[0].crystals>1000){ // Si no tens suficients crystals per pujar de nivell un personatge saltarà 'else' notificant-ho.

            db.query(`UPDATE personatge SET nivell = nivell + 1 WHERE nom = '${personatge.nom}'`, async (err) => { if(err) throw err; // Suma +1 al personatge en la BBDD.
              db.query(`UPDATE users SET crystals = crystals - 1000 WHERE user_id = '${message.author.id}'`, async (err) => { if(err) throw err;  // Resta el preu de pujar de nivell personatges al total de monedes de l'usuari.
                db.query(`SELECT * FROM personatge WHERE nom = '${nom}' AND id_propietari = '${message.author.id}'`, async (err, req) => { if(err) throw err;
                  message.reply('Has pujat de nivell a \"'+personatge.nom+'\", ara està a nivell '+req[0].nivell+'!'); // Notifica a l'usuari que el personatge ha pujat de nivell exitosament.
                });
              });
            });
          }else{
            message.channel.send('No tens suficients crystals!');
          }
        });
      }else{
        message.channel.send('No poseeixes cap personatge anomenat \"'+args[0]+'\"!');
      }
    });
  }else{ // Si s'utilitza la comanda per vendre, però no s'especifica cap nom, respondrà amb una breu explicació de la sintaxi.
    message.channel.send('Si vols pujar de nivell algun personatge que poseeixes la sintaxi és:  '+prefix+'lvlUp <nomPersonatge>');
  }
}

// Et permet pujar de nivell.
function lvlUpUsuari(message, db) { 

  db.query(`SELECT * FROM users WHERE user_id = '${message.author.id}'`, async (err, req) => { if(err) throw err;

    if((req[0].nivell < 10 && req[0].premium == 0) || (req[0].nivell < 15 && req[0].premium == 1)){

      let filter = m => m.author.id === message.author.id; // Assegura que qui està responent. 

      message.reply('Estas segur que vols pagar 5000 crystals per pujar el teu nivell? Respon amb si [si/s] o no [no/n]').then(() => {
        message.channel.awaitMessages(filter, { // Crida el filtre definit.
            max: 1,
            time: 30000,
            errors: ['time']
          })
          .then(message => {
            message = message.first()
            if (message.content.toLowerCase() == 'si' || message.content.toLowerCase() == 's') {

              db.query(`SELECT * FROM users WHERE user_id = '${message.author.id}'`, async (err, req) => { if(err) throw err;

                if(req[0].crystals>5000){ // Si no tens suficients crystals per pujar el teu nivell saltarà 'else' notificant-ho.
      
                  db.query(`UPDATE users SET nivell = nivell + 1 WHERE user_id = '${message.author.id}'`, async (err) => { if(err) throw err; // Suma +1 al teu nivell en la BBDD.
                    db.query(`UPDATE users SET crystals = crystals - 5000 WHERE user_id = '${message.author.id}'`, async (err) => { if(err) throw err;  // Resta el preu de pujar de nivell al total de monedes de l'usuari.
                      message.reply(' Has pujat un nivell! A partir del pròxim reset d\'invocacions tindràs una invocació més en cada reset!') // Notifica a l'usuari que ha pujat de nivell exitosament i del seu avantatge.
                    });
                  });
                }else{
                  message.reply('No tens suficients crystals!');
                }
              });
              
            } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') { // Resposta en cas de que no vulgui pujar de nivell.
              message.reply('Vale, pensa-ho millor!')

            } else { // Resposta en cas de que no respongui amb una opció correcta.
              message.reply('No has introduït una resposta correcte! Torna-ho a provar.')
            }
          })
          .catch(collected => { // Resposta en cas de que no respongui i s'acabi el temps.
              message.reply('S\'ha acabat el temps per respondre!');
          });
      })
    }else{
      message.reply('Ja estàs a nivell màxim! Si encara no ets premium considera ser-ho per tenir un màxim de 5 nivells més!\nhttps://www.patreon.com/jromerodeavilay?fan_landing=true');
    }
  });
}

// Combat entre l'usuari qui envia el missatge i un altre usuari que ha mencionat, l'usuari mencionat pot acceptar o no el combat.
// Qui guanya i qui perd està basat en percentatges, quan més nivell tingui el personatge seleccionat pel combat més probabilitat de guanyar.
function combat(args, message, Discord, db) {

  if(args.length>1 && args.length<3){

    let idUsuariRetador = message.author.id;
    let idUsuariDesafiat = args[0].slice(3).slice(0, -1);
    let personatgeRetador = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase();

    db.query(`SELECT * FROM users WHERE user_id = '${idUsuariDesafiat}'`, async (err, req) => { if(err) throw err;
    
      if(req.length>0){

        db.query(`SELECT * FROM personatge WHERE id_propietari = '${idUsuariRetador}' AND nom = '${personatgeRetador}'`, async (err, req) => { if(err) throw err;

          if(req.length>0){

            let nivellPersonatgeRetador = req[0].nivell;

            let filter = m => m.author.id === idUsuariDesafiat; // Assegura que qui està responent és l'usuari desafiat.

            message.channel.send(args[0]+' '+message.author.username+'#'+message.author.discriminator+' et desafia a un combat! Acceptes? Respon amb si [si/s] o no [no/n]').then(() => {
              message.channel.awaitMessages(filter, { // Crida el filtre definit.
                  max: 1,
                  time: 30000,
                  errors: ['time']
                })
                .then(message => {
                  message = message.first()
                  if (message.content.toLowerCase() == 'si' || message.content.toLowerCase() == 's') {

                    message.reply('Escriu el nom del personatge que vols utilitzar:');

                    db.query(`SELECT * FROM personatge WHERE id_propietari = '${idUsuariDesafiat}'`, async (err, req) => { if(err) throw err;

                      let llistaPersonatges = []; // Conté fins un màxim de X noms de personatges, X és el valor de la següent variable: \'personatgesPerPagina\'.
                      let personatgesPerPagina = 10;  // Personatges per pàgina.
                      let arrayLlistaPersonatges = []; // Serà un array d'arrays, guardarà tants 'llistaPersonatges' amb els seus continguts, com pàgines necessiti l'embed de la llista.
                      let pages = parseInt((req.length/10)+1); // Número de pàgines basat en la longitud del request.
                      let cont = 0; // Contador auxiliar, veure comentaris sobre la segona condició en els següents bucles.
                  
                      while(arrayLlistaPersonatges.length<pages){ // Guarda en 'arrayLlistaPersonatges' tants 'llistaPersonatges' com pàgines facin falta.
                        while(llistaPersonatges.length<personatgesPerPagina && cont!=req.length){ // Aquest bucle guarda els noms dels personatges en 'llistaPersonatges', tants cops com el valor de 'personatgesPerPagina' permeti.
                          llistaPersonatges.push(req[cont].nom);                                  // La segona condició,  'cont!=req.length', és necessaria per a que quan arribi a l'última pàgina i el número total de personatges
                          cont++;                                                                 // no doni per omplir-la del tot pari d'intentar ficar noms o donarà un error per intentar agafar la propietat 'nom' d'un objecte no definit.
                        }
                        arrayLlistaPersonatges.push(llistaPersonatges);
                        llistaPersonatges = []; // Un cop guardat 'llistaPersonatges' es torna a buidar per omplir-lo amb els noms de la següent pàgina.
                      }
                      
                      let embedArray = []; // Array que contindrà els embeds de cada pàgina.
                  
                      arrayLlistaPersonatges.forEach(element => { // Bucle per crear els embeds de cada pàgina.
                  
                        let messageEmbed = new Discord.MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor('Llista de '+message.author.username, message.author.displayAvatarURL())
                        .setDescription(element.join("\n"))
                  
                        embedArray.push(messageEmbed);
                      });
                  
                      const emoji = ["⏪", "⏩"]; // Reaccions afegides a l'embed message que faran la funció de botons per navegar entre les pàgines.
                  
                      const timeout = "30000"; // Temps en que la paginació estarà activa en l'embed enviat pel canal de Discord.
                  
                      pagination(message, embedArray, emoji, timeout); // Funció de la llibreria pagination que ens permetrà juntar tots els elements per fer l'embed funcional.
                  
                    });

                    message.channel.awaitMessages(filter, { // Crida el filtre definit.
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    })
                    .then(m => {
                      m = m.first();
                      let personatgeDesafiat = m.content.charAt(0).toUpperCase() + m.content.slice(1).toLowerCase();
                      db.query(`SELECT * FROM personatge WHERE id_propietari = '${idUsuariDesafiat}' AND nom = '${personatgeDesafiat}'`, async (err, req) => { if(err) throw err; 
                        if(req.length>0){

                          let nivellPersonatgeDesafiat = req[0].nivell;
                          nivellPersonatgeRetador++; // Se li suma 1 nivell a cadascú durant el combat per evitar que un combat entre nivells 0 es produeixi.
                          nivellPersonatgeDesafiat++;
                          let randomWinner = Math.floor(Math.random() * (nivellPersonatgeRetador+nivellPersonatgeDesafiat)); // Exemple: si el combat és entre un nivell 12 i un nivell 15, s'escull un número random
                                                                                                                             // del 0 al 26, i si el número escollit és més petit que el nivell del personatge retador
                          if(randomWinner<nivellPersonatgeRetador){                                                          // guanya l'usuari retador, sinò guanya el desafiat, per tant qui tingui més nivell té més possiblitats de guanyar.
                            db.query(`UPDATE users SET victories = victories + 1 WHERE user_id = '${idUsuariRetador}'`, async (err) => { if(err) throw err;
                              message.channel.send('Guanya <@!'+idUsuariRetador+'>');
                            });
                          }else{
                            db.query(`UPDATE users SET victories = victories + 1 WHERE user_id = '${idUsuariDesafiat}'`, async (err) => { if(err) throw err;
                              message.channel.send('Guanya <@!'+idUsuariDesafiat+'>');
                            });
                          }

                        }else{
                          message.reply('No poseeixes el personatge amb el que vols combatre... Torneu-ho a intentar.');
                        }
                      });
                    })
                    .catch(collected => { // Resposta en cas de que no respongui i s'acabi el temps.
                      message.reply('S\'ha acabat el temps per rebre una resposta!');
                    });
    
                  } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') { // Resposta en cas de que no vulgui pujar de nivell.
                    message.reply('Vale, pensa-ho millor!')

                  } else { // Resposta en cas de que no respongui amb una opció correcta.
                    message.reply('No s\'ha introduït una resposta correcte! Torneu-ho a provar.')
                  }
                })
                .catch(collected => { // Resposta en cas de que no respongui i s'acabi el temps.
                    message.reply('S\'ha acabat el temps per rebre una resposta!');
                });
            })

          }else{
            message.reply('No poseeixes el personatge amb el que vols combatre... Torna-ho a intentar.');
          }
        });
      }else{
        message.reply('*Aquesta funcionalitat està deshabilitada per a smartphones.\nL\'usuari que estas desafiant ni tan sols a utilitzat el bot un cop! Deixa que jugui una mica abans de combatre.');
      }
    });
  }else{ // Si s'utilitza la comanda per veure la info, però no s'especifica cap nom, respondrà amb una breu explicació de la sintaxi.
    message.channel.send('Si vols fer un combat la sintaxi és:  '+prefix+'combat <@usuariDesafiat> <elTeuPersonatgePerCombatre>');
  }
}

// Un usuari pot proposar un intercanvi a un altre usuari i si accepta podrà oferir un PJ a canvi, després qui ha iniciat l'intercanvi podrà acceptar o rebutjar.
// *Nota: en aquesta funció s'ha utilitzat la mateixa nomenclatura que a la funció de combat, en aquest cas, l'usuari retador és qui inicia l'oferta i l'usuari desafiat qui la rep.
function intercanvi(args, message, Discord, db) {

  if(args.length>1 && args.length<3){

    let idUsuariRetador = message.author.id;
    let idUsuariDesafiat = args[0].slice(3).slice(0, -1);
    let personatgeRetador = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase();

    db.query(`SELECT * FROM users WHERE user_id = '${idUsuariDesafiat}'`, async (err, req) => { if(err) throw err;
    
      if(req.length>0){

        db.query(`SELECT * FROM personatge WHERE id_propietari = '${idUsuariRetador}' AND nom = '${personatgeRetador}'`, async (err, req) => { if(err) throw err;

          if(req.length>0){

            let nivellPersonatgeRetador = req[0].nivell;

            let filter = m => m.author.id === idUsuariDesafiat; // Assegura que qui està responent és l'usuari desafiat.

            message.channel.send(args[0]+' '+message.author.username+'#'+message.author.discriminator+' t\'ofereix \"'+personatgeRetador+'\"! Acceptes? Respon amb si [si/s] o no [no/n]').then(() => {
              message.channel.awaitMessages(filter, { // Crida el filtre definit.
                  max: 1,
                  time: 30000,
                  errors: ['time']
                })
                .then(message => {
                  message = message.first()
                  if (message.content.toLowerCase() == 'si' || message.content.toLowerCase() == 's') {

                    message.reply('Escriu el nom del personatge que li vols donar a canvi:');

                    db.query(`SELECT * FROM personatge WHERE id_propietari = '${idUsuariDesafiat}'`, async (err, req) => { if(err) throw err;

                      let llistaPersonatges = []; // Conté fins un màxim de X noms de personatges, X és el valor de la següent variable: \'personatgesPerPagina\'.
                      let personatgesPerPagina = 10;  // Personatges per pàgina.
                      let arrayLlistaPersonatges = []; // Serà un array d'arrays, guardarà tants 'llistaPersonatges' amb els seus continguts, com pàgines necessiti l'embed de la llista.
                      let pages = parseInt((req.length/10)+1); // Número de pàgines basat en la longitud del request.
                      let cont = 0; // Contador auxiliar, veure comentaris sobre la segona condició en els següents bucles.
                  
                      while(arrayLlistaPersonatges.length<pages){ // Guarda en 'arrayLlistaPersonatges' tants 'llistaPersonatges' com pàgines facin falta.
                        while(llistaPersonatges.length<personatgesPerPagina && cont!=req.length){ // Aquest bucle guarda els noms dels personatges en 'llistaPersonatges', tants cops com el valor de 'personatgesPerPagina' permeti.
                          llistaPersonatges.push(req[cont].nom);                                  // La segona condició,  'cont!=req.length', és necessaria per a que quan arribi a l'última pàgina i el número total de personatges
                          cont++;                                                                 // no doni per omplir-la del tot pari d'intentar ficar noms o donarà un error per intentar agafar la propietat 'nom' d'un objecte no definit.
                        }
                        arrayLlistaPersonatges.push(llistaPersonatges);
                        llistaPersonatges = []; // Un cop guardat 'llistaPersonatges' es torna a buidar per omplir-lo amb els noms de la següent pàgina.
                      }
                      
                      let embedArray = []; // Array que contindrà els embeds de cada pàgina.
                  
                      arrayLlistaPersonatges.forEach(element => { // Bucle per crear els embeds de cada pàgina.
                  
                        let messageEmbed = new Discord.MessageEmbed()
                        .setColor('#ff0000')
                        .setAuthor('Llista de '+message.author.username, message.author.displayAvatarURL())
                        .setDescription(element.join("\n"))
                  
                        embedArray.push(messageEmbed);
                      });
                  
                      const emoji = ["⏪", "⏩"]; // Reaccions afegides a l'embed message que faran la funció de botons per navegar entre les pàgines.
                  
                      const timeout = "30000"; // Temps en que la paginació estarà activa en l'embed enviat pel canal de Discord.
                  
                      pagination(message, embedArray, emoji, timeout); // Funció de la llibreria pagination que ens permetrà juntar tots els elements per fer l'embed funcional.
                  
                    });

                    message.channel.awaitMessages(filter, { // Crida el filtre definit.
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    })
                    .then(m => {
                      m = m.first();
                      let personatgeDesafiat = m.content.charAt(0).toUpperCase() + m.content.slice(1).toLowerCase();
                      db.query(`SELECT * FROM personatge WHERE id_propietari = '${idUsuariDesafiat}' AND nom = '${personatgeDesafiat}'`, async (err, req) => { if(err) throw err; 
                        
                        let filter2 = m => m.author.id === idUsuariRetador;

                        message.channel.send('<@!'+idUsuariRetador+'>, Vols intercanviar \"'+personatgeRetador+'\" per \"'+personatgeDesafiat+'\"? Respon amb si [si/s] o no [no/n]').then(() => {

                          message.channel.awaitMessages(filter2, { // Crida el filtre definit.
                            max: 1,
                            time: 30000,
                            errors: ['time']
                          })
                          .then(m => {
                            m = m.first();
                            if (m.content.toLowerCase() == 'si' || m.content.toLowerCase() == 's') {

                              db.query(`UPDATE personatge SET id_propietari = '${idUsuariDesafiat}' WHERE nom = '${personatgeRetador}'`, async (err) => { if(err) throw err; 
                                db.query(`UPDATE personatge SET id_propietari = '${idUsuariRetador}' WHERE nom = '${personatgeDesafiat}'`, async (err) => { if(err) throw err; 
                                  message.channel.send('L\'intercanvi ha sigut un èxit!');
                                })
                              })

                            } else if (m.content.toLowerCase() == 'no' || m.content.toLowerCase() == 'n') {
                              m.channel.send('No hi ha hagut acord! L\'intercanvi s\'ha cancelat.')
                            } else {
                              m.reply('No s\'ha introduït una resposta correcte! Torneu-ho a provar.')
                            }
                          })
                          .catch(collected => { // Resposta en cas de que no respongui i s'acabi el temps.
                            message.reply('S\'ha acabat el temps per rebre una resposta!');
                          });
                        });
                      });
                    })
                    .catch(collected => { // Resposta en cas de que no respongui i s'acabi el temps.
                      message.reply('S\'ha acabat el temps per rebre una resposta!');
                    });
    
                  } else if (message.content.toLowerCase() == 'no' || message.content.toLowerCase() == 'n') { // Resposta en cas de que no vulgui pujar de nivell.
                    message.reply('Vale, pensa-ho millor!')

                  } else { // Resposta en cas de que no respongui amb una opció correcta.
                    message.reply('No s\'ha introduït una resposta correcte! Torneu-ho a provar.')
                  }
                })
                .catch(collected => { // Resposta en cas de que no respongui i s'acabi el temps.
                    message.reply('S\'ha acabat el temps per rebre una resposta!');
                });
            })

          }else{
            message.reply('No poseeixes el personatge que vols intercanviar... Torna-ho a intentar.');
          }
        });
      }else{
        message.reply('*Aquesta funcionalitat està deshabilitada per a smartphones.\nL\'usuari que estas desafiant ni tan sols a utilitzat el bot un cop! Deixa que jugui una mica abans de combatre.');
      }
    });
  }else{ // Si s'utilitza la comanda per veure la info, però no s'especifica cap nom, respondrà amb una breu explicació de la sintaxi.
    message.channel.send('Si vols fer un intercanvi la sintaxi és:  '+prefix+'combat <@usuariAmbElQueEsVolIntercanviar> <elTeuPersonatgePerIntercanviar>');
  }
}

// Envia un embed amb les comandes que l'usuari pot fer servir i amb un link amb més informació.
function help(message, Discord, client) { 

  let messageEmbed = new Discord.MessageEmbed()
  .setColor('#00ffdd')
  .setAuthor(client.user.username, client.user.displayAvatarURL())
  .setTitle('Llista de comandes')
  .setDescription('<:crystal:838793555304513536>**'+prefix+'invocar** / **'+prefix+'i**: Invoca un PJ aleatori.\n<:crystal:838793555304513536>**'+prefix+'invocar home** / **'+prefix+'ih**: Invoca un PJ aleatori home.\n<:crystal:838793555304513536>**'+prefix+'invocar dona** / **'+prefix+'id**: Invoca un PJ aleatori dona.\n<:crystal:838793555304513536>**'+prefix+'like <nomPersonatge>** / **'+prefix+'l <nomPersonatge>**: Incrementa el preu del personatge indicat en 1 crystal.\n<:crystal:838793555304513536>**'+prefix+'info <nomPersonatge>**: Mostra la targeta del personatge amb la seva info.\n<:crystal:838793555304513536>**'+prefix+'vendre <nomPersonatge>** / **'+prefix+'v <nomPersonatge>**: Ven el personatge i suma el seu preu als teus crystals.\n<:crystal:838793555304513536>**'+prefix+'llista**: Llista els personatges en propietat.\n<:crystal:838793555304513536>**'+prefix+'top**: Llista tots els personatges per ordre de preu descendent.\n<:crystal:838793555304513536>**'+prefix+'daily**: Obtens 100 crystals, té un temps de reutilització cada 24h.\n<:crystal:838793555304513536>**'+prefix+'perfil**: Mostra una targeta amb la teva info.\n<:crystal:838793555304513536>**'+prefix+'lvl <nomPersonatge>**: Puja un nivell del personatge a canvi de 1000 crystals.\n<:crystal:838793555304513536>**'+prefix+'lvlup**: Puja el teu nivell per 5000 crystals.\n<:crystal:838793555304513536>**'+prefix+'combat <nomUsuariDesafiat> <nomElTeuPersonatge>**: Proposes un combat a un usuari i si accepta combateixes amb el personatge seleccionat.\n<:crystal:838793555304513536>**'+prefix+'intercanvi <nomUsuari> <nomPersonatgeQueIntercanvies>**: Proposes un intercanvi a un usuari i si accepta podrà oferir un PJ a canvi, després podràs acceptar o rebutjar.\n<:crystal:838793555304513536>**'+prefix+'premium**: Mostra un link sobre com fer-se premium i quines avantatges té.\n\n*Nota: pujar de nivell un personatge et fa tenir més possibilitats de guanyar un combat amb ell i pujar el teu nivell incrementa en 1 les tirades que tens per hora.\n\nInformació més detallada a:\nhttp://dawjavi.insjoaquimmir.cat/jromero/M12_jromero/public/comandes');

  message.channel.send(messageEmbed);

  if(message.author.id == config.idAdmin){
    let messageEmbed2 = new Discord.MessageEmbed()
    .setColor('#00ffdd')
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setTitle('Comandes només d\'Admin')
    .setDescription('<:crystal:838793555304513536>**'+prefix+'setuppremium**: Aquesta comanda posa una caixa de text amb una reacció per activar premium. Utilitzar NOMÉS en un canal que els usuaris normals no puguin veure si no tenen el rol de Premium.\n<:crystal:838793555304513536>**'+prefix+'query <querySencera>**: Pots introduir una comanda SQL completa.');

    message.channel.send(messageEmbed2);
  }
}

// Respon amb un enllaç que porta al patreon on l'usuari rebrà més informació sobre les avantatges de ser premium.
function premium(message) { 
  message.channel.send('Per adquirir el premium amb les avantatges que això comporta, segueix el següent link:\n https://www.patreon.com/jromerodeavilay?fan_landing=true ');
}

// Reseteja el dailyCommand.
function resetDailyCommand(db) { 
  db.query(`UPDATE users SET dailyCommand = 1`, async (err) => {
    if(err) throw err;
  })
}

// Control del reset del dailyCommand a la BBDD.
function infiniteLoop_UpdateDailyCommand(db, time) {
  setTimeout(function() {   // Crida un setTimeout dels segons especificats a la variable time que es pot canviar a config.json, en el camp "time_between_dailyCommand".
    db.query(`UPDATE users SET dailyCommand = 1`, async (err) => {
      if(err) throw err;
    })
    infiniteLoop_UpdateInvocacionsRestants(db, time); // Activa un altre seTimeout cridant-se a sí mateix.
  }, time)
}

// Reseteja el cdReclamar.
function resetCdReclamar(db) {
  db.query(`UPDATE users SET cdReclamar = 1`, async (err) => {
    if(err) throw err;
  })
}

// Control del reset del cdReclamar a la BBDD.
function infiniteLoop_UpdateCdReclamar(db, time) {
  setTimeout(function() {   // Crida un setTimeout dels segons especificats a la variable time que es pot canviar a config.json, en el camp "time_between_cdReclamar".
    db.query(`UPDATE users SET cdReclamar = 1`, async (err) => {
      if(err) throw err;
    })
    infiniteLoop_UpdateInvocacionsRestants(db, time); // Activa un altre seTimeout cridant-se a sí mateix.
  }, time)
}

// Reseteja les invocacions_restants.
function resetInvocacionsRestants(db) { 
  db.query(`UPDATE users SET invocacions_restants = 5 + nivell WHERE premium = 0`, async (err) => {
    if(err) throw err;
  })
  db.query(`UPDATE users SET invocacions_restants = 10 + nivell WHERE premium = 1`, async (err) => {
    if(err) throw err;
  })
}

// Control del reset de les invocacions_restants a la BBDD.
function infiniteLoop_UpdateInvocacionsRestants(db, time) {
  setTimeout(function() {   // Crida un setTimeout dels segons especificats a la variable time que es pot canviar a config.json, en el camp "time_between_reset_invocacions".
    db.query(`UPDATE users SET invocacions_restants = 5 + nivell WHERE premium = 0`, async (err) => {
      if(err) throw err;
    })
    db.query(`UPDATE users SET invocacions_restants = 10 + nivell WHERE premium = 1`, async (err) => {
      if(err) throw err;
    })
    infiniteLoop_UpdateInvocacionsRestants(db, time); // Activa un altre seTimeout cridant-se a sí mateix.
  }, time)
}

// COMANDES ADMIN

// Comanda només pel creador. Serveix per posar un canal per fer la funcionalitat d'activar el premium.
function setupPremium(message, Discord, client, db) {
  let messageEmbed = new Discord.MessageEmbed() // Definint aspecte per l'embed.
  .setColor('#b52abd')
  .setTitle('Activar premium')
  .setDescription('Per activar els teus privilegis com a premium reacciona a aquest missatge amb ✅\nObtindràs els privilegis respecte a les invocacions al següent reset.')
  .setAuthor(client.user.username, client.user.displayAvatarURL());

  message.channel.send(messageEmbed).then(async(embedMessage) => { //Envia el missatge i afegeix les reaccions que faran de botons per utilitzar les funcionalitats
    embedMessage.react('✅');
    const filter = async(reaction, user) => {
      
      if(user.id != '837340929950089247'){ // 'id' del bot, s'ha de posar un 'if' excloet-ho per evitar problemes, ja que quan afegeix la reacció a l'embed aquest filter s'activa amb l'id del bot.
        
        comprovarUsuariExisteixAux(user, db); // Aquesta consulta a base de dades comprova si l'usuari intentant utilitzar les reaccions del nostre bot existeix, en cas negatiu el guarda.

        db.query(`SELECT * FROM users WHERE user_id = '${user.id}'`, async (err, req) => { if(err) throw err;
          if(req[0].premium == 0){
            db.query(`UPDATE users SET premium = 1 WHERE user_id = '${user.id}'`, async (err) => { // Activa el premium a l'usuari.
              if(err) throw err;
            });
          }else{
            return false;
          }
        })
        return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
      }
    }; 
    embedMessage.awaitReactions(filter, { max: 1000000, time: 31556926  }) // Espera el temps especificat en 'time' i rep el número de reaccions que tingui 'max'.
  });
}

// Comanda per poder executar querys des del canal de Discord.
function query(args, message, db){
  if(args.length>0){
    let query = "";
    args.forEach(element => {
      query = query+' '+element
    });
    db.query(`${query}`, async (err, req) => { 
      if(err){
        message.reply('Query invàlida!')
      }else{
        if(req){
          message.reply('Resposta en el console log!');
          console.log(req);
        }
      }
    })
  }else{
    message.channel.send('Sintaxi:  '+prefix+'query <query>');
  }
}

// Export de les funcions i variables en aquest fitxer que es podran utilitzar quan es faci un 'require' en un altre fitxer.
module.exports = {
  presence,
  comprovarUsuariExisteix,
  invocaPersonatge,
  likePersonatge,
  infoPersonatge,
  vendrePersonatge,
  llistarPersonatges,
  llistarPersonatgesTotals,
  dailyCommand,
  perfil,
  lvlUpPersonatge,
  lvlUpUsuari,
  combat,
  intercanvi,
  help,
  premium,
  resetDailyCommand,
  infiniteLoop_UpdateDailyCommand,
  resetCdReclamar,
  infiniteLoop_UpdateCdReclamar,
  resetInvocacionsRestants,
  infiniteLoop_UpdateInvocacionsRestants,
  setupPremium,
  query
}
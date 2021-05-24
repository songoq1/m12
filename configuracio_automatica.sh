mysql -u $1 -p $3 < jromero_m12.sql
python3 prova.py $1 $2 $3 $4 $5
node BotDiscord/botJromero.js
import json
import sys

x =  '{ "prefix":"jr!", "token":"", "idAdmin":"", "dbHost":"localhost", "dbUser":"", "dbPassword":"", "dbDatabase":"", "time_between_reset_invocacions": 3600000, "time_between_dailyCommand": 86400000, "time_between_cdReclamar": 10800000 }'
y = json.loads(x)

if len(sys.argv) == 6:
  y["token"] = sys.argv[4]
  y["idAdmin"] = sys.argv[5]
  y["dbUser"] = sys.argv[1]
  y["dbPassword"] = sys.argv[2]
  y["dbDatabase"] = sys.argv[3]
else:
  print("Has introduit malament les variables necessaries la sintaxi es:\nsh configuracio_automatica.sh <usuariBBDD> <contrasenyaBBDD> <nomBaseDadesBuida> <tokenBotDiscord> <idUserAdminDiscord>")


with open('BotDiscord/config.json', 'w') as json_file:

  json.dump(y, json_file)
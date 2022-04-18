import app from './app';
import Config from './app/config';
//Setando a porta de acordo com o arquivo de configuração
app.listen(Config.port);
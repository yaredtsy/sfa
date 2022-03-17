import  seed  from '../seed';
import app from './app';
import connection from './connection';

// connection.create().then(async con => {
//     // await con.runMigrations();
//     // await seed(con);
// }).catch(err => console.log(err))

app.listen(9000,()=> console.log("app started at 9000"));

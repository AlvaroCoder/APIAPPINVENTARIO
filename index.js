const express = require('express');
const app = express();
const logger = require('morgan');
const MysqlRepository = require('./src/Connection');
const repository = new MysqlRepository();

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { SuccesResponse, ErrorResponse } = require('./src/HTTP/handlerResponses');
const PORT = process.env.PORT || 8086
app.use(express.json());
app.use(logger('dev'));

app.get("/",(req,res)=>{
    console.log("Hello");
    res.send("Hello world");
});
app.get("/user",async(req,res)=>{
    const admins = await repository.getAdmin();
    res.send(admins);
})
app.post("/signup",async(req,res)=>{
    const body = req.body;
    const idUsuario = uuid.v4();

    const {usuario, contrasenna} = body;
    const saltRounds = 10;
    const salt = await  bcrypt.genSalt(saltRounds);
    const encrypt =await bcrypt.hash(contrasenna, salt);

    const user = {idUsuario, usuario, contrasenna : encrypt};
    const response = await repository.createUser(user);
    res.send(response);
});

app.post("/signin",async(req,res)=>{
    const body = req.body;
    const {usuario, contrasenna} = body;
    const responseDB = await repository.getPassword(usuario);
    if (responseDB.error) return res.send(responseDB);
    const passwordDB= responseDB.message.contrasenna;
    const compare = await bcrypt.compare(contrasenna, passwordDB);
    const idUsuario = await repository.getIdUsuario(usuario);
    const response = compare ? new SuccesResponse(idUsuario).getSuccess() : new ErrorResponse("Contraseña incorrecta").getError();

    res.send(response);

});

app.post("/local",async(req,res)=>{
    const bodyLocal = req.body;
    const response = await repository.createLocal(bodyLocal);
    res.send(response);
});

app.get("/local/:idUsuario",async(req,res)=>{
    const idUsuario = req.params.idUsuario;
    const response = await repository.getLocales(idUsuario);
    res.send(response);
});

app.listen(PORT,()=>{
    console.log('Server Running');
});
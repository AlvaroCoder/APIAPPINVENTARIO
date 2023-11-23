require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('morgan');
const MysqlRepository = require('./src/Connection');
const repository = new MysqlRepository();

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const { SuccesResponse, ErrorResponse } = require('./src/HTTP/handlerResponses');

// Puerto
const PORT = process.env.PORT || 3000;

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

app.post("/insumos",async (req,res)=>{
    const body = req.body;
    console.log(body);
    const response = await repository.createInsumos(body);
    res.send(response);
});

app.get("/insumos/:idLocal",async(req,res)=>{
    const idLocal = req.params.idLocal;
    const response = await repository.getInsumos(idLocal);
    res.send(response);
});

app.put("/insumos",async(req,res)=>{
    const body = req.body;
    console.log("data = ",body);
    const {insumo, idLocal, cantidad, tipoMovimiento, fecha} = body;
    // Validamos si existe el producto
    const existeItem = await repository.existeInsumo(insumo, idLocal);
    if (existeItem.error) return res.send(new ErrorResponse("Algo salió mal :(").getError());
    if (existeItem.message <=0) return res.send(new ErrorResponse("No existe el producto").getError());

    // Actualiza la tabla insumos
    const idInsumo = await repository.getIdInsumoByName(insumo, idLocal);
    const stockInsumo = await repository.getStockByIdInsumo(idInsumo.message);
    const newStock = tipoMovimiento == "Ingreso" ? stockInsumo.message+cantidad : stockInsumo.message-cantidad;
    
    await repository.updateInsumo(newStock, idInsumo.message);

    // Guarda el movimiento en la tabla "movimiento"
    const jsonMovimiento = {idLocal, idInsumo : idInsumo.message, tipoMovimiento, cantidad, fecha};
    const response = await repository.createMovement(jsonMovimiento);

    res.send(response);
});

app.get("/movimiento/:idLocal",async(req,res)=>{
    const idLocal = req.params.idLocal;
    const response = await repository.getMovementsByLocal(idLocal);
    const newReponse = response.message.map((val)=>{
        const datetime = new Date(val.fecha);
        const strTime = `${datetime.getUTCFullYear()}-${datetime.getMonth()}-${datetime.getDay()}`
        return {
            fecha : strTime,
            nombre : val.nombre,
            cantidad : val.cantidad,
            idMovimiento : val.idMovimiento,
            tipo : val.tipo
        }
    })
    res.send(new SuccesResponse(newReponse).getSuccess());
});

app.listen(PORT,()=>{
    console.log('Server Running');
});
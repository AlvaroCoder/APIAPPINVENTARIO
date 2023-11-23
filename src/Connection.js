const { SuccesResponse, ErrorResponse } = require('./HTTP/handlerResponses');
const conexion = require('./MysqlConnection')
class MysqlRepository {
    async getAdmin(){
        try {
            const response = await conexion.query('SELECT * FROM usuario;').then((res)=>res[0]);
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async createUser({idUsuario, usuario, contrasenna}){
        try {
            const response = await conexion.execute("INSERT INTO usuario (idUsuario, nombreUsuario, contrasenna) VALUES (?,?,?)", [idUsuario, usuario, contrasenna]).then((res)=>res[0].insertId);
            return new SuccesResponse(response).getSuccess();

        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async getPassword(usuario){
        try {
            const response = await conexion.query("SELECT contrasenna FROM usuario WHERE nombreUsuario = ?",[usuario]).then((res)=>res[0][0]) || null;
            return response ?  new SuccesResponse(response).getSuccess() : new ErrorResponse("No existe el usuario").getError();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async getIdUsuario(usuario){
        try {
            const response = await conexion.query("SELECT idUsuario FROM usuario WHERE nombreUsuario = ?",[usuario]).then((res)=>res[0][0].idUsuario);
            return response;
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async createLocal({idUsuario, nombreLocal, direccion, distrito, ciudad}){
        try {
            const response = await conexion.query("INSERT INTO locales (idUsuario, nombreLocal, direccion, distrito, ciudad) VALUES (?,?,?,?,?)",[idUsuario, nombreLocal, direccion, distrito, ciudad]).then((res)=>res[0].insertId);
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async getLocales(idUsuario){
        try {
            const response = await conexion.query("SELECT * FROM locales WHERE idUsuario = ?",[idUsuario]).then((res)=>res[0]) || [];
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async getInsumos(idLocal){
        try {
            const response = await conexion.query("SELECT * FROM insumos WHERE idLocal = ?",[idLocal]).then((res)=>res[0]) || [];
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async getIdInsumoByName(nombreInsumo, idLocal){
        try {
            const response = await conexion.query("SELECT Idinsumo FROM insumos WHERE idLocal = ? AND nombre = ?",[idLocal, nombreInsumo]).then((res)=>res[0][0].Idinsumo);
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async getMovementsByLocal(idLocal){
        try {
            const response = await conexion.query("SELECT movimiento.fecha, insumos.nombre, movimiento.cantidad, movimiento.idMovimiento, movimiento.tipo FROM insumos, movimiento WHERE movimiento.idInsumo = insumos.Idinsumo AND movimiento.idLocal = ?", [idLocal]).then((res)=>res[0]);
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async existeInsumo(nombreInsumo, idLocal){
        try {
            const response = await conexion.query("SELECT COUNT(*) AS existeInsumo FROM insumos WHERE nombre = ? AND idLocal = ?",[nombreInsumo, idLocal]).then((res)=>res[0][0].existeInsumo);
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async createInsumos({idLocal, Nombre, Medida, Stock, StockMin}){
        try {
            const response = await conexion.execute("INSERT INTO insumos (idLocal, nombre, medida, Stock, Stockmin) VALUES (?,?,?,?,?)",[idLocal, Nombre, Medida, Stock, StockMin]).then((res)=>res[0].insertId);
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async updateInsumo(newStock, idInsumo){
        try {
            const response = await conexion.execute("UPDATE insumos SET Stock=? WHERE idInsumo = ?",[newStock, idInsumo]).then((res)=>res[0].affectedRows);
            return new SuccesResponse(`Actualido correctamente ${response}`).getSuccess();

        } catch (err) {
            return new ErrorResponse(err);
        }
    }
    async getStockByIdInsumo(idInsumo){
        try {
            const response = await conexion.query("SELECT Stock FROM insumos WHERE Idinsumo = ?",[idInsumo]).then((res)=>res[0][0].Stock);
            return new SuccesResponse(response).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
    async createMovement({idLocal, idInsumo, tipoMovimiento, cantidad, fecha}){
        try {
            const response = await conexion.execute("INSERT INTO movimiento (idLocal , idInsumo , tipo , cantidad , fecha ) VALUES (?,?,?,?,?)",[idLocal, idInsumo, tipoMovimiento, cantidad, fecha]).then((res)=>res[0].insertId);
            return new SuccesResponse(`Guardado correctamente idInsert : ${response}`).getSuccess();
        } catch (err) {
            return new ErrorResponse(err).getError();
        }
    }
}
module.exports = MysqlRepository;

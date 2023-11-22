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
}
module.exports = MysqlRepository;

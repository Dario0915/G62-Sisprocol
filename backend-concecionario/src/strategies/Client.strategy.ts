import {AuthenticationStrategy} from "@loopback/authentication";
import {service } from "@loopback/core";
import { HttpErrors, RedirectRoute, Request } from "@loopback/rest";
import {UserProfile} from "@loopback/security";
import parseBearerToken from "parse-bearer-token";
import { AutenticacionService } from "../services";

export class EstrategiaCliente implements AuthenticationStrategy{
    name: string = "client";
    constructor(
        @service(AutenticacionService)
        public servicioAutenticacion: AutenticacionService
    ){}
    async authenticate(request: Request): Promise<UserProfile | undefined> {
        let token = parseBearerToken(request);
        if(token){
            let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
            if(datos){

                if(datos.data.rol=="Cliente"){
                let perfil: UserProfile=Object.assign(
                    {
                        nombre: datos.data.nombres,
                        rol: datos.data.rol
                    }
                )
                return perfil;
                } else{
                    throw new HttpErrors[401]("Usuario no válido")
                }
            }else{
                throw new HttpErrors[401]("Token no válido")
            }
        }else{
            throw new HttpErrors[401]("No se envio un token en la solicitud")
        }
    }
    async authenticacion (){
        
    }
}

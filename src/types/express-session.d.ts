import "express-session";

declare module "express-session" {
    export interface SessionData {
        auth?: {
            token?: string;
            id?: number;
            nombre?: string;
            apellido?: string;
            Rol_id?: 1 | 2 | 3;
        };
    }
}
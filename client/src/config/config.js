import {config} from "dotenv"

const environment = "development";

config({path: `./.env.${environment}.local`});

const conf = {
    serverUrl : String(import.meta.env.VITE_SERVER_URL),
}

export default conf;
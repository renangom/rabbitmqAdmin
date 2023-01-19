import express from 'express';
import cors from 'cors';
import {DataSource} from 'typeorm'



export const appDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "143300j=",
    database: "yt_node_admin",
    entities: ["./src/entity/*.ts"],
    migrations: [
      "./src/migrations/*.ts"
    ],
    logging: true,
    synchronize: true
});
appDataSource.initialize().then(
    db => {
        const app = express();
        app.use(cors({
            origin: ['http://localhost:3000']
        }))

        app.use(express.json());

        app.listen(8080, () => {
            console.log("Server is running on port 8080")
        })
    }
);



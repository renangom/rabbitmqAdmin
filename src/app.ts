import express from 'express';
import cors from 'cors';
import {DataSource} from 'typeorm'
import { Product } from './entity/product';



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
        const repository = db.getRepository(Product);
        const app = express();
        
        app.use(cors({
            origin: ['http://localhost:3000']
        }))

        app.use(express.json());

        app.get('/api/products', async (req, res) => {
            const products = await repository.find();

            return res.json(products);
        })

        app.post('/api/products', async (req, res) => {
            const {title, image} = req.body;

            const product = await repository.create({title, image});
            const savedProduct = await repository.save(product);

            return res.json(savedProduct);
        })

        app.get('/api/products/:id', async (req,res) => {
            const {id} = req.params;

            const product = await repository.findOne({where: {id}});

            if(!product){
                return res.status(400).json("Product not found");
            }

            return res.json(product);
        })

        app.put('/api/products/:id', async (req,res) => {
            const {id} = req.params;
            const {title, image} = req.body;
            const product = await repository.findOne({where: {id}});

            if(product){
                product.title = title;
                product.image = image;

                await repository.save(product);
                return res.json(product)
            }

        })

        app.delete('/api/products/:id', async (req,res) => {
            const {id} = req.params;

            const product = await repository.findOne({where: {id}});

            if(product) {
                await repository.delete(product);
                return res.json('product deleted')
            }
        })

        app.post('/api/products/:id/like', async (req, res) => {
            const product = await repository.findOne({where: {id: req.params.id}});
            if(product){
                product.likes += 1;
                const result = await repository.save(product);
                return res.json(result);
            }
        })

        app.listen(8080, () => {
            console.log("Server is running on port 8080")
        })
    }
);



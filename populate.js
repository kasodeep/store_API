require('dotenv').config()
const connectToMongo = require('./db/connect')
const Product = require('./models/product')
const jsonProducts = require('./products.json')

const start = async () => {
    try {
        await connectToMongo()
        await Product.deleteMany();
        await Product.create(jsonProducts)
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()
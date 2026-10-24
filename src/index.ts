import express from "express";
import router from "./routes/posts";
import morgan from "morgan";
import cors from 'cors';
const app = express();

app.use(cors())

const postRouter = router;
// const registerLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.log(`[${new Date().toISOString()}] ${req.url} ${req.method} `);
//     next()
// }

app.use(express.json());
// app.use(registerLogger)
app.use(morgan('dev'));

app.use('/posts', postRouter); 




app.get('/', (req, res) => {
    res.send("Active")
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({message: "There was a problem from our end"});
})

app.listen(3000, () => {
    console.log("Server is active")
});



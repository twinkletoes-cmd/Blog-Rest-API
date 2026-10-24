import express from "express";
import z from 'zod';

type Post = {
    id: number,
    title: string,
    content: string,
    author: string,
    createdAt: Date,
    updatedAt: Date
}



const posts: Post[] = [];
const postSchema = z.object({title: z.string(), content: z.string(), author: z.string()})
const updateSchema = postSchema.partial()
const router = express.Router();


router.get('/', (req, res) => {
    res.json(posts);
})


router.get('/:id', (req, res) => {
    const postId = Number(req.params.id);
    if(!Number.isInteger(postId)){
        res.status(404).send("You need to input a number");
        return;
    }

    const idContent = posts.find(post => post.id  === postId);

    if(!idContent) {
        res.status(404).send("Id does not exist");
        return
    } else {
        res.status(200).json(idContent)
    }

    
})

router.post('/', (req, res) => {
    const result = postSchema.safeParse(req.body);

    if(!result.success) {
        return res.status(400).json({
            message: "You input is not valid",
            error: result.error.issues
        })
    } else {
        const newPost : Post = {
            id: posts.length === 0 ? 1 : Math.max(...posts.map(p => p.id)) + 1,
            title: result.data.title,
            content: result.data.content,
            author: result.data.author,
            createdAt: new Date(),
            updatedAt: new Date()
        }    
        posts.push(newPost);
        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        })
    }
})

router.patch('/:id', (req, res) => {
    const postId = Number(req.params.id);

    if(!Number.isInteger(postId)){
        res.status(404).send("Input a number as id");
        return;
    }

    const idIndex = posts.findIndex(post => post.id === postId);
    const idContent = posts[idIndex]

    if(idIndex === -1){
        res.status(404).send("Id does not exist");
        return
    }else {
        const result = updateSchema.safeParse(req.body);

        if(!result.success){
            return res.status(400).json({
                message: "Your input is not valid",
                error: result.error.issues
            })
        } else {
            const updatedPost : Post = {
                ...idContent,
                ...result.data,
                updatedAt: new Date()
            }
            posts[idIndex] = updatedPost;
            res.status(200).json({
                message: "Post has been successfully updated",
                updatedPost: updatedPost
            })
        }
    }
})

router.delete('/:id', (req, res) => {
    const postId = Number(req.params.id);

    if(!Number.isInteger(postId)){
        res.status(404).send("Input a number as id");
        return;
    }

    const idIndex = posts.findIndex(post => post.id === postId);

    if(idIndex === -1){
        res.status(404).send("Id does not exist");
        return
    } else {
        posts.splice(idIndex, 1);
        res.status(204).send()
    }
})



export default router;
import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { sub } from "date-fns"
import axios from "axios"
const POSTS_URL = "http://jsonplaceholder.typicode.com/posts"

const initialState = {
    posts: [],
    status: "idle", //"idle" || "loading" || "succeeded" || "failed"
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => { //takes 2 arguments, first is a string used a the prefix for the generated action type, the second is a payload creator callback. Should return a promise with some data or reject promise with error.
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) { //We have reducers above, but sometimes a slice reducer needs to respond to actions that weren't defined as part of the slices reducers like in the asyncThunk above. So we need to add extra reducers
        builder
            .addCase(fetchPosts.pending, (state, action) => { //if a promise is pending, we respond be setting the status to loading
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {//if it is fulfilled, we set status to succeeded
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1; //let one minute
                const loadedPosts = action.payload.map(post => { //look at loadedPosts we get from action payload and map over it since the fake api above is missing some data, so we set it below
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                })
                // Add any fetched posts to the array
                state.posts = loadedPosts
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
    }
})

export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
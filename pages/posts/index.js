import React, {useState} from "react";
import {authPage} from "../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../components/Nav"

export async function getServerSideProps(ctx) {
    const {token} = await authPage(ctx);

    const postReq = await fetch('http://localhost:3000/api/posts',{
        headers: {
            'Authorization':'Bearer ' + token
        }
    });

    const posts = await postReq.json();

    // console.log(posts);
    return {
        props :{
            token,
            posts: posts.data
        }      
    }
}

export default function PostIndex(props){
    const [posts, setPosts] = useState(props.posts);
    // console.log(props);
    
    async function deleteHandler(id, e){
        e.preventDefault();

        const {token} = props;

        const ask = confirm('Apakah data ini akan di hapus ?');
        // console.log(ask);

        if(ask){
            const deletePost = await fetch('/api/posts/delete/'+id, {
                method: 'DELETE',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+token
                },
            });
            const res = await deletePost.json();
            // console.log(res);
            const postsFiltered = posts.filter(post=>{
                return post.id !== id && post;
            });
            setPosts(postsFiltered);
        }
    }

    function editHandler(id){
        Router.push('/posts/update/'+id);
    }

    return(
        <div>
            <h1>Posts</h1>
            <Nav />
            { posts.map(post => {
                return (
                    <div key={post.id}> 
                    <h3>{post.title} </h3>
                    <p>{post.content}</p>

                    <div>
                        <button onClick={editHandler.bind(this, post.id)}>Edit</button>
                        <button onClick={deleteHandler.bind(this, post.id)}>Delete</button>
                    </div>
                    <hr></hr>
                    </div>
                )
            }) }
        </div>
    )
}
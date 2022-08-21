import React, {useState} from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Router from "next/router";

export async function getServerSideProps(ctx) {
    const {token} = await authPage(ctx);

    return {
        props: {
            token
        }
    }
}

export default function PostCreate(props){
    const [fields, setFields] = useState({
        title: '',
        content: ''
    });

    const [status, setStatus] = useState('normal');

    async function createHandler(e){
        e.preventDefault();

        setStatus('loading');

        const {token} = props;

        const create = await fetch('/api/posts/create', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Bearer '+token
            },
            body: JSON.stringify(fields)
        });

        if(!create.ok) return setStatus('error');

        const res = await create.json();

        // console.log(res);

        setStatus('Success');

        Router.push('/posts');
    }

    async function fieldHandler(e){
        const name = e.target.getAttribute('name');

        setFields ({
            ...fields,
            [name] : e.target.value
        });
    }

    return (
        <div>
            <h1>Create a Post</h1>
            <form onSubmit={createHandler.bind(this)}>
                <input onChange={fieldHandler.bind(this)} type="text" placeholder="Title" name="title"></input>
                <br></br>
                <textarea onChange={fieldHandler.bind(this)} type="text" placeholder="Content" name="content"></textarea>
                <br></br>

                <button type="submit">Create aPost</button>

                <div>
                    Status: {status}
                </div>
            </form>
        </div>
    )
}
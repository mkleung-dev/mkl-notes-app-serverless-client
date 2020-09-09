import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import { API } from "aws-amplify";
import "./NewNote.css";

export default function NewNote() {
    const file = useRef(null);
    const history = useHistory();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return content.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);
        try {

            await createNote({ content });
            history.push("/");
        } catch(e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function createNote(note) {
        return API.post("mkl-notes", "/mkl-notes", {
            body: note
        });
    }

    return (
        <div className="NewNote">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="content">
                    <FormControl value={content} componentClass="textarea" onChange={e => setContent(e.target.value)} />
                </FormGroup>
                <LoaderButton block type="submit" bsSize="large" bsStyle="primary" isLoading={isLoading} disabled={!validateForm()}>
                    Create
                </LoaderButton>
            </form>
        </div>
    );
}
import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";

export default function Notes() {
    const file = useRef(null);
    const { id } = useParams();
    const history = useHistory();
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        function loadNote() {
            return API.get("mkl-notes", `/mkl-notes/${id}`);
        }

        async function onLoad() {
            try {
                const note = await loadNote();
                const { content, attachment } = note;

                setContent(content);
                setNote(note);
            } catch(e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);

    function validateForm() {
        return content.length > 0;
    }

    function formatFilename(str) {
        return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event) {
        file.current = event.target.files[0];
    }

    function saveNote(note) {
        return API.put("mkl-notes", `/mkl-notes/${id}`, {
            body: note
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsLoading(true);
        try {
            await saveNote({
                content,
            });
            history.push("/");
        } catch(e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function deleteNote() {
        return API.del("mkl-notes", `/mkl-notes/${id}`);
    }

    async function handleDelete(event) {
        event.preventDefault();

        const confirmed = window.confirm("Are you sure to delete this note?");

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteNote();
            history.push("/");
        } catch(e) {
            onError(e);
            setIsDeleting(false);
        }
    }

    return (
        <div className="Notes">
            {note && (
                <form onSubmit={handleSubmit}>
                    <FormGroup controlId="content">
                        <FormControl value={content} componentClass="textarea" onChange={e => setContent(e.target.value)} />
                    </FormGroup>
                    <LoaderButton block type="submit" bsSize="large" bsStyle="primary" isLoading={isLoading} disabled={!validateForm()}>Save</LoaderButton>
                    <LoaderButton block bsSize="large" bsStyle="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</LoaderButton>
                </form>
            )}
        </div>
    );
}
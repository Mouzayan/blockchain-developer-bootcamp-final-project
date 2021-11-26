import React from 'react';
import './Snippet.scss';


const Snippet = ({ snippet, getSnippets, editSnippet }) => {
  async function deleteSnippet() {
    await Axios.delete(`http://localhost:5000/snippet/${snippet._id}`);
    getSnippets();
  }

  return (
    <div className="snippet">
      {snippet.title && <h2 className="title">{snippet.title}</h2>}
      {snippet.description && (
        <p className="description">{snippet.description}</p>
      )}
      {snippet.code && (
        <pre className="code">
          <code>{snippet.code}</code>
        </pre>
      )}
      <button className="btn-edit" onClick={() => editSnippet(snippet)}>
        Edit
      </button>
      <button className="btn-delete" onClick={deleteSnippet}>
        Delete
      </button>
    </div>
  );
};

export default Snippet;

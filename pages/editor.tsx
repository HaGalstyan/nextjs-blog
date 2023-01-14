import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css"; // import the styles

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["link", "image", "video"],

    ["clean"], // remove formatting button
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true,
  },
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDraft, setIsDraft] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [data, setData] = useState({
    title: "",
    content: [],
  });

  function submitHandler(event) {
    event.preventDefault();

    const requestObj = {
      id: new Date().toISOString(),
      title: title,
      content: content,
      isDraft: isDraft,
      isPublished: isPublished,
    };

    fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(requestObj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: any) => {
        setData(data);
      });
  }

  function handleTitleChange(event) {
    event.preventDefault();
    setTitle(event.target.value);
  }

  return (
    <form onSubmit={submitHandler}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        value={title}
        name="title"
        placeholder="Enter a title"
        onChange={handleTitleChange}
        required
      />
      <QuillNoSSRWrapper modules={modules} onChange={setContent} theme="snow" />
      <button>Save</button>
      <p>{content}</p>

      <div>
        <p>{data.title}</p>
        <div>
          {data.content.map((el) => {
            return <div dangerouslySetInnerHTML={{ __html: el }}></div>;
          })}
        </div>
      </div>
    </form>
  );
}

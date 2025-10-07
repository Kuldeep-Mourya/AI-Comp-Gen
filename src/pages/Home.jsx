import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { LuCodeXml } from "react-icons/lu";
import Editor from "@monaco-editor/react";
import React, { useState } from "react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { ImNewTab } from "react-icons/im";
import { IoMdClose, IoMdRefresh } from "react-icons/io";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const options = [
  { value: "html-css", label: "HTML+CSS" },
  { value: "html-tailwind", label: "HTML+Tailwind CSS" },
  { value: "html-bootstrap", label: "HTML+Bootstrap" },
  { value: "html-css-js", label: "HTML+CSS+JS" },
  { value: "html-tailwind-bootstrap", label: "HTML+Tailwind+Bootstrap" },
];

const Home = () => {
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen]=useState(false)
  function extractCode(response){
    //Regex se tripple backtic k ander k content nikal lo
    const match=response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ?match[1].trim(): response.trim()
  }

  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyB4j7xPQvLaGQ39d81bs-I8s4ogHO01TJE",
  });

  async function getResponse() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
    You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

     Now, generate a UI component for: ${prompt}  
     Framework to use: ${frameWork.value}  

     Requirements:  
     The code must be clean, well-structured, and easy to understand.  
     Optimize for SEO where applicable.  
     Focus on creating a modern, animated, and responsive UI design.  
     Include high-quality hover effects, shadows, animations, colors, and typography.  
     Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
     Do NOT include explanations, text, comments, or anything else besides the code.  
     And give the whole code in a single HTML file.

    `,
    });
    console.log(response.text);
    setCode(extractCode(response.text));
    setOutputScreen(true);
    setLoading(false);
  }

  //Code Copy function
  const copyCode=async()=>{
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard")
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Faild to copy")
    }
  }

  //Download files 
  const downloadFile=()=>{
    const fileName="GenUI-Code.html"
    const blob=new Blob([code],{type:'text/plain'});
    let url= URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=fileName
    link.click();
    URL.revokeObjectURL(url)
    toast.success("File downloaded")
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between px-[100px] gap-[20px]">
        <div className="left w-[50%] h-[auto] py-[20px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold sp-text">
            AI Component Genrator
          </h3>
          <p className="text-[gray] mt-2 text-[16px]">
            Describe your component and AI will code for you
          </p>
          <p className="text-[15px] font-[700] mt-4 mb-2">FrameWork</p>
          <Select
            options={options}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "#000", // black background
                borderColor: "#333", // dark border
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  borderColor: "#555",
                },
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "#000", // black dropdown menu
                color: "#fff",
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? "#333" : "#000",
                color: "#fff",
                cursor: "pointer",
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#fff", // selected value text color
              }),
              input: (provided) => ({
                ...provided,
                color: "#fff",
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "#aaa", // light gray placeholder
              }),
            }}
            onChange={(e) => setFrameWork(e.value)}
          />
          <p className="text-[15px] font-[700] mt-5">Describe Your Component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className="w-full min-h-[200px] p-[10px] bg-[#09090B] rounded-xl mt-3"
            placeholder="Describe your component in detail and let ai will code for you"
            name=""
            id=""
          ></textarea>
          <div className="flex items-center justify-between">
            <p className="text-[gray]">
              Click on Generate button To Generate your code
            </p>
            <button
              onClick={getResponse}
              className="generate flex items-center p-[15px] rounded-lg border-0 cursor-pointer bg-gradient-to-r from-purple-400  to-purple-600 mt-3  min-w-[120px] gap-[10px] transition-all hover:opacity-[0.8] "
            >
              {
                loading===false?
                <> 
                  <i><BsStars /> </i>
                </>
                :""
              }
              

              {loading === true ? (
                <>
                  <ClipLoader color="white" size={20}/>
                </>
              ) : "" }

              Generate
            </button>
          </div>
        </div>
        <div className="right relative w-[50%] h-[80vh] bg-[#141319] rounded-xl mt-2">
          {outputScreen === false ? (
            <>
              

              <div className="skeleten w-full h-full flex items-center justify-center flex-col">
                <div className="circle p-[20px] w-[70px] h-[70px] flex items-center justify-center text-[30px]    rounded-[50%] bg-gradient-to-r from-purple-400  to-purple-600">
                  <LuCodeXml />
                </div>
                <p className="text-[16px] text-[gray] mt-3">
                  Your code and component will appear here
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="top w-full h-[60px] bg-[#17171c]  flex items-center gap-[15px] px-[20px]">
                <button
                  onClick={() => setTab(1)}
                  className={` btn w-[50%] p-[10px]  rounded-xl  cursor-pointer tranisition-all ${
                    tab === 1 ? "bg-[#333]" : ""
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={` btn w-[50%] p-[10px]  rounded-xl  cursor-pointer tranisition-all ${
                    tab === 2 ? "bg-[#333]" : ""
                  }`}
                >
                  Preview
                </button>
              </div>

              <div className="top-2 w-full h-[60px] bg-[#17171c]  flex items-center justify-between gap-[15px] px-[20px]">
                <div className="left">
                  <p className="font-bold">Code Editor</p>
                </div>
                <div className="right flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button className="copy flex items-center justify-center w-[40px] h-[40px] border-[1px] rounded-xl border-zinc-800 transition-all hover:bg-[#333]" onClick={copyCode}>
                        <IoCopy />
                      </button>
                      <button className="copy flex items-center justify-center w-[40px] h-[40px] border-[1px] rounded-xl border-zinc-800 transition-all hover:bg-[#333]" onClick={downloadFile}>
                        <BiExport />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="copy flex items-center justify-center w-[40px] h-[40px] border-[1px] rounded-xl border-zinc-800 transition-all hover:bg-[#333]" onClick={()=>setIsNewTabOpen(true)}>
                        <ImNewTab />
                      </button>

                      <button className="copy flex items-center justify-center w-[40px] h-[40px] border-[1px] rounded-xl border-zinc-800 transition-all hover:bg-[#333]">
                        <IoMdRefresh />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {tab === 1 ? (
                <div className="editor h-full">
                  <Editor
                    height="100vh"
                    theme="vs-dark"
                    language="html"
                    value={code}
                  />
                  ;
                </div>
              ) : 
                <>
                 <iframe srcDoc={code} className="preview w-full h-full flex items-center jsutify-center bg-white text-black"></iframe>
                </>
              }
            </>
          )}
        </div>
      </div>

      {
        isNewTabOpen===true ?
        <> 
         <div className="container absolute left-0 right-0 top-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
          <div className="top w-full text-black h-[60px] flex items-center justify-between px-[20px]">
            <div className="left">
              <p className="font-bold">Preview</p>
            </div>
            <div className="right flex items-center gap-[10px]">
              <button className="w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={()=>{setIsNewTabOpen(false)}}><IoCloseSharp />
</button>
            </div>
          </div>
            <iframe srcDoc={code} className="w-full h-full "></iframe>
         </div>
        </>
        :""
      }
    </>
  );
};

export default Home;




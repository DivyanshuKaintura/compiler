import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/ext-language_tools";
import { motion } from "framer-motion";

export default function CCompiler() {
  const [code, setCode] = useState(`#include<stdio.h>\nint main() {\n  int x;\n  scanf("%d", &x);\n  printf("Value: %d\\n", x);\n  return 0;\n}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const [theme, setTheme] = useState("tomorrow_night");

  const themes = ["tomorrow_night", "monokai", "github", "dracula", "solarized_dark"];

  const memoizedThemes = useMemo(() => {
    return ["tomorrow_night", "monokai", "github", "dracula", "solarized_dark"];
  }, []);

  useEffect(() => {
    memoizedThemes.forEach(theme => {
      import(`ace-builds/src-noconflict/theme-${theme}`);
    });
  }, [theme, memoizedThemes]);

  const handleCompile = async () => {
    setIsCompiling(true);
    setShowOutput(false);

    try {
      const res = await axios.post("http://localhost:5000/compile", { code, input });
      setTimeout(() => {
        setOutput(res.data.output);
        setIsCompiling(false);
        setIsSuccess(true);
        setShowOutput(true);
      }, 800); // Slight delay for animation effect
    } catch (error) {
      setTimeout(() => {
        setOutput("Compilation Error: " + (error.response?.data?.error || error.message));
        setIsCompiling(false);
        setIsSuccess(false);
        setShowOutput(true);
      }, 800);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 8px rgb(255, 255, 255, 0.5)",
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-6 lg:p-10"
    >
      <motion.div
        className="max-w-6xl w-full mx-auto rounded-xl overflow-hidden shadow-2xl bg-gray-800 border border-gray-700"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-700 bg-gray-900 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            C Online Compiler
          </h1>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-gray-700 text-white text-sm md:text-base rounded border border-gray-600 p-1 md:p-2"
          >
            {themes.map(t => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
  
        {/* Editor */}
        <div className="p-4 md:p-6">
          <motion.div
            className="mb-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-0 left-0 bg-gray-900 text-xs px-3 py-1 rounded-tr rounded-bl z-10 font-mono translate-y-[-100%]">
              main.c
            </div>
            <AceEditor
              mode="c_cpp"
              theme={theme}
              value={code}
              onChange={(newCode) => setCode(newCode)}
              fontSize={14}
              width="100%"
              height="250px"
              className="rounded-lg shadow-inner"
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
            />
          </motion.div>
  
          {/* Input & Output Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Input Section */}
            <motion.div
              className="bg-gray-800 rounded-lg border border-gray-700 p-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <h3 className="text-sm md:text-lg font-semibold text-gray-300">Input</h3>
                <div className="ml-2 px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300">stdin</div>
              </div>
              <textarea
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input here..."
                className="w-full bg-gray-900 text-white font-mono p-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </motion.div>
  
            {/* Output Section */}
            <motion.div
              className="bg-gray-800 rounded-lg border border-gray-700 p-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center mb-2">
                <h3 className="text-sm md:text-lg font-semibold text-gray-300">Output</h3>
                <div className="ml-2 px-2 py-1 bg-gray-700 rounded-md text-xs text-gray-300">stdout</div>
              </div>
              <motion.pre
                className={`w-full min-h-[100px] md:min-h-[120px] bg-gray-900 font-mono p-3 rounded-md border ${isSuccess === true ? 'border-green-500' :
                    isSuccess === false ? 'border-red-500' : 'border-gray-700'
                  } overflow-auto`}
                animate={showOutput ? { opacity: 1 } : { opacity: 0.7 }}
                transition={{ duration: 0.3 }}
              >
                {output || "Program output will appear here..."}
              </motion.pre>
            </motion.div>
          </div>
  
          {/* Run Code Button */}
          <div className="flex justify-center">
            <motion.button
              onClick={handleCompile}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-white flex items-center space-x-2 ${isCompiling ? 'bg-yellow-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isCompiling}
            >
              {isCompiling ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Compiling...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <span>Run Code</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
  
        {/* Footer */}
        <motion.div
          className="p-4 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs md:text-sm space-y-2 md:space-y-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isCompiling ? 'bg-yellow-500' : isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{isCompiling ? 'Compiling...' : isSuccess ? 'Compilation Successful' : 'Compilation Failed'}</span>
          </div>
          <div>GCC version</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
  
}
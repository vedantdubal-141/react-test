# react-test

## model used is "imported-models/uncategorized/Qwen2.5 Coder 7B Instruct GGUF Q5_0" https://huggingface.co/bartowski/Mistral-7B-Instruct-v0.3-GGUF

### primary tools used are

- MINE RTX 4070 👹 + I7,14700K 👺

1. Clion
2. LM studio
   { dependencies:

- llama.cpp-linux-x86_64-vulkan-avx2
- llama.cpp-linux-x86_64-nvidia-cuda-avx2
- llama.cpp-linux-x86_64-opencl-avx2}

3. Continue.dev extension for LLMs
4. Antigarvity
5. gh-cli
6. github actions

# main changes/ problems

### used Switch to the HashRouter since GitHub pages doesn't support the tech used by the BrowserRouter.

SOLUTION INSPIRED BY https://stackoverflow.com/questions/71984401/react-router-not-working-with-github-pages

### SOLUTION: by https://stackoverflow.com/users/8690857/drew-reese

If deploying to GitHub, ensure there is a "homepage" entry in package.json for where you are hosting it in Github.

Examples:

User Page

"homepage": "https://amodhakal.github.io",
Project Page

"homepage": "https://amodhakal.github.io/portfolio",
Custom Domain Page

"homepage": "https://amodhakal.com",
Vite: add the project directory as the base.

vite.config.js

export default {
...
base: "/portfolio"
};
Switch to the HashRouter since GitHub pages doesn't support the tech used by the BrowserRouter.

index

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Note 1
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<HashRouter>
<App />
</HashRouter>
</React.StrictMode>
);
react-router data routers

import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<App />
</React.StrictMode>
);
import {
createHashRouter,
RouterProvider
} from 'react-router-dom'; // Note 1
// import routed components

const router = createHashRouter([
... routes configuration
]);

const App = () => {
...

return <RouterProvider router={router} />;
};

export default App;
For more details see the create-react-app docs for deploying to GitHub Pages and notes on client-side routing.

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/compile', (req, res) => {
    const { code, input } = req.body;
    const filePath = 'temp.c';
    const inputFilePath = 'input.txt';

    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputFilePath, input || "");

    exec(`gcc ${filePath} -o temp && temp.exe < ${inputFilePath}`, (error, stdout, stderr) => {
        if (error || stderr) {
            res.json({ output: stderr || error.message });
        } else {
            res.json({ output: stdout });
        }
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));

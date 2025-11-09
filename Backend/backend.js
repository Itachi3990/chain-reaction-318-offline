const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));
app.options('*', cors()); // Handle preflight

app.use(express.json()); // Parse JSON bodies

app.post('/run-ai', (req, res) => {
    //console.log(req.body.gameState);
    //gameState is an array of array of strings. Need to write it to a txt file
    const gameState = req.body.gameState;

    let str = "Human Move:\n";
    for (let i = 0; i < gameState.length; i++) {
        for (let j = 0; j < gameState[i].length; j++)
            str += gameState[i][j] + " "; 
        str += "\n";
    }
    const filePath = path.join(__dirname, 'game_state.txt');

    const fs = require('fs');
    fs.writeFile(filePath, str, (err) => {
        if (err) {
            console.error('Failed to write to file:', err);
            return res.status(500).send('Error writing to file');
        }
        console.log('written human input to file.\n'+str);
    });

    const exePath = path.join(__dirname, 'ai.exe');
    const child = spawn(exePath, [req.body.aiDepth.toString(), req.body.aiHeuristic.toLowerCase().replace(' ', '_').replace(' ', '_'), req.body.moveFor]);

    let move_posn = -1;

    // Stream stdout in real time
    child.stdout.on('data', (data) => {
        const text = data.toString();
        console.log(`[stdout]: ${text}`);

    });

    // Stream stderr in real time
    child.stderr.on('data', (data) => {
        console.error(`[stderr]: ${data.toString()}`);
    });

    // Handle process exit
    child.on('close', (code) => {
        console.log(`Move received: ${code}`);
        move_posn = code;

        if (code < 0 || code > gameState.length * gameState[0].length) {
            console.error('Failed to process, code: ', code);
            res.status(500).send('Execution failed');
        } 

        //now read the file again, parse gameState and send it back
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Failed to read file:', err);
                return res.status(500).send('Error reading file');
            }
            console.log('Read from file:', data);
            const lines = data.split('\n').filter(line => line.trim() !== '');
            const newGameState = lines.map(line => line.split(' ').filter(cell => cell.trim() !== '')).filter(row => row.length == gameState[0].length);
            res.json({ move: move_posn, gameState: newGameState });
        });
    });

    child.on('error', (err) => {
        console.error('Failed to start process:', err);
        res.status(500).send('Execution failed');
    });


    
});

app.get('/logwin', (req, res) => {
    const [winColor, timeStamp] = decodeURIComponent(req.query.color).split(' ');
    //append to a log file
    const fs = require('fs');
    const logFilePath = path.join(__dirname, 'log.txt');
    const timeFilePath = path.join(__dirname, 'time.txt');
    fs.appendFile(logFilePath, `${winColor}\n`, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
            return res.status(500).send('Error writing to log file');
        }
    });
    fs.appendFile(timeFilePath, `${timeStamp}\n`, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
            return res.status(500).send('Error writing to log file');
        }
            res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server running at http://localhost:${PORT}`);
});

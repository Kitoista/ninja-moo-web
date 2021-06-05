const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 4201;

const settings = require('./settings.json');

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', 'http://localhost:4201/');
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors());
app.use(express.json());
app.use(multer({ dest: __dirname + '\\uploads' }).any());

mooLog = (stuff) => {
    if (!settings.silent) {
        console.log(stuff);
    }
}

mooError = (stuff) => {
    if (!settings.silent) {
        console.error(stuff);
    }
}

getMooMoo = (stdout, moomoo) => {
    let lines = stdout.split("\n");

    let correctLine = null;

    lines.forEach(line => {
        line = line.trim();

        if (line.includes(settings.ports[moomoo])) {
            correctLine = line;
        }

    });

    return correctLine;
};



app.get('/status/:name', (req, res) => {
    mooLog("-----------------------");
    mooLog("STATUS " + req.params?.name);

    exec('list-moo', (error, stdout, stderr) => {
        if (error) {
            mooError("list-moo failed");
            res.status(500).json({ msg: "list-moo failed.", error: stderr });
        } else {
            let line = getMooMoo(stdout, req.params?.name);
            if (line === null) {
                mooLog(req.params?.name + " is not running");
                res.json({ msg: "Success", alive: false });
            } else {
                mooLog(req.params?.name + " is running");
                res.json({ msg: "Success", alive: true });
            }
        }
    });
});

app.post('/host', (req, res) => {
    mooLog("-----------------------");
    mooLog("HOST " + req.body?.name);

    if (Object.keys(settings.ports).includes(req.body?.name)) {
        exec('list-moo', (error, stdout, stderr) => {
            if (error) {
                mooError("list-moo failed");
                res.status(500).json({ msg: "list-moo failed.", error: stderr });
            } else {
                let line = getMooMoo(stdout, req.body?.name);

                if (line === null) {
                    mooLog(req.body?.name + " is not running yet.");

                    let command = req.body?.name.toLowerCase() + '-moo';
                    exec(command, (error2, stdout2, stderr2) => {
                        if (error2) {
                            mooError(command + " failed");
                            res.status(500).json({ msg: command + " failed", error: stderr2 });
                        } else {
                            mooLog("Hosting " + req.body?.name);
                            res.json({ msg: "Successful" });
                        }
                    });
                } else {
                    mooError(req.body?.name + " is already running.");
                    res.json({ msg: "Already running" });
                }
            }
        });
    } else {
        mooError("No such moomoo version as " + req.body?.name);
        res.status(403).json({ msg: "No such moomoo verison" });
    }
});

app.post('/kill', (req, res) => {
    mooLog("-----------------------");
    mooLog("KILL " + req.body?.name);

    exec('list-moo', (error, stdout, stderr) => {
        if (error) {
            console.error("list-moo failed");
            res.status(500).json({ msg: "list-moo failed.", error: stderr });
        } else {
            let line = getMooMoo(stdout, req.body?.name);

            if (line === null) {
                mooLog(req.body?.name + " wasn't running anyways");
                res.json({ msg: "It wasn't running anyways" });
            } else {
                let pid = line.split(" ")[0];
                
                if (settings.logOnly) {
                    mooLog('I would say kill "' + pid + '", but logOnly ON');
                    res.json({ msg: "LogOnly is turned on" });
                } else {
                    exec('kill ' + pid, (error2, stdout2, stderr2) => {
                        if (error2) {
                            mooError("kill " + req.body.name + " failed");
                            res.status(500).json({ msg: "Failed to kill pid: " + pid, error: stderr2 });
                        } else {
                            res.json({ msg: "Successful" });
                        }
                    });
                }

            }

        }
    });
});

app.post('/upload', (req, res) => {
    if (req.files[0].mimetype == 'application/zip') {
        req.body.name;
        req.files[0].originalName;
        res.json({ msg: "Upload " + req.body.name });
    } else {
        res.status(403).json({ msg: "It's not a zip" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

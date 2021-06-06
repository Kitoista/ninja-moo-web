const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 4201;

const settings = require('./settings.json');

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['http://localhost:4201/', 'http://109.228.61.190:4201/']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(cors());
app.use(express.json());
app.use(multer({ dest: __dirname + '/uploads' }).any());

escapeShell = (cmd) => {
    return (cmd || "").split(' ')[0];
};

const listMooCommand = 'ps axf | grep Dream | grep -v grep';

hostCommand = (name) => {
    name = escapeShell(name);
    return 'cd /root/.byond/' + name + ';' + 
           'DreamDaemon NinjaMoo ' + settings.ports[name] + ' -trusted -logself &' +
           'disown';
}

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

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/api/status/:name', (req, res) => {
    exec(listMooCommand, (error, stdout, stderr) => {
    mooLog("-----------------------");
        mooLog("STATUS " + req.params?.name);
        
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

app.post('/api/host', (req, res) => {
    mooLog("-----------------------");
    mooLog("HOST " + req.body?.name);

    if (Object.keys(settings.ports).includes(req.body?.name)) {
        exec(listMooCommand, (error, stdout, stderr) => {
            if (error) {
                mooError("list-moo failed");
                res.status(500).json({ msg: "list-moo failed.", error: stderr });
            } else {
                let line = getMooMoo(stdout, req.body?.name);

                if (line === null) {
                    mooLog(req.body?.name + " is not running yet.");

                    exec(hostCommand(req.body?.name), (error2, stdout2, stderr2) => {
                        if (error2) {
                            mooError('host-' + req.body?.name + " failed");
                            res.status(500).json({ msg: 'host-' + req.body?.name + " failed", error: stderr2 });
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

app.post('/api/kill', (req, res) => {
    mooLog("-----------------------");
    mooLog("KILL " + req.body?.name);

    if (Object.keys(settings.ports).includes(req.body?.name)) {
        exec(listMooCommand, (error, stdout, stderr) => {
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
    } else {
        mooError("No such moomoo version as " + req.body?.name);
        res.status(403).json({ msg: "No such moomoo verison" });
    };
});

app.post('/api/upload', (req, res) => {
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

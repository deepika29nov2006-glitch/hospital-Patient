const http = require("http");
const fs = require("fs");
const querystring = require("querystring");

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {

        fs.readFile("index.html", (err, data) => {
            if (err) {
                res.end("Error loading page");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }

    else if (req.method === "GET" && req.url === "/style.css") {

        fs.readFile("style.css", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
        });
    }

    else if (req.method === "POST" && req.url === "/register") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            const formData = querystring.parse(body);

            const patientRecord =
`Name: ${formData.patientName}
Date: ${formData.date}
Disease: ${formData.disease}
--------------------------
`;

            fs.appendFile("patient_registry.txt", patientRecord, err => {

                if (err) {
                    res.end("Error saving patient");
                    return;
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("<h2>Patient Registered Successfully!</h2><a href='/'>Go Back</a>");
            });
        });
    }

    else if (req.method === "GET" && req.url === "/patients") {

        fs.readFile("patient_registry.txt", "utf8", (err, data) => {

            if (err) {
                res.end("No patient records found.");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(data);
        });
    }

    else {
        res.writeHead(404);
        res.end("Page Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server Running at http://localhost:3000");
});
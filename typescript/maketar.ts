// Language: typescript
// Path: typescript/maketar.ts
// create tarball stream from a directory
// run: npx ts-node maketar.js /testdata/plaintext.d
// export API_TOKEN
// export PROJECT_ID
// export API_URL

const fs = require("fs");
const tar = require("tar");
const axios = require("axios");
const FormData = require("form-data");
// import * as path from "path";
// import * as zlib from "zlib";

console.log(process.argv[2]);
const dir = process.argv[2];
const tarballFile = "tarball.tgz";
const tarballStreamFile = "stream-tarball.tgz";
const restClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    // "Content-Type": "application/x-tar",
    // "Content-Encoding": "gzip",
    // "Content-Disposition": 'attachment; filename="stream-tarball.tgz"',
    // "Content-Length": 1000,
    Authorization: "Bearer " + process.env.API_TOKEN,
    monkeybutt: true,
  },
});

const files = fs.readdirSync(dir);
// local tarball to file
tar.c(
  {
    file: tarballFile,
    cwd: dir,
    portable: true,
    gzip: true,
    sync: true,
    strict: true,
    noPax: true,
    noMtime: true,
  },
  files
);
// local tarball from stream
function createTarball(dir: string) {
  const stream = tar.create(
    {
      cwd: dir,
      portable: true,
      gzip: true,
      sync: true,
      strict: true,
      noPax: true,
      noMtime: true,
    },
    files
  );
  return stream;
}

const stream = createTarball(dir);
// write tarball to file
stream.pipe(fs.createWriteStream(tarballStreamFile));

// add tarball to html form
interface FormData {
  append: (key: string, value: any) => void;
  getHeaders: () => any;
  getLengthSync: () => number;
  getLength: () => number;
  entries: () => any;
}

const form = new FormData();
// form.append("file", fs.createReadStream(tarballFile));
const fileName = "stream-tarball.tgz";
const name = "stream-test";
const runtime = "nodejs";
const entryPoint = "app.js";
const port = 80;
const projectID = process.env.PROJECT_ID;
const envsBuffer = Buffer.from("ENV1=VALUE1");
const envsB64 = envsBuffer.toString("base64");
const envs = envsB64;
const folderPath = dir;
// const size = fs.statSync(tarballFile).size;
// const localStream = fs.createReadStream(tarballFile);
const size = fs.statSync(tarballStreamFile).size;
const memoryStream = fs.createReadStream(tarballStreamFile);
const content = getStreamContent(stream);
form.append("name", name);
form.append("runtime", runtime);
form.append("entry_point", entryPoint);
form.append("source_path", folderPath);
form.append("port", port);
form.append("project_id", projectID);
form.append("envs", envs);
const formLength = getContentLength(form);
form.append("tarball", content, fileName, {
  knownLength: size,
});
formLength + size;
const headers = form.getHeaders();
// getStreamLength(content).then((length: any) => {
//   console.log(length);
// });

function getContentLength(form: any) {
  return form.getLengthSync(function (err: any, length: any) {
    if (err) {
      console.log(err);
      return 0;
    } else {
      console.log("form: " + length);
      return length;
    }
  });
}
// console.log("uploading tarball to server " + size);
// console.log(form)
// console.log(content)
// upload tarball to server
// function uploadTarball(form: FormData) {
//   const url = "/upload/function";
//   const options = {
//     method: "POST",
//     body: form,
//     headers: {
//       ...form.getHeaders(),
//       "Content-Length": formLength,
//     },
//   };
//   return restClient(url, options)
//     .then((res: any) => res.data)
//     .catch((err: any) => err);
// }

// uploadTarball(form).then((res: any) => {
//   console.log(res);
//   console.log(res.response.data);
//   console.log(res.request._header);
// });

// get content from stream
function getStreamContent(stream: any) {
  return new Promise((resolve, reject) => {
    let streamContent: string = "";
    stream.on("data", (chunk: any) => {
      streamContent += chunk;
      console.log(streamContent);
    });
    stream.on("end", () => {
      resolve(streamContent);
    });
    stream.on("error", (err: any) => {
      reject(err);
    });
  });
}
getStreamContent(stream).then((content: any) => {
  console.log(content);
});

export { createTarball };

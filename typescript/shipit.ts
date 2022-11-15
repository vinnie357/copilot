
const maketar = require("./tar");
const upload = require("./upload");
const forms = require("./forms");

const dir = process.argv[2];
const envsBuffer = Buffer.from("ENV1=VALUE1");
const envsB64 = envsBuffer.toString("base64");

let formInfo = {
    fileName: "stream-tarball.tar.gz",
    name: "stream-test",
    runtime: "nodejs",
    entryPoint: "app.js",
    port: 80,
    projectID: process.env.PROJECT_ID,
    envs: envsB64,
    folderPath: dir,
}

async function makePayload(folderPath:string) {
    console.log("shipit:", folderPath, process.env.API_URL);
    const tarBallContent = await maketar.createTarball(folderPath);
    console.log("tarball:", tarBallContent,tarBallContent.length)
    const form = await forms.createForm(formInfo,tarBallContent);
    console.log("form:", await form);
    const uploadResponse = await upload.uploadTarball(form);
    console.log("uploadResponse:", uploadResponse);
    // console.log("upload:", uploadResponse.response.status,uploadResponse.response.data);
    return uploadResponse;
}




makePayload(dir)
// makePayload(dir).then((payload:any) => {
//     console.log(payload);
//     upload.upload(payload);
// }
// );

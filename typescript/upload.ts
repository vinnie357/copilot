const axios = require("axios");
const fetch = require("node-fetch");


const restClient = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      Authorization: "Bearer " + process.env.API_TOKEN,
      monkeybutt: true,
    },
});

// function createForm(payload: any) {
//   const form = new FormData();
//   form.append("name", name);
//   form.append("runtime", runtime);
//   form.append("entry_point", entryPoint);
//   form.append("source_path", folderPath);
//   form.append("port", port);
//   form.append("project_id", projectID);
//   form.append("envs", envs);

//   return form;
// }


// // upload tarball to server
function uploadTarball(form: any) {

  const url = "/upload/function";
  const options = {
    method: "POST",
    body: form,
    maxContentLength: 16777216,
    headers: {
        ...form.getHeaders(),
        // "Content-Length": form.getLengthSync(),
        // 'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`
    },
  };
  console.log("options:", options)
//   console.log("content-length:", form.getLengthSync());
return restClient.post(url, form, options, {
  data: form,
}).then((res: any) => res.data)
.catch((err: any) => err);
}

// uploadTarball(form).then((res: any) => {
//   console.log(res);
//   console.log(res.response.data);
//   console.log(res.request._header);
// });
function uploadTarball1(form: any) {
  const host:any = process.env.API_URL;
  const url = process.env.API_URL + '/upload/function'
  // new URL(host,"/upload/function").href;
  console.log("url:", url);
return fetch(url, {
    method: 'POST',
    body: form,
    headers: {
      'Authorization': "Bearer " + process.env.API_TOKEN,
      'monkeybutt': true,
    }
}).then((res: any) => res)
.catch((err: any) => err);
}

// async function upload(params:any) {

// }


export {
    uploadTarball,
}

const FormData = require("form-data");
const fs = require("fs/promises");

async function createForm(formInfo:any, tarBallContent:any) {
    // const fileStream = await fs.readFile('./mytar.tar');
    const form = new FormData();
    form.append("name", formInfo.name);
    form.append("runtime", formInfo.runtime);
    form.append("entry_point", formInfo.entryPoint);
    form.append("source_path", formInfo.folderPath);
    form.append("port", formInfo.port);
    form.append("project_id", formInfo.projectID);
    form.append("envs", formInfo.envs);
    form.append("tarball", tarBallContent, {
        filename: formInfo.fileName,
        // KnownLength: tarBallContent.length,
        // contentType: 'application/tar+gzip'
        // contentType: 'application/tar',
    });
    return form;
}

export { createForm };

// body = fstream.Reader({type: "Directory", path: "/var/www"})
// .pipe(tar.Pack())
// .pipe(zlib.Gzip());

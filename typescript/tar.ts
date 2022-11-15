const fs = require("fs");
const tar = require("tar");
const path = require("path");
const parseGitIgnore = require("parse-gitignore");

interface Directory {
  dir: string;
}
interface Files {
  files: Array<string>;
}
interface List {
  list: Array<string>;
}
interface File {
  file: string;
}
// escape strings with regex special characters
// from escape-string-regexp
function escapeStringRegexp(string: string) {
  if (typeof string !== "string") {
    console.log(typeof string);
    throw new TypeError("Expected a string");
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

// local tarball from stream
function createTarStream(dir: Directory, files: Files, gzip: boolean = true) {
  const stream = tar.create(
    {
      cwd: dir,
      portable: true,
      gzip: gzip,
      sync: true,
      strict: true,
      noPax: true,
      noMtime: true,
    },
    files
  );
  return stream;
}
function getFileList(folder: any) {
  return fs.readdirSync(folder);
}
// parse git ignore if present
async function parseIgnore(files: any, folderPath: any) {
  return new Promise((resolve, reject) => {
    let list: any = [""];
    for (const file of files) {
      if (file === ".gitignore") {
        // console.log("parseignore:", file)
        list = parseGitIgnore(
          fs.readFileSync(
            path.join(folderPath, file),
            "utf8",
            function (err: any, data: any) {
              if (err) {
                console.log("error", err, data);
                reject(err);
              }
            }
          )
        );
      }
    }
    //   list.push('.git')
    resolve(list.patterns);
    // console.log(list)
  });
}

function filterFileList(fileList: any, ignoreList: any) {
  // console.log("ignoreList:",ignoreList)
  // console.log("fileList:",fileList)
  const filteredFiles: string[] = [];
  for (const file of fileList) {
    let ignored: boolean = false;
    for (let ignore of ignoreList) {
      // console.log("filter",file,ignore)
      let ignoreRegex = escapeStringRegexp(ignore);
      let found = file.match(ignoreRegex);
      if (found !== null && found.length > 0) {
        console.log("ignoring:", found);
        ignored = true;
      }
    }

    if (!ignored) {
      filteredFiles.push(file);
    }
  }
  return filteredFiles;
}

function readTarStream(stream: any) {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("data", (chunk: any) => {
      data += chunk;
    });
    stream.on("end", () => {
      resolve(data);
    });
    stream.on("error", (err: any) => {
      reject(err);
    });
  });
}

async function createTarball(dir: Directory) {
  const files = await getFileList(dir);
  const ignoreList = await parseIgnore(files, dir);
  const fileList: any = await filterFileList(files, ignoreList);
  const stream = await createTarStream(dir, fileList);
  // write stream to file
  // stream.pipe(fs.createWriteStream('mytar.tar'));
  // read stream to string
  const tarballStream = await readTarStream(stream);
  // const tarballStream = await stream
  return tarballStream;

  // return tarball;
  // return stream;
}

export { createTarball };

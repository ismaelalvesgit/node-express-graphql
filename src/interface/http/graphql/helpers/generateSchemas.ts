import { importSchemas } from "./getGQLFilesAsString";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

export default (path = `${__dirname}/../schema.graphql`)=>{
    writeFileSync(path, ""); // clear
    writeFileSync(path, importSchemas(resolve(__dirname, "../../"))); // write
    return readFileSync(path, "UTF-8");
};
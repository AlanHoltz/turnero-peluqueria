const fs = require('fs');
const pathDep = require('path');
const formidable = require('formidable');
//const md5 = require('md5');
const crypto = require('crypto');
const { rmdir } = require('fs/promises');

class FileHandler {

    createDirectory = (path) => {
        fs.mkdir(path, (err) => {
            if (err) return "La carpeta ya existe";
            return "Creado";
        });
    };

    deleteAllDirectoryFiles = (path) => {

        fs.readdir(path, (err, files) => {
            if (files) {
                for (const file of files) {
                    fs.unlink(pathDep.join(path, file), err => { });
                };
            }

        });
    };

    deleteDirectory = (path) => fs.rm(path, { recursive: true, force: true }, () => { });

    getRandomName = (filename) => {
        const extension = pathDep.extname(filename);
        const randomCharacters = crypto.randomBytes(16).toString("hex");
        return randomCharacters + extension;
    };

    upload = ({ mainFolder, customizedFolder, req }, onUpload) => {

        /*************IMPORTANTE**************: HAY QUE TENER el mainFolder PREVIAMENTE CREADO EN server/media*/

        const pathToHandle = `./media/${mainFolder}/${customizedFolder}`;
        const form = new formidable.IncomingForm();

        form.parse(req, async function (err, fields, files) {

            try {

                let error;
                const filesize = files.myImage.size;
                const filename = files.myImage.originalFilename;

                const allowedFileTypes = [".png", ".jpeg", ".jpg", ".gif", ".svg"];

                if (((filesize) / 1024) / 1024 > 2) error = "El tamaño máximo de la imágen debe ser de 2MB";
                if (!allowedFileTypes.includes(pathDep.extname(filename))) error = "Las extensiones permitidas son .png,.jpeg,.jpg,.gif,.svg";

                if (error) {
                    onUpload(error, null);
                    return;
                };


                const randomFilename = new FileHandler().getRandomName(filename);
                const temporalPath = files.myImage.filepath;
                const newPath = pathDep.join(__dirname, "..", "media", mainFolder, customizedFolder, randomFilename);


                await new FileHandler().deleteAllDirectoryFiles(pathToHandle)
                await new FileHandler().createDirectory(pathToHandle);


                fs.rename(temporalPath, newPath, (err) => {
                    onUpload(err, randomFilename);
                });
            }
            catch (err) {
                onUpload("Archivo no válido", null);

            }

        });

    };
}

module.exports = new FileHandler();
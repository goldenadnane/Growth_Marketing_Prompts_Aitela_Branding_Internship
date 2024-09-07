import { NextApiHandler, NextApiRequest } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';

export const config = {
    api: {
        bodyParser: false,
    },
};

const deleteFileByName = async (filename: string) => {
    const filePath = path.join(process.cwd(), '/public', '/assets', '/uploads', filename);
    try {
        // Check if the file exists
        await fs.access(filePath, fs.constants.F_OK);

        await fs.unlink(filePath); // Delete the file
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // Handle the case where the file does not exist (no action needed)
            console.log(`File ${filename} does not exist.`);
        } else {
            // Handle other errors
            console.error(`Error deleting file ${filename}: ${error}`);
            throw error;
        }
    }
};

const readFile = (req: NextApiRequest, saveLocally?: boolean): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const options: formidable.Options = {};
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), '/public/assets/uploads');

        options.filename = (name, ext, path, form) => {
            return '' + path.originalFilename;
        };
    }
    //options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);

            resolve({ fields, files });
        });
    });
};

const handler: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await fs.readdir(path.join(process.cwd() + '/public', '/assets', '/uploads'));
        } catch (error) {
            await fs.mkdir(path.join(process.cwd() + '/public', '/assets', '/uploads'));
        }
        const { fields, files } = await readFile(req, true);

        if (files.Myimage && fields.oldImage) {
            const uploadedFileName = files.Myimage;
            const olderFileName = fields.oldImage[0]; // Assuming you send the old file name in the request's fields

            // Delete the older file if it exists
            if (olderFileName) {
                await deleteFileByName(olderFileName);
            }

            res.json({ message: `Uploaded file: ${uploadedFileName}` });
        } else {
            res.json({ done: 'ok' });
        }
    } else {
        // Extract the filename to delete from the request body or query parameters
        const filename = req.body?.filename || req.query?.filename;

        if (!filename) {
            res.status(400).json({ error: 'Filename is missing.' });
            return;
        }

        await deleteFileByName(filename);
    }
};

export default handler;

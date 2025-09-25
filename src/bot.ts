import ffmpeg from 'fluent-ffmpeg';

import {PrismaClient} from "@prisma/client";

import {readFile, rm, writeFile} from 'node:fs/promises';
import {Buffer} from 'node:buffer';

import {checkAndRecreateUploadDir, createBotWithToken, getFileName, setEnvMode} from './utils';
import {FILE_EXTENSIONS} from './consts';

const prisma = new PrismaClient();

setEnvMode()

const bot = createBotWithToken()

bot.start(async (ctx, next) => {
    const telegramId = String(ctx.message?.from?.id);

    const user = await prisma.user.findUnique({where: {telegramId}})
    if (!user)
        await prisma.user.create({data: {telegramId}});

    await next()
})

bot.on('voice', async ctx => {
    // get file from telegram server
    const fileId = ctx.update.message.voice.file_id;
    const fileLink = await bot.telegram.getFileLink(fileId);
    const file = await fetch(fileLink)

    const ogaPath = getFileName({fileExt: FILE_EXTENSIONS.oga, fileId})
    const mp3Path = getFileName({
        fileExt: FILE_EXTENSIONS.mp3, fileId
    })


    // save file for convert
    const buffer = await file.arrayBuffer()
    await writeFile(ogaPath, Buffer.from(buffer))

    // create process
    const process = ffmpeg(ogaPath)

    // set output
    process.output(mp3Path)

    // finish handler
    process.on('end', async () => {

        const mp3 = await readFile(mp3Path)

        ctx.replyWithAudio({source: mp3})

        await rm(ogaPath)
        await rm(mp3Path)
    })

    // error handler
    process.on('error', (err) => {
        console.log(
            'An error occurred: ' + err.message
        );
    })

    // start process
    process.run()
});

bot.launch(async () => {
    console.log(
        'Bot started...'
    );
    checkAndRecreateUploadDir()
})
    .then(async () => await prisma.$disconnect())
    .catch(async e => {
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })

import ffmpeg from 'fluent-ffmpeg';

import { writeFile, readFile, rm } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import { checkAndRecreateUploadDir, createBotWithToken, getFileName, setEnvMode } from './utils';
import { FILE_EXTENSIONS } from './consts';

setEnvMode()

const bot = createBotWithToken()

bot.on('voice', async ctx => {
  // get file from telegram server
  const fileId = ctx.update.message.voice.file_id;
  const fileLink = await bot.telegram.getFileLink(fileId);
  const file = await fetch(fileLink)

  const ogaPath = getFileName({ fileExt: FILE_EXTENSIONS.oga, fileId })
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

    ctx.replyWithAudio({ source: mp3 })

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
    'Bot started'
  );

  checkAndRecreateUploadDir()
});

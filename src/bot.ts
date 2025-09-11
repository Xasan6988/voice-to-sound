import { Telegraf } from 'telegraf';
import ffmpeg from 'fluent-ffmpeg';
import dotenv from 'dotenv';

import { writeFile, readFile, rmdir, mkdir, access } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import { getFileName } from './utils';
import { FILE_EXTENSIONS, NODE_ENV, UPLOAD_URL } from './consts';


switch (process.env.NODE_ENV) {
  case NODE_ENV.PROD:
    dotenv.config({
      path: './.production.env',
    })
    break;
  default:
    dotenv.config({
      path: './.development.env',
    })
}


const BOT_TOKEN = process.env.BOT_TOKEN || '';

if (!BOT_TOKEN) {
  console.log('Please set BOT_TOKEN env variable')
  process.exit(1)
}

const bot = new Telegraf(BOT_TOKEN);

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

  try {
    const isNeedRecreateUploadFolder = await access(UPLOAD_URL).then(() => true).catch(() => false);

    if (isNeedRecreateUploadFolder) {
      await rmdir(UPLOAD_URL)
      console.log('Upload folder cleared')
    };

    await mkdir(UPLOAD_URL)
    console.log('New upload folder created')
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
});

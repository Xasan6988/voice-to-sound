import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'

import { rmdir, mkdir, access } from 'node:fs/promises';

import { NODE_ENV, UPLOAD_URL } from './consts'
import { Utils } from './types'

export const getFileName = ({ fileExt, fileId }: Utils.IGetFileNameArgs): string => `${UPLOAD_URL}/${fileId}.${fileExt}`

// set env file based on NODE_ENV (check package.json scripts)
export const setEnvMode = () => {
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
}

// create bot instance based on BOT_TOKEN env variable
export const createBotWithToken = () => {
  const BOT_TOKEN = process.env.BOT_TOKEN || '';

  if (!BOT_TOKEN) {
    console.log('Please set BOT_TOKEN env variable')
    process.exit(1)
  }

  return new Telegraf(BOT_TOKEN);
}


export const checkAndRecreateUploadDir = async () => {
  try {
    const isNeedRecreateUploadFolder = await access(UPLOAD_URL).then(() => true).catch(() => false);

    if (isNeedRecreateUploadFolder) {
      await rmdir(UPLOAD_URL, { recursive: true });
      console.log('Upload folder cleared')
    };

    await mkdir(UPLOAD_URL)
    console.log('New upload folder created')
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

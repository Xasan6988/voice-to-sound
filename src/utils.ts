import { UPLOAD_URL } from './consts'
import { Utils } from './types'

export const getFileName = ({ fileExt, fileId }: Utils.IGetFileNameArgs): string => `${UPLOAD_URL}/${fileId}.${fileExt}`


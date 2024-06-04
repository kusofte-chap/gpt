import { CHAT_MODEL } from "./common"

export enum CHAT_ROLE {
    USER = 'user',
    ASSISTANT = 'assistant'
}

export enum CHAT_STATUS {
    IN_PROGRESS = 'in_progress',
    FINISHED_SUCCESSFULLY = 'finished_successfully',
    FINISHED = 'finished'
}

export enum MESSAGE_TYPE {
    TITLE_GENERATION = 'title_generation',
    TEXT = 'text',
    IMAGE = 'image'
}

export interface IStreamItem {
    message:{
        message_id: string
        content: {
            contentType: string
            parts: string[]
        }
        role: CHAT_ROLE
        status: CHAT_STATUS
    }
    conversation_id: string
}

export interface IRecordStreamItem {
    message_id: string
    content: {
        contentType: string
        parts: string[]
    }
    role: CHAT_ROLE
}

export interface ICreateChatItem {
    type: MESSAGE_TYPE
    title:string
}

export interface IGImageItem {
    "createTime": string,
    "model": CHAT_MODEL,
    "originalUrl": string,
    "prompt": string,
    "thumbUrl": string
}
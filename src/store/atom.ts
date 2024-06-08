import { CHAT_MODEL } from '@/interface/common';
import { IUser } from '@/interface/user';
import { DefaultValue, atom } from 'recoil';

// const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
//     const savedValue = window.localStorage.getItem(key);
//     if (savedValue != null) {
//       setSelf(JSON.parse(savedValue));
//     }
  
//     onSet((newValue: any) => {
//       if (newValue instanceof DefaultValue) {
//         window.localStorage.removeItem(key);
//       } else {
//         window.localStorage.setItem(key, JSON.stringify(newValue));
//       }
//     });
//   };

  
export const userInfoState = atom({
    key: 'gpt-user-info-key',
    default: null as IUser | null,
  });
  

  export const currentChatModelState = atom({
    key: 'gpt-selected-model-key',
    default: CHAT_MODEL.GPT_3_5_TURBO as CHAT_MODEL,
    // effects_UNSTABLE: [localStorageEffect('gpt-selected-model-key')],
  })
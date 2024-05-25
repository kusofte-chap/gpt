import { IUser } from '@/interface/user';
import { DefaultValue, atom } from 'recoil';

const localStorageEffect = (key: string) => ({ setSelf, onSet }: any) => {
    const savedValue = sessionStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
  
    onSet((newValue: any) => {
      if (newValue instanceof DefaultValue) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

  
export const userInfoState = atom({
    key: 'gpt-user-info-key',
    default: null as IUser | null,
    effects_UNSTABLE: [localStorageEffect('gpt-user-info-key')],
  });
  
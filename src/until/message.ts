import { enqueueSnackbar } from 'notistack';
const snackbar = (
  msg: string,
  type: 'success' | 'error' | 'info' | 'default' | 'warning' | undefined,
) => {
  enqueueSnackbar(msg, {
    variant: type,
    autoHideDuration: 1500,
    anchorOrigin: {
      horizontal: 'center',
      vertical: 'top',
    },
  });
};

const toast = {
  success: (msg: string) => {
    snackbar(msg, 'success');
  },
  warning: (msg: string) => {
    snackbar(msg, 'warning');
  },
  info: (msg: string) => {
    snackbar(msg, 'info');
  },
  error: (msg: string, options?: any) => {
    snackbar(msg, 'error');
  },
};

export default toast;

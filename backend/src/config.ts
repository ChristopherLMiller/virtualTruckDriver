import Store from 'electron-store';

const configDefault = {
  port: 3000,
  password: 'test',
};

export const config = new Store({
  defaults: configDefault,
});

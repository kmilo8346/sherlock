import AsyncStorage from '@react-native-async-storage/async-storage';
import { IJwtPayload, IJwtToken } from '@sherlock/models';
import { jwtDecode } from 'jwt-decode';
import Bootable from './Bootable';
import { streamer } from './EventStreamer';

const AUTH_KEY = '@AUTH';

interface IState {
  auth: IJwtToken;
  user: IJwtPayload;
}

class Authenticator extends Bootable {
  private state: IState | null;

  constructor() {
    super();
    this.state = null;
  }

  async boot(): Promise<void> {
    const auth = await this.getAuthFromStorage();
    if (auth !== null) {
      const user = jwtDecode<IJwtPayload>(auth.access_token);
      this.state = { auth, user };
    }
  }

  async getAuthFromStorage(): Promise<IJwtToken | null> {
    const value = await AsyncStorage.getItem(AUTH_KEY);
    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  }

  async signIn(auth: IJwtToken): Promise<void> {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(auth));

    const user = jwtDecode<IJwtPayload>(auth.access_token);

    this.state = {
      auth,
      user,
    };

    streamer.emit('USER:LOGGED_IN', user);
  }

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);

    this.state = null;

    streamer.emit('USER:LOGGED_OUT');
  }

  isAuthenticated(): boolean {
    return this.state !== null;
  }

  getUserInfo(): IJwtPayload {
    if (this.state === null) {
      throw new Error('User is not authenticated');
    }

    return this.state.user;
  }
}

export const authenticator = new Authenticator();

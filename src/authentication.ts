import {ServiceAddons, Params} from '@feathersjs/feathers';
import {AuthenticationService, JWTStrategy} from '@feathersjs/authentication';
import {LocalStrategy} from '@feathersjs/authentication-local';
import {expressOauth, OAuthStrategy, OAuthProfile} from '@feathersjs/authentication-oauth';

import {Application} from './declarations';

declare module './declarations' {
  // eslint-disable-next-line no-unused-vars
  interface ServiceTypes {
    'authentication': AuthenticationService & ServiceAddons<any>;
  }
}

class GithubStrategy extends OAuthStrategy {
  async getEntityData(profile: OAuthProfile, existing: any, params: Params) {
    const baseData = await super.getEntityData(profile, existing, params);
    return {
      ...baseData,
      name: profile.login,
      avatar: profile.avatar_url,
      email: profile.email,
    };
  }
}

export default function(app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('github', new GithubStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
}

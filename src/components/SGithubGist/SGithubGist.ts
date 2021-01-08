/**
* Hey!
*
* SGithubGist component used for Github Gists social network
* @link https://gist.github.com/
*/

import Vue, {
  CreateElement, VNode, VueConstructor,
} from 'vue';
import BaseSocial, { TBaseSocialMixin } from '@/mixins/BaseSocial/BaseSocial';

const GITHUB_LINK_TYPES = {
  gist: 'gist',
  star: 'star',
  fork: 'fork',
  download: 'download',
};

export type TSGithubLinkType = typeof GITHUB_LINK_TYPES[keyof typeof GITHUB_LINK_TYPES];

/**
* Share parameters for link
*/
export interface ISGithubGistShareOptions {
  username: string;
  gistId: string;
  type: TSGithubLinkType;
}

export default /* #__PURE__ */ (Vue as VueConstructor<Vue & InstanceType<TBaseSocialMixin<ISGithubGistShareOptions>>>).extend({
  name: 'SGithubGist',

  mixins: [BaseSocial<ISGithubGistShareOptions>()],

  computed: {
    networkURL(): string {
      const BASE_URL = 'https://gist.github.com/';
      const { shareOptions } = this;
      const { username, gistId, type } = shareOptions;

      switch (type) {
        case GITHUB_LINK_TYPES.fork:
          return `${BASE_URL}${username}/${gistId}/forks`;
        case GITHUB_LINK_TYPES.star:
          return `${BASE_URL}${username}/${gistId}/stargazers`;
        case GITHUB_LINK_TYPES.download:
          return `${BASE_URL}${username}/${gistId}/archive/master.zip`;
        case GITHUB_LINK_TYPES.gist:
        default:
          return `${BASE_URL}${username}/${gistId}`;
      }
    },
  },

  render(h: CreateElement): VNode {
    return this.generateComponent(h, this.networkURL, 'Github Gists');
  },
});

/**
 * Hey!
 *
 * SBlogger component used for Blogger social network
 * @link https://www.blogger.com/
 * @example https://www.blogger.com/blog-this.g?u=https%3A%2F%2Fgithub.com%2F&t=Text&n=Title/
 */

import Vue, {
  CreateElement, VNode, VueConstructor,
} from 'vue';
import BaseSocial, { TBaseSocialMixin } from '@/mixins/BaseSocial/BaseSocial';
import getSerialisedParams from '@/utils/getSerialisedParams';

/**
 * Share parameters for link
 * @link https://stackoverflow.com/a/22583473/13374604
 * url => u
 * title => n
 * text => t
 */
export interface ISBloggerShareOptions {
  url?: string;
  title?: string;
  text?: string;
}

export default /* #__PURE__ */ (Vue as VueConstructor<Vue & InstanceType<TBaseSocialMixin<ISBloggerShareOptions>>>).extend({
  name: 'SBlogger',

  mixins: [BaseSocial<ISBloggerShareOptions>(
    'Blogger',
    undefined,
    undefined,
    undefined,
    true,
  )],

  computed: {
    networkURL(): string {
      const BASE_URL = 'https://www.blogger.com/blog-this.g';
      const { shareOptions } = this;
      const { url, title, text } = shareOptions;

      const serialisedParams = getSerialisedParams({
        u: url,
        t: text,
        n: title,
      });

      return `${BASE_URL}${serialisedParams}`;
    },
  },

  render(h: CreateElement): VNode {
    return this.generateComponent(h, this.networkURL);
  },
});

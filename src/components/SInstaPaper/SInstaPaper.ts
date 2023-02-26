/**
 * Hey!
 *
 * SInstaPaper component used for InstaPaper  social network
 * @link http://www.instapaper.com/
 */

import Vue, {
  CreateElement, VNode, VueConstructor,
} from 'vue';
import BaseSocial, { TBaseSocialMixin } from '@/mixins/BaseSocial/BaseSocial';
import getSerialisedParams from '@/utils/getSerialisedParams';

/**
 * Share parameters for link
 */
export interface ISInstaPaperShareOptions {
  url: string;
  title?: string;
  description?: string;
}

export default /* #__PURE__ */ (Vue as VueConstructor<Vue & InstanceType<TBaseSocialMixin<ISInstaPaperShareOptions>>>).extend({
  name: 'SInstaPaper',

  mixins: [BaseSocial<ISInstaPaperShareOptions>(
    'InstaPaper',
    {
      width: 600,
      height: 600,
    },
  )],

  computed: {
    networkURL(): string {
      const BASE_URL = 'http://www.instapaper.com/edit';
      const { shareOptions } = this;
      const { url, title, description } = shareOptions;

      const serialisedParams = getSerialisedParams({
        url,
        title,
        description,
      });

      return `${BASE_URL}${serialisedParams}`;
    },
  },

  render(h: CreateElement): VNode {
    return this.generateComponent(h, this.networkURL);
  },
});

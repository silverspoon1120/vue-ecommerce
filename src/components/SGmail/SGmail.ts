/**
 * Hey!
 *
 * SGmail component used for sending Email via GMail
 * @link https://mail.google.com/
 * @example https://mail.google.com/mail/u/0/?view=cm&to=google@gmail.com&su=Title&subject=Subject&body=Hello%0AWorld&cc=google1@gmail.com&bcc=google2@gmail.com&fs=1&tf=1
 */

import Vue, {
  CreateElement, VNode,
  VueConstructor,
} from 'vue';
import getSerialisedParams from '@/utils/getSerialisedParams';
import BaseSocial, { TBaseSocialMixin } from '@/mixins/BaseSocial/BaseSocial';

/**
 * Share parameters for link
 */
export interface ISGmailShareOptions {
  to: string;
  su?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

export default /* #__PURE__ */(Vue as VueConstructor<Vue & InstanceType<TBaseSocialMixin<ISGmailShareOptions>>>).extend({
  name: 'SGmail',

  mixins: [BaseSocial<ISGmailShareOptions>(
    'Gmail',
  )],

  computed: {
    networkURL(): string {
      const BASE_URL = 'https://mail.google.com/mail/';
      const { shareOptions } = this;
      const {
        to, su, body, cc, bcc,
      } = shareOptions;
      const serialisedParams = getSerialisedParams({
        view: 'cm',
        to,
        su,
        body,
        cc,
        bcc,
      });

      return `${BASE_URL}${serialisedParams}`;
    },
  },

  render(h: CreateElement): VNode {
    return this.generateComponent(h, this.networkURL);
  },
});

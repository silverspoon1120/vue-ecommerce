import { Story } from '@storybook/vue3';
import { action } from '@storybook/addon-actions';
import { TBaseSocialPropsOptions } from '@/mixins/BaseSocial/BaseSocial';
import SEvernote, { ISEvernoteShareOptions } from '../SEvernote';
import SEvernoteMDX from './SEvernote.mdx';

export default {
  title: 'Share/SEvernote',
  component: SEvernote,
  parameters: {
    docs: {
      page: SEvernoteMDX,
    },
  },
};

const Template: Story<TBaseSocialPropsOptions<ISEvernoteShareOptions>> = (args) => ({
  components: { SEvernote },

  setup() {
    const onClose = action('emit close');
    const onOpen = action('emit open');
    const onBlock = action('emit block');
    const onFocus = action('emit focus');

    return {
      args,
      onClose,
      onOpen,
      onBlock,
      onFocus,
    };
  },

  template: `
    <s-evernote
      class="base-social"
      v-bind="args"
      @popup-close="onClose"
      @popup-open="onOpen"
      @popup-block="onBlock"
      @popup-focus="onFocus"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 32 32" fill="#000000" aria-hidden="true" focusable="false">
        <path d="M29.343 16.818c.1 1.695-.08 3.368-.305 5.045-.225 1.712-.508 3.416-.964 5.084-.3 1.067-.673 2.1-1.202 3.074-.65 1.192-1.635 1.87-2.992 1.924l-3.832.036c-.636-.017-1.278-.146-1.9-.297-1.192-.3-1.862-1.1-2.06-2.3-.186-1.08-.173-2.187.04-3.264.252-1.23 1-1.96 2.234-2.103.817-.1 1.65-.077 2.476-.1.205-.007.275.098.203.287-.196.53-.236 1.07-.098 1.623.053.207-.023.307-.26.305a7.77 7.77 0 0 0-1.123.053c-.636.086-.96.47-.96 1.112 0 .205.026.416.066.622.103.507.45.78.944.837 1.123.127 2.247.138 3.37-.05.675-.114 1.08-.54 1.16-1.208.152-1.3.155-2.587-.228-3.845-.33-1.092-1.006-1.565-2.134-1.7l-3.36-.54c-1.06-.193-1.7-.887-1.92-1.9-.13-.572-.14-1.17-.214-1.757-.013-.106-.074-.208-.1-.3-.04.1-.106.212-.117.326-.066.68-.053 1.373-.185 2.04-.16.8-.404 1.566-.67 2.33-.185.535-.616.837-1.205.8a37.76 37.76 0 0 1-7.123-1.353l-.64-.207c-.927-.26-1.487-.903-1.74-1.787l-1-3.853-.74-4.3c-.115-.755-.2-1.523-.083-2.293.154-1.112.914-1.903 2.04-1.964l3.558-.062c.127 0 .254.003.373-.026a1.23 1.23 0 0 0 1.01-1.255l-.05-3.036c-.048-1.576.8-2.38 2.156-2.622a10.58 10.58 0 0 1 4.91.26c.933.275 1.467.923 1.715 1.83.058.22.146.3.37.287l2.582.01 3.333.37c.686.095 1.364.25 2.032.42 1.165.298 1.793 1.112 1.962 2.256l.357 3.355.3 5.577.01 2.277zm-4.534-1.155c-.02-.666-.07-1.267-.444-1.784a1.66 1.66 0 0 0-2.469-.15c-.364.4-.494.88-.564 1.4-.008.034.106.126.16.126l.8-.053c.768.007 1.523.113 2.25.393.066.026.136.04.265.077zM8.787 1.154a3.82 3.82 0 0 0-.278 1.592l.05 2.934c.005.357-.075.45-.433.45L5.1 6.156c-.583 0-1.143.1-1.554.278l5.2-5.332c.02.013.04.033.06.053z"/>
      </svg>
    </s-evernote>
`,
});

export const Default = Template.bind({});
Default.args = {
  windowFeatures: {
    width: 800,
    height: 560,
  },
  shareOptions: {
    url: 'https://github.com/',
    title: 'Title',
  },
  useNativeBehavior: false,
};

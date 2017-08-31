/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import util from '../../ons/util';
import platform from '../../ons/platform';
import internal from '../../ons/internal';
import autoStyle from '../../ons/autostyle';
import Swiper from '../../ons/internal/swiper';
import ModifierUtil from '../../ons/internal/modifier-util';
import BaseElement from '../base/base-element';
import TabElement from '../ons-tab';
import contentReady from '../../ons/content-ready';

const scheme = {
  '.tabbar__content': 'tabbar--*__content',
  '.tabbar__border': 'tabbar--*__border',
  '.tabbar': 'tabbar--*'
};

const rewritables = {
  /**
   * @param {Element} tabbarElement
   * @param {Function} callback
   */
  ready(tabbarElement, callback) {
    callback();
  }
};

const nullPage = internal.nullElement;
const lerp = (x0, x1, t) => (1 - t) * x0 + t * x1;

/**
 * @element ons-tabbar
 * @category tabbar
 * @description
 *   [en]A component to display a tab bar on the bottom of a page. Used with `<ons-tab>` to manage pages using tabs.[/en]
 *   [ja]タブバーをページ下部に表示するためのコンポーネントです。ons-tabと組み合わせて使うことで、ページを管理できます。[/ja]
 * @codepen pGuDL
 * @tutorial vanilla/Reference/tabbar
 * @modifier material
 *   [en]A tabbar in Material Design.[/en]
 *   [ja][/ja]
 * @modifier autogrow
 *   [en]Tabs automatically grow depending on their content instead of having a fixed width.[/en]
 *   [ja][/ja]
 * @modifier top-border
 *   [en]Shows a static border-bottom in tabs for iOS top tabbars.[/en]
 *   [ja][/ja]
 * @guide multiple-page-navigation
 *  [en]Managing multiple pages.[/en]
 *  [ja]Managing multiple pages[/ja]
 * @guide templates
 *   [en]Defining multiple pages in single html[/en]
 *   [ja]複数のページを1つのHTMLに記述する[/ja]
 * @seealso ons-tab
 *   [en]The `<ons-tab>` component.[/en]
 *   [ja]ons-tabコンポーネント[/ja]
 * @seealso ons-page
 *   [en]The `<ons-page>` component.[/en]
 *   [ja]ons-pageコンポーネント[/ja]
 * @example
 * <ons-tabbar>
 *   <ons-tab
 *     page="home.html"
 *     label="Home"
 *     active>
 *   </ons-tab>
 *   <ons-tab
 *     page="settings.html"
 *     label="Settings"
 *     active>
 *   </ons-tab>
 * </ons-tabbar>
 *
 * <ons-template id="home.html">
 *   ...
 * </ons-template>
 *
 * <ons-template id="settings.html">
 *   ...
 * </ons-template>
 */
export default class TabbarElement extends BaseElement {

  /**
   * @event prechange
   * @description
   *   [en]Fires just before the tab is changed.[/en]
   *   [ja]アクティブなタブが変わる前に発火します。[/ja]
   * @param {Object} event
   *   [en]Event object.[/en]
   *   [ja]イベントオブジェクト。[/ja]
   * @param {Number} event.index
   *   [en]Current index.[/en]
   *   [ja]現在アクティブになっているons-tabのインデックスを返します。[/ja]
   * @param {Object} event.tabItem
   *   [en]Tab item object.[/en]
   *   [ja]tabItemオブジェクト。[/ja]
   * @param {Function} event.cancel
   *   [en]Call this function to cancel the change event.[/en]
   *   [ja]この関数を呼び出すと、アクティブなタブの変更がキャンセルされます。[/ja]
   */

  /**
   * @event postchange
   * @description
   *   [en]Fires just after the tab is changed.[/en]
   *   [ja]アクティブなタブが変わった後に発火します。[/ja]
   * @param {Object} event
   *   [en]Event object.[/en]
   *   [ja]イベントオブジェクト。[/ja]
   * @param {Number} event.index
   *   [en]Current index.[/en]
   *   [ja]現在アクティブになっているons-tabのインデックスを返します。[/ja]
   * @param {Object} event.tabItem
   *   [en]Tab item object.[/en]
   *   [ja]tabItemオブジェクト。[/ja]
   */

  /**
   * @event reactive
   * @description
   *   [en]Fires if the already open tab is tapped again.[/en]
   *   [ja]すでにアクティブになっているタブがもう一度タップやクリックされた場合に発火します。[/ja]
   * @param {Object} event
   *   [en]Event object.[/en]
   *   [ja]イベントオブジェクト。[/ja]
   * @param {Number} event.index
   *   [en]Current index.[/en]
   *   [ja]現在アクティブになっているons-tabのインデックスを返します。[/ja]
   * @param {Object} event.tabItem
   *   [en]Tab item object.[/en]
   *   [ja]tabItemオブジェクト。[/ja]
   */

  /**
   * @attribute animation
   * @type {String}
   * @default none
   * @description
   *   [en]If this attribute is set to `"none"` the transitions will not be animated.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute animation-options
   * @type {Expression}
   * @description
   *  [en]Specify the animation's duration, timing and delay with an object literal. E.g. `{duration: 0.2, delay: 1, timing: 'ease-in'}`.[/en]
   *  [ja]アニメーション時のduration, timing, delayをオブジェクトリテラルで指定します。e.g. {duration: 0.2, delay: 1, timing: 'ease-in'}[/ja]
   */

  /**
   * @attribute position
   * @initonly
   * @type {String}
   * @default bottom
   * @description
   *   [en]Tabbar's position. Available values are `"bottom"` and `"top"`. Use `"auto"` to choose position depending on platform (iOS bottom, Android top).[/en]
   *   [ja]タブバーの位置を指定します。"bottom"もしくは"top"を選択できます。デフォルトは"bottom"です。[/ja]
   */

  /**
   * @attribute swipeable
   * @description
   *   [en]If this attribute is set the tab bar can be scrolled by drag or swipe.[/en]
   *   [ja]この属性がある時、タブバーをスワイプやドラッグで移動できるようになります。[/ja]
   */

  /**
   * @attribute tab-border
   * @description
   *   [en]If this attribute is set the tabs show a dynamic bottom border. Only works for iOS since the border is always visible in Material Design.[/en]
   *   [ja][/ja]
   */

  /**
   * @attribute modifier
   * @type {String}
   * @description
   *   [en]The appearance of the tabbar.[/en]
   *   [ja]タブバーの表現を指定します。[/ja]
   */

  constructor() {
    super();
    contentReady(this, () => this._compile());
  }

  connectedCallback() {
    if (!this._swiper) {
      this._swiper = new Swiper({
        getElement: () => this._contentElement,
        getInitialIndex: () => this.getAttribute('activeIndex'),
        getAutoScrollRatio: () => .2,
        isAutoScrollable: () => true,
        preChangeHook: this._onPreChange.bind(this),
        postChangeHook: this._onPostChange.bind(this),
        refreshHook: this._onRefresh.bind(this),
        scrollHook: this._onScroll.bind(this)
      });

      this._onRefresh();

      contentReady(this, () => this._swiper.init({ swipeable: this.hasAttribute('swipeable') }));
    }

    contentReady(this, () => this._updatePosition());
  }

  disconnectedCallback() {
    if (this._swiper && this._swiper.initialized) {
      this._swiper.dispose();
      this._swiper = null;
      this._tabbarBorder = null;
      this._tabsRect = null;
    }
  }

  _normalizeEvent(event) {
    return { ...event, index: event.activeIndex, tabItem: this.tabs[event.activeIndex] };
  }

  _onPostChange(event) {
    event = this._normalizeEvent(event);
    util.triggerElementEvent(this, 'postchange', event);
    const page = event.tabItem.pageElement;
    page && page._show();
  }

  _onPreChange(event) {
    event = this._normalizeEvent(event);

    let canceled = false;
    util.triggerElementEvent(this, 'prechange', { ...event, cancel: () => canceled = true });

    if (!canceled) {
      const { activeIndex, lastActiveIndex } = event;
      const tabs = this.tabs;

      tabs[activeIndex].setActive(true);
      if (lastActiveIndex >= 0) {
        const prevTab = tabs[lastActiveIndex];
        prevTab.setActive(false);
        prevTab.pageElement && prevTab.pageElement._hide();
      }
    }

    return canceled
  }

  _onScroll(index, options = {}) {
    this._tabbarBorder.style.transition = `all ${options.duration || 0}s ${options.timing || ''}`;

    if (this._autogrow) {
      const a = Math.floor(index), b = Math.ceil(index), r = index % 1;
      this._tabbarBorder.style.width = lerp(this._tabsRect[a].width, this._tabsRect[b].width, r) + 'px';
      this._tabbarBorder.style.transform = `translate3d(${lerp(this._tabsRect[a].left, this._tabsRect[b].left, r)}px, 0, 0)`;
    } else {
      this._tabbarBorder.style.transform = `translate3d(${index * 100}%, 0, 0)`;
    }

    this._onSwipe && this._onSwipe(index, options);
  }

  _onRefresh() {
    this._autogrow = util.hasModifier(this, 'autogrow');
    this._tabsRect = this.tabs.map(tab => tab.getBoundingClientRect());
    this._tabbarBorder.style.width = this._tabsRect[this.getActiveTabIndex()].width + 'px';
    this._tabbarBorder.style.display = this.hasAttribute('tab-border') || platform.isAndroid() ? 'block' : 'none';
  }

  get _tabbarElement() {
    return util.findChild(this, '.tabbar');
  }

  get _contentElement() {
    return util.findChild(this, '.tabbar__content');
  }

  get _targetElement() {
    const content = this._contentElement;
    return content && content.children[0] || null;
  }

  _compile() {
    autoStyle.prepare(this);

    const content = this._contentElement || util.create('.tabbar__content');
    content.classList.add('ons-tabbar__content');
    const tabbar = this._tabbarElement || util.create('.tabbar');
    tabbar.classList.add('ons-tabbar__footer');

    if (!tabbar.parentNode) {
      while (this.firstChild) {
        tabbar.appendChild(this.firstChild);
      }
    }

    const activeIndex = Number(this.getAttribute('activeIndex')); // 0 by default
    if (tabbar.children.length > activeIndex && !util.findChild(tabbar, '[active]')) {
      tabbar.children[activeIndex].setAttribute('active', '');
    }

    this._tabbarBorder = util.create('.tabbar__border');
    tabbar.appendChild(this._tabbarBorder);
    tabbar.classList.add('ons-swiper-tabbar'); // Hides material border

    !content.children[0] && content.appendChild(document.createElement('div'));
    content.appendChild = content.appendChild.bind(content.children[0]);
    content.insertBefore = content.insertBefore.bind(content.children[0]);

    this.appendChild(content);
    this.appendChild(tabbar); // Triggers ons-tab connectedCallback

    ModifierUtil.initModifier(this, scheme);
  }

  _updatePosition(position = this.getAttribute('position')) {
    const top = this._top = position === 'top' || (position === 'auto' && platform.isAndroid());
    const action = top ? util.addModifier : util.removeModifier;

    action(this, 'top');

    const page = util.findParent(this, 'ons-page');
    if (page) {
      contentReady(page, () => {
        this.style.top = top ? window.getComputedStyle(page._getContentElement(), null).getPropertyValue('padding-top') : '';

        if (page.children[0] && util.match(page.children[0], 'ons-toolbar')) {
          action(page.children[0], 'noshadow');
        }
      });
    }

    internal.autoStatusBarFill(() => {
      const filled = util.findParent(this, e => e.hasAttribute('status-bar-fill'));
      util.toggleAttribute(this, 'status-bar-fill', top && !filled);
    });
  }

  get topPage() {
    const tabs = this.tabs,
      index = this.getActiveTabIndex();
    return tabs[index]
      ? tabs[index].pageElement || this.pages[0] || null
      : null;
  }

  get pages() {
    return util.arrayFrom(this._targetElement.children);
  }

  get tabs() {
    return Array.prototype.filter.call(this._tabbarElement.children, e => e.tagName === 'ONS-TAB');
  }

  /**
   * @method setActiveTab
   * @signature setActiveTab(index, [options])
   * @param {Number} index
   *   [en]Tab index.[/en]
   *   [ja]タブのインデックスを指定します。[/ja]
   * @param {Object} [options]
   *   [en]Parameter object.[/en]
   *   [ja]オプションを指定するオブジェクト。[/ja]
   * @param {Function} [options.callback]
   *   [en]Function that runs when the new page has loaded.[/en]
   *   [ja][/ja]
   * @param {String} [options.animation]
   *   [en]If this option is "none", the transition won't slide.[/en]
   *   [ja][/ja]
   * @param {String} [options.animationOptions]
   *   [en]Specify the animation's duration, delay and timing. E.g. `{duration: 0.2, delay: 0.4, timing: 'ease-in'}`.[/en]
   *   [ja]アニメーション時のduration, delay, timingを指定します。e.g. {duration: 0.2, delay: 0.4, timing: 'ease-in'}[/ja]
   * @description
   *   [en]Show specified tab page. Animations and other options can be specified by the second parameter.[/en]
   *   [ja]指定したインデックスのタブを表示します。アニメーションなどのオプションを指定できます。[/ja]
   * @return {Promise}
   *   [en]A promise that resolves to the new page element.[/en]
   *   [ja][/ja]
   */
  setActiveTab(nextIndex, options = {}) {
    const prevIndex = this.getActiveTabIndex();
    const prevTab = this.tabs[prevIndex],
      nextTab = this.tabs[nextIndex];

    if (!nextTab) {
      return Promise.reject('Specified index does not match any tab.');
    }

    if (nextIndex === prevIndex) {
      util.triggerElementEvent(this, 'reactive', { index: nextIndex, activeIndex: nextIndex, tabItem: nextTab });
      return Promise.resolve(nextTab.pageElement);
    }

    // FIXME: nextTab.loaded is broken in Zone.js promises (Angular2)
    const nextPage = nextTab.pageElement;
    return (nextPage ? Promise.resolve(nextPage) : nextTab.loaded)
      .then(nextPage => this._swiper.setActiveIndex(nextIndex, {
        reject: true,
        ...options,
        animation: prevTab && nextPage ? options.animation || this.getAttribute('animation') : 'none',
        animationOptions: util.extend(
          { duration: .3, timing: 'cubic-bezier(.1, .7, .1, 1)' },
          this.hasAttribute('animation-options') ? util.animationOptionsParse(this.getAttribute('animation-options')) : {},
          options.animationOptions || {}
        )
      }).then(() => {
        options.callback instanceof Function && options.callback(nextPage);
        return nextPage;
      }));
  }

  /**
   * @method setTabbarVisibility
   * @signature setTabbarVisibility(visible)
   * @param {Boolean} visible
   * @description
   *   [en]Used to hide or show the tab bar.[/en]
   *   [ja][/ja]
   */
  setTabbarVisibility(visible) {
    this._contentElement.style[this._top ? 'top' : 'bottom'] = visible ? '' : '0px';
    this._tabbarElement.style.display = visible ? '' : 'none';
  }

  show() {
    this.setTabbarVisibility(true);
  }

  hide() {
    this.setTabbarVisibility(false);
  }

  /**
   * @property visible
   * @readonly
   * @type {Boolean}
   * @description
   *   [en]Whether the tabbar is visible or not.[/en]
   *   [ja]タブバーが見える場合に`true`。[/ja]
   */
  get visible() {
    return this._tabbarElement.style.display !== 'none';
  }

  /**
   * @property swipeable
   * @type {Boolean}
   * @description
   *   [en]Enable swipe interaction.[/en]
   *   [ja]swipeableであればtrueを返します。[/ja]
   */
  get swipeable() {
    return this.hasAttribute('swipeable');
  }

  set swipeable(value) {
    return util.toggleAttribute(this, 'swipeable', value);
  }

  /**
   * @property onSwipe
   * @type {Function}
   * @description
   *   [en]Hook called whenever the user slides the tabbar. It gets a decimal index and an animationOptions object as arguments.[/en]
   *   [ja][/ja]
   */
  get onSwipe() {
    return this._onSwipe;
  }

  set onSwipe(value) {
    if (!(value instanceof Function)) {
      throw new Error(`'onSwipe' must be a function.`)
    }
    this._onSwipe = value;
  }

  /**
   * @method getActiveTabIndex
   * @signature getActiveTabIndex()
   * @return {Number}
   *   [en]The index of the currently active tab.[/en]
   *   [ja]現在アクティブになっているタブのインデックスを返します。[/ja]
   * @description
   *   [en]Returns tab index on current active tab. If active tab is not found, returns -1.[/en]
   *   [ja]現在アクティブになっているタブのインデックスを返します。現在アクティブなタブがない場合には-1を返します。[/ja]
   */
  getActiveTabIndex() {
    for (let tabs = this.tabs, i = 0; i < tabs.length; i++) {
      if (tabs[i] instanceof TabElement && tabs[i].isActive()) {
        return i;
      }
    }
    return -1;
  }

  _show() {
    setImmediate(() => this.tabs[this.getActiveTabIndex()].loaded.then(el => el._show()))
  }

  _hide() {
    const topPage = this.topPage;
    topPage && topPage._hide();
  }

  _destroy() {
    const tabs = this.tabs;
    while (tabs[0]) {
      tabs[0].remove();
    }
    this.remove();
  }

  static get observedAttributes() {
    return ['modifier', 'position', 'swipeable', 'tab-border'];
  }

  attributeChangedCallback(name, last, current) {
    if (name === 'modifier') {
      ModifierUtil.onModifierChanged(last, current, this, scheme);
      const isTop = m => /(^|\s+)top($|\s+)/i.test(m);
      isTop(last) !== isTop(current) && this._updatePosition();
    } else if (name === 'position') {
      this._updatePosition();
    } else if (name === 'swipeable') {
      this._swiper && this._swiper.updateSwipeable(this.hasAttribute('swipeable'));
    }
  }

  static get rewritables() {
    return rewritables;
  }

  static get events() {
    return ['prechange', 'postchange', 'reactive'];
  }
}

customElements.define('ons-tabbar', TabbarElement);

'use babel';

import Url from 'url';
import { CompositeDisposable } from 'atom';
import Library from './library';
import provider from './provider';

let DocView = null;
let SearchView = null;

export default {
  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.library = new Library();

    this.lazyLoad();
    // Register command
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'element-helper:search-under-cursor': this.search.bind(this)
    }));

    this.subscriptions.add(atom.workspace.addOpener(this.opener.bind(this)));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  search() {
    if (editor = atom.workspace.getActiveTextEditor()) {
      const selectedText = editor.getSelectedText();
      const wordUnderCursor = editor.getWordUnderCursor({ includeNonWordCharacters: false });

      const items = this.library.queryAll();
      const queryText = selectedText ? selectedText : wordUnderCursor;

      new SearchView(queryText, items);
    }
  },

  opener(url) {
    if (Url.parse(url).protocol == 'element-docs:') {
      return new DocView(this.library, url);
    }
  },

  lazyLoad() {
    if (!SearchView) {
      SearchView = require('./search-view');
    }
    if (!DocView) {
      DocView = require('./document-view');
    }
  },

  provide() {
    return provider;
  }
};
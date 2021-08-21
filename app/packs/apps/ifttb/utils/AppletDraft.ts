export class AppletDraft {
  private draft: any;

  constructor() {
    this.draft = localStorage.getItem('_appletDraft');

    if (!Boolean(this.draft)) {
      this.draft = {
        title: '',
      };
    } else {
      try {
        this.draft = JSON.parse(this.draft);
      } catch {
        this.draft = { title: '' };
        this.save();
      }
    }
  }

  get() {
    return this.draft;
  }

  set(_draft: any) {
    this.draft = _draft;
    this.save();
  }

  save() {
    localStorage.setItem('_appletDraft', JSON.stringify(this.draft));
  }

  clear() {
    localStorage.removeItem('_appletDraft');
  }
}

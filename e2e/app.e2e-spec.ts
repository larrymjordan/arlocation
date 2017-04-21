import { ArlocationPage } from './app.po';

describe('arlocation App', () => {
  let page: ArlocationPage;

  beforeEach(() => {
    page = new ArlocationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

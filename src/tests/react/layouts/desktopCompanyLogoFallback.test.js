/**
 * @jest-environment node
 */
describe('desktop company logo HOME affordance (#807)', () => {
  test('DefaultLayout keeps center HOME control when company has no logo', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.join(__dirname, '../../../layouts/DefaultLayout.js'),
      'utf8',
    );
    expect(source).toMatch(/shouldRenderDesktopCompanyLogo = isDesktopWeb && !!currentCompany\?\.id/);
    expect(source).toMatch(/getUserInitials/);
    expect(source).toMatch(/headerCompanyLogoFallback/);
    expect(source).toMatch(/companyLogoSource \? \(/);
  });
});

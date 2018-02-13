describe("Nomination list", function() {
  const Nominations = require('../../model/NominationsList');
  const nominationsList = Nominations.create();
  let macth;

  it("should be able to export nominations", function() {
    expect(nominationsList).toBeDefined();
    expect(nominationsList.length).toBeGreaterThan(0);
  });

  it("should be able create new lsists", function() {
    const newList = Nominations.create();
    nominationsList.forEach(n => n.addPoint(1));
    newList.forEach(n => n.addPoint(null));
    expect(nominationsList).not.toEqual(newList);
  });

  nominationsList.forEach(nomination => {
    it("nomination should have name defined", function() {
      expect(nomination.getName()).toBeDefined();
    });

    it(nomination.getName() + " nomination should have msg defined ", function() {
      expect(nomination.getMessage()).toBeDefined();
    });

    it(nomination.getName() + " nomination should have condition defined ", function() {
      const condition = nomination.getCondition();
      expect(condition).toBeDefined();
      expect(condition).not.toThrow();
    });
  });
});

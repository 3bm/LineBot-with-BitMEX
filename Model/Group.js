class Group {
    constructor(groupLineId, rekt = false) {
        this.groupLineId = groupLineId;
        this.rekt = rekt;
    }

    ToggleRekt() {
        this.rekt = !this.rekt;
        return this.rekt;
    }
}

module.exports = Group;


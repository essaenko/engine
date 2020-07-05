export interface IClassStateTemplate {
  stats: {
    agile: number,
    strenght: number,
    intellegence: number,
    armor: number,
  },
  levelIncrease: {
    agile: number,
    strenght: number,
    intellegence: number,
  }
}

export const classes: Dict<IClassStateTemplate> = {
  warrior: {
    stats: {
      agile: 10,
      strenght: 15,
      intellegence: 8,
      armor: 5,
    },
    levelIncrease: {
      agile: 1,
      strenght: 2,
      intellegence: 1,
    }
  },
  hunter: {
    stats: {
      agile: 15,
      strenght: 8,
      intellegence: 10,
      armor: 3,
    },
    levelIncrease: {
      agile: 2,
      strenght: 1,
      intellegence: 1,
    }
  },
  mage: {
    stats: {
      agile: 10,
      strenght: 8,
      intellegence: 15,
      armor: 1,
    },
    levelIncrease: {
      agile: 1,
      strenght: 1,
      intellegence: 2,
    }
  },
  druid: {
    stats: {
      agile: 12,
      strenght: 12,
      intellegence: 6,
      armor: 3,
    },
    levelIncrease: {
      agile: 2,
      strenght: 2,
      intellegence: 1,
    }
  },
}
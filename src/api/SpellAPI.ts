import Spell, { School, CastingTime, Duration } from '../models/Spell';
import { Ability } from '../shared/Abilities';
import { AttackType } from '../shared/Attacks';
import { DamageType } from '../shared/DamageType';

export interface Query {
    attackTypes?: AttackType[];
    castingTime?: CastingTime[];
    classes?: string[];
    components?: {
        material?: boolean;
        somatic?: boolean;
        verbal?: boolean;
    },
    concentration?: boolean;
    conditions?: string[];
    damageTypes?: DamageType[];
    durations?: Duration[];
    levels?: number[];
    name?: string;
    ritual?: boolean;
    saveTypes?: Ability[];
    schools?: School[];
}

export default class SpellAPI {

    private spellByName = new Map<string, Spell>();
    private spellsByClass = new Map<string, string[]>();
    private spellsByLevel = new Map<number, string[]>();
    private spellsBySchool = new Map<School, string[]>();
    private spellsByAttackType = new Map<AttackType, string[]>();
    private spellsBySaveType = new Map<Ability, string[]>();
    private concentrationSpells = new Array<string>();
    private ritualSpells = new Array<string>();
    private spellsByCastingTime = new Map<CastingTime, string[]>();
    private materialSpells = new Array<string>();
    private somaticSpells = new Array<string>();
    private verbalSpells = new Array<string>();
    private spellsByDamageType = new Map<DamageType, string[]>();
    private spellsByConditionType = new Map<string, string[]>();
    private spellsByDuration = new Map<Duration, string[]>();

    constructor(spells: Spell[]) {
        spells.forEach((spell: Spell) => {
            const key = spell.name.toLowerCase()
            this.spellByName.set(key, spell);

            spell.classes.forEach((classType) => {
                let classArray = this.spellsByClass.get(classType.toLowerCase()) || [];
                classArray.push(key);
                this.spellsByClass.set(classType.toLowerCase(), classArray);
            });

            let levelArray = this.spellsByLevel.get(spell.level) || [];
            levelArray.push(key);
            this.spellsByLevel.set(spell.level, levelArray);

            let schoolArray = this.spellsBySchool.get(spell.school) || [];
            schoolArray.push(key);
            this.spellsBySchool.set(spell.school, schoolArray);

            if (spell.attack !== undefined) {
                let array = this.spellsByAttackType.get(spell.attack) || [];
                array.push(key);
                this.spellsByAttackType.set(spell.attack, array)
            }

            if (spell.save !== undefined) {
                let array = this.spellsBySaveType.get(spell.save) || [];
                array.push(key);
                this.spellsBySaveType.set(spell.save, array)
            }

            if (spell.concentration) {
                this.concentrationSpells.push(key);
            }

            if (spell.ritual) {
                this.ritualSpells.push(key);
            }

            if (spell.components.material !== undefined) {
                this.materialSpells.push(key);
            }

            if (spell.components.somatic) {
                this.somaticSpells.push(key);
            }

            if (spell.components.verbal) {
                this.verbalSpells.push(key);
            }

            spell.damageType?.forEach((damageType) => {
                let array = this.spellsByDamageType.get(damageType) || [];
                array.push(key);
                this.spellsByDamageType.set(damageType, array)
            });

            spell.conditions?.forEach((condition) => {
                let array = this.spellsByConditionType.get(condition.toLowerCase()) || [];
                array.push(key);
                this.spellsByConditionType.set(condition.toLowerCase(), array);
            });

            const durationArray = this.spellsByDuration.get(spell.duration) || [];
            durationArray.push(key);
            this.spellsByDuration.set(spell.duration, durationArray);

            let castingTimeArray = this.spellsByCastingTime.get(spell.castingTime) || [];
            castingTimeArray.push(key);
            this.spellsByCastingTime.set(spell.castingTime, castingTimeArray);
        });
    }

    public get(name: string): Spell | undefined {
        return this.spellByName.get(name.toLowerCase());
    }

    public list(): Spell[] {
        return Array.from(this.spellByName.values());
    }

    public query(query: Query): Spell[] {
        let spellList = new Array<Spell>();

        let spellNameList = Array.from(this.spellByName.keys());
        if (query.classes !== undefined && query.classes.length > 0) {
            let array = new Array<string>();
            query.classes.forEach((classType) => {
                let subArray = this.spellsByClass.get(classType.toLowerCase()) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }


        if (query.levels !== undefined && query.levels.length > 0) {
            let array = new Array<string>();
            query.levels.forEach((level) => {
                let subArray = this.spellsByLevel.get(level) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })

            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        if (query.schools !== undefined) {
            let array = new Array<string>();
            query.schools.forEach((school) => {
                let subArray = this.spellsBySchool.get(school) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        if (query.attackTypes !== undefined && query.attackTypes.length > 0) {
            let array = new Array<string>();
            query.attackTypes.forEach((attackType) => {
                let subArray = this.spellsByAttackType.get(attackType) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        if (query.saveTypes !== undefined && query.saveTypes.length > 0) {
            let array = new Array<string>();
            query.saveTypes.forEach((saveType) => {
                let subArray = this.spellsBySaveType.get(saveType) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        if (query.concentration !== undefined) {
            if (query.concentration) {
                spellNameList = spellNameList.filter((value) => this.concentrationSpells.includes(value));
            } else {
                spellNameList = spellNameList.filter((value) => !this.concentrationSpells.includes(value));
            }
        }

        if (query.ritual !== undefined) {
            if (query.ritual) {
                spellNameList = spellNameList.filter((value) => this.ritualSpells.includes(value));
            } else {
                spellNameList = spellNameList.filter((value) => !this.ritualSpells.includes(value));
            }
        }

        if (query.castingTime !== undefined && query.castingTime.length > 0) {
            let array = new Array<string>();
            query.castingTime.forEach((castingTime) => {
                let subArray = this.spellsByCastingTime.get(castingTime) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        if (query.name !== undefined && query.name !== '') {
            const regex = new RegExp(`.*${query.name.split(' ').join('.*')}.*`, 'gmi');
            spellNameList = spellNameList.filter((value) => value.match(regex))
        }

        if (query.components !== undefined) {

            if (query.components.material !== undefined) {
                if (query.components.material) {
                    spellNameList = spellNameList.filter((value) => this.materialSpells.includes(value));
                } else {
                    spellNameList = spellNameList.filter((value) => !this.materialSpells.includes(value));
                }
            }

            if (query.components.somatic !== undefined) {
                if (query.components.somatic) {
                    spellNameList = spellNameList.filter((value) => this.somaticSpells.includes(value));
                } else {
                    spellNameList = spellNameList.filter((value) => !this.somaticSpells.includes(value));
                }
            }

            if (query.components.verbal !== undefined) {
                if (query.components.verbal) {
                    spellNameList = spellNameList.filter((value) => this.verbalSpells.includes(value));
                } else {
                    spellNameList = spellNameList.filter((value) => !this.verbalSpells.includes(value));
                }
            }
        }

        if (query.damageTypes !== undefined && query.damageTypes.length > 0) {
            let array = new Array<string>();
            query.damageTypes.forEach((damageType) => {
                let subArray = this.spellsByDamageType.get(damageType) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        if (query.conditions !== undefined && query.conditions.length > 0) {
            let array = new Array<string>();
            query.conditions.forEach((condition) => {
                let subArray = this.spellsByConditionType.get(condition.toLowerCase()) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        if (query.durations !== undefined && query.durations.length > 0) {
            let array = new Array<string>();
            query.durations.forEach((duration) => {
                let subArray = this.spellsByDuration.get(duration) || [];
                if (subArray.length > 0) {
                    array.push(...subArray)
                }
            })
            if (array.length > 0) {
                spellNameList = spellNameList.filter((value) => array.includes(value));
            }
        }

        spellNameList.forEach((spellName) => {
            const spell = this.spellByName.get(spellName);
            if (spell !== undefined) {
                spellList.push(spell);
            }
        })

        return spellList;
    }
}

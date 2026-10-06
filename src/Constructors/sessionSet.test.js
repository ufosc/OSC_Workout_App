import SetObject from './sessionSet';

describe('SetObject', () => {
    test('can be created with no arguments', () => {
        const set = new SetObject();
        expect(set.getWeight()).toBe(0);
        expect(set.getReps()).toBe(0);
        expect(set.getTime()).toBe(0);
    });

    test('stores constructor values', () => {
        const set = new SetObject(135, 8, 0, 'WeightBased');
        expect(set.getWeight()).toBe(135);
        expect(set.getReps()).toBe(8);
        expect(set.type).toBe('WeightBased');
    });

    test('setTime updates time without replacing the method', () => {
        const set = new SetObject();
        set.setTime(60);
        expect(set.getTime()).toBe(60);
        expect(typeof set.setTime).toBe('function');
    });

    test('setWeight and setReps update values', () => {
        const set = new SetObject();
        set.setWeight(50);
        set.setReps(12);
        expect(set.getWeight()).toBe(50);
        expect(set.getReps()).toBe(12);
    });
});
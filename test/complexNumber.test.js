import {describe, expect, it} from '@jest/globals';

import ComplexNumber from '../src/complexNumber.js';

const TWO_PI = Math.PI + Math.PI;

const HALF_TOLERANCE = 5E-13;
const TOLERANCE = 1E-12;

const cp = ComplexNumber.createPolar.bind(ComplexNumber)
const cr = ComplexNumber.createRectangular.bind(ComplexNumber)

const NON_NUMBER_TYPED_VALUES = [
    BigInt(1),
    "string",
    true,
    null,
    undefined,
    Symbol("symbol"),
    {}
];

const NON_COMPLEX_NUMBER_TYPED_VALUES = [1, ...NON_NUMBER_TYPED_VALUES];

const withinTolerance = function (a, b) {
    return Math.abs(a - b) <= TOLERANCE;
}

const expectComponents = function (
    subject,
    real = 0,
    imaginary = 0,
    modulus = 0,
    argument = 0
) {
    it(
        `has a real component of ${real}`,
        () => expect(withinTolerance(subject.re, real)).toBe(true)
    );
    it(
        `has an imaginary component of ${imaginary}`,
        () => expect(withinTolerance(subject.im, imaginary)).toBe(true)
    );
    it(
        `has a modulus of ${modulus}`,
        () => expect(withinTolerance(subject.mod, modulus)).toBe(true)
    );
    it(
        `has an argument of ${argument}`,
        () => {
            const result = withinTolerance(subject.arg, argument);
            expect(result).toBe(true)
        }
    );
}

const expectEqual = function (first, second) {
    expectComponents(first, second.re, second.im, second.mod, second.arg);
}

describe(
    "Complex Number Tests",
    () => {

        describe(
            "That ComplexNumber.ZERO has all 0 components",
            () => expectComponents(ComplexNumber.ZERO)
        );

        describe(
            "Construction using polar form with a modulus of 0",
            () => [
                [0, 0],
                [0, Math.PI / 4],
                [0, 2 * Math.PI / 4],
                [0, 3 * Math.PI / 8],
                [0, 4 * Math.PI / 8],
                [0, 5 * Math.PI / 8],
                [0, 6 * Math.PI / 8],
                [0, 7 * Math.PI / 8],
                [0, 8 * Math.PI / 8],
                [0, TWO_PI],
                [0, 1000],
                [0, -1000],
                [HALF_TOLERANCE, 1],
                [HALF_TOLERANCE, -100000],
            ].forEach(([modulus, argument]) =>
                describe(
                    `that the complex number created from the polar
                        coordinates ${modulus}∠${argument} is ComplexNumber.ZERO`,
                    () => expectEqual(ComplexNumber.ZERO, cp(modulus, argument))
                ))
        );

        describe(
            "Converting between rectangular and polar coordinates generates the expected error when " +
            "incorrectly typed values are provided",
            () => {
                const GOOD_ARGUMENTS = [1, 1];
                GOOD_ARGUMENTS.forEach((value, arrayIndex) =>
                    NON_NUMBER_TYPED_VALUES.forEach((type) => {
                        const badArguments = [...GOOD_ARGUMENTS];
                        badArguments[arrayIndex] = type;
                        it(
                            `When converting from rectangular to polar representations, with a badly
                            typed value at position ${arrayIndex}, an error is thrown.`,
                            () => expect(
                                () => ComplexNumber.rectangularToPolar(...badArguments)
                            ).toThrowError()
                        );
                        it(
                            `When converting from polar to rectangular representations, with a badly
                            typed value at position ${arrayIndex}, an error is thrown.`,
                            () => expect(
                                () => ComplexNumber.polarToRectangular(...badArguments)
                            ).toThrowError()
                        );
                    })
                );
            });

        describe(
            "Polar to rectangular conversion",
            () =>
                it(
                    `Generates an error when provided with a negative modulus`,
                    () => expect(() => ComplexNumber.polarToRectangular(-1, 1)).toThrowError()
                )
        );


        ['add', 'subtract', 'multiply', 'divide', 'equals'].forEach((methodName) =>
            NON_COMPLEX_NUMBER_TYPED_VALUES.forEach((nonComplexNumberType) =>
                it(
                    `That the ${methodName} generates an error when called with a non ComplexNumber type`,
                    () => expect(
                        () => ComplexNumber[methodName].apply(ComplexNumber, [nonComplexNumberType])
                    ).toThrowError()
                )
            )
        );

        ['power', 'scale', 'root'].forEach((methodName) =>
            NON_NUMBER_TYPED_VALUES.forEach((nonNumberTypedValues) =>
                it(
                    `That the ${methodName} generates an error when called with a non number typed value`,
                    () => {
                        const subject = cp(1, 1);
                        expect(() => subject[methodName].apply(subject, [nonNumberTypedValues])).toThrowError()
                    }
                )
            )
        );

        describe(
            "Constructing objects from polar coordinates",
            () =>
                it(
                    `Generates an error when provided with a negative modulus`,
                    () => expect(() => cp(-1, 1)).toThrowError()
                )
        );

        describe(
            "Polar coordinate construction with an incorrectly typed value generates the expected error",
            () => {
                const GOOD_ARGUMENTS = [0, 0];
                GOOD_ARGUMENTS.forEach((value, arrayIndex) =>
                    NON_NUMBER_TYPED_VALUES.forEach((type) => {
                        const badArguments = [...GOOD_ARGUMENTS];
                        badArguments[arrayIndex] = type;
                        it(
                            `When we construct a complex number using polar coordinates but pass in
                            an incorrect type at position ${arrayIndex}, an error is thrown.`,
                            () => expect(() => cp(...badArguments)).toThrowError()
                        );
                        it(
                            `When we construct a complex number using rectangular coordinates but pass in
                             incorrect type at position ${arrayIndex}, an error is thrown.`,
                            () => expect(() => cr(...badArguments)).toThrowError()
                        );
                    })
                );
            });

        describe(
            "That the predefined complex numbers for the ordinal directions are correct",
            () => [
                ["EAST", [ComplexNumber.EAST, [1, 0]]],
                ["NORTH", [ComplexNumber.NORTH, [0, 1]]],
                ["WEST", [ComplexNumber.WEST, [-1, 0]]],
                ["SOUTH", [ComplexNumber.SOUTH, [0, -1]]],
            ].forEach(([constantName, [expectation, [realCoordinate, imaginaryCoordinate]]]) => {
                describe(`ComplexNumber.${constantName}`, () => {
                    const subject = cr(realCoordinate, imaginaryCoordinate);
                    describe(subject.toString(), () => expectEqual(expectation, subject));
                })
            })
        );

        describe(
            `That the constant i is defined correctly`,
            () => expectEqual(ComplexNumber.i, cr(0, 1))
        );

        describe(
            "That the predefined complex numbers for half right-angle directions are correct",
            () => [
                ["NORTH_EAST", [ComplexNumber.NORTH_EAST, Math.PI / 4]],
                ["NORTH_WEST", [ComplexNumber.NORTH_WEST, 3 * Math.PI / 4]],
                ["SOUTH_WEST", [ComplexNumber.SOUTH_WEST, 5 * Math.PI / 4]],
                ["SOUTH_EAST", [ComplexNumber.SOUTH_EAST, 7 * Math.PI / 4]],
            ].forEach(([constantName, [constant, argument]]) =>
                describe(
                    `ComplexNumber.${constantName}`,
                    () => {
                        const subject = cp(1, argument);
                        describe(subject.toString(), () => expectEqual(constant, subject));
                    })
            )
        );

        describe(
            "That conjugations are preformed correctly",
            () => [
                [ComplexNumber.EAST, ComplexNumber.EAST],
                [ComplexNumber.NORTH, ComplexNumber.SOUTH],
                [ComplexNumber.WEST, ComplexNumber.WEST],
                [ComplexNumber.SOUTH, ComplexNumber.NORTH],
                [ComplexNumber.NORTH_EAST, ComplexNumber.SOUTH_EAST],
                [ComplexNumber.NORTH_WEST, ComplexNumber.SOUTH_WEST],
                [ComplexNumber.SOUTH_WEST, ComplexNumber.NORTH_WEST],
                [ComplexNumber.SOUTH_EAST, ComplexNumber.NORTH_EAST],
            ].forEach(([subject, expectation]) => {
                describe(
                    `That the conjugate of ${subject} is ${expectation}`,
                    () => expectEqual(subject.conjugate, expectation)
                );

                describe(
                    `That double-conjugation leaves ${subject} unaltered`,
                    () => expectEqual(subject.conjugate.conjugate, subject)
                );
            })
        );

        describe(
            "That summations are preformed correctly",
            () => [
                [[ComplexNumber.ZERO, ComplexNumber.ZERO], ComplexNumber.ZERO],

                [[ComplexNumber.ZERO, ComplexNumber.SOUTH_WEST], ComplexNumber.SOUTH_WEST],
                [[ComplexNumber.SOUTH_WEST, ComplexNumber.ZERO], ComplexNumber.SOUTH_WEST],

                [[ComplexNumber.EAST, ComplexNumber.WEST], ComplexNumber.ZERO],
                [[ComplexNumber.WEST, ComplexNumber.EAST], ComplexNumber.ZERO],

                [[ComplexNumber.NORTH_EAST, ComplexNumber.SOUTH_WEST], ComplexNumber.ZERO],
                [[ComplexNumber.SOUTH_WEST, ComplexNumber.NORTH_EAST], ComplexNumber.ZERO],

                [[ComplexNumber.NORTH_EAST, ComplexNumber.NORTH_EAST], cp(2, Math.PI / 4)],
            ].forEach(([summands, expectation]) =>
                describe(
                    `That summing ${summands} yields ${expectation}`,
                    () => expectEqual(
                        summands.reduce((acc, curr) => acc.add(curr), ComplexNumber.ZERO),
                        expectation
                    )
                )
            )
        );

        describe(
            "That negations are preformed correctly",
            () => [
                [ComplexNumber.ZERO, ComplexNumber.ZERO],

                [ComplexNumber.EAST, ComplexNumber.WEST],
                [ComplexNumber.NORTH, ComplexNumber.SOUTH],
                [ComplexNumber.WEST, ComplexNumber.EAST],
                [ComplexNumber.SOUTH, ComplexNumber.NORTH],

                [ComplexNumber.NORTH_EAST, ComplexNumber.SOUTH_WEST],
                [ComplexNumber.NORTH_WEST, ComplexNumber.SOUTH_EAST],
                [ComplexNumber.SOUTH_WEST, ComplexNumber.NORTH_EAST],
                [ComplexNumber.SOUTH_EAST, ComplexNumber.NORTH_WEST],
            ].forEach(([subject, expectation]) => {
                describe(
                    `That summing ${subject} yields ${expectation}`,
                    () => expectEqual(subject.negate, expectation)
                );

                describe(
                    `That summing ${subject} and its negation yields 0+0i`,
                    () => expectEqual(subject.add(subject.negate), ComplexNumber.ZERO)
                );
            })
        );

        describe(
            "That differences are preformed correctly",
            () => [
                [[ComplexNumber.ZERO, ComplexNumber.ZERO], ComplexNumber.ZERO],

                [[ComplexNumber.ZERO, ComplexNumber.SOUTH_WEST], ComplexNumber.NORTH_EAST],
                [[ComplexNumber.SOUTH_WEST, ComplexNumber.ZERO], ComplexNumber.SOUTH_WEST],

                [[ComplexNumber.EAST, ComplexNumber.WEST], cr(2, 0)],
                [[ComplexNumber.WEST, ComplexNumber.EAST], cr(-2, 0)],

                [[ComplexNumber.NORTH_EAST, ComplexNumber.SOUTH_WEST], ComplexNumber.NORTH_EAST.scale(2)],
                [[ComplexNumber.SOUTH_WEST, ComplexNumber.NORTH_EAST], ComplexNumber.SOUTH_WEST.scale(2)],

                [[ComplexNumber.NORTH_EAST, ComplexNumber.NORTH_EAST], ComplexNumber.ZERO],
            ].forEach(([terms, expectation]) => {
                const initial = terms.shift();
                describe(
                    `That subtracting ${terms} from ${initial} yields ${expectation}`,
                    () => expectEqual(
                        terms.reduce((acc, curr) => acc.subtract(curr), initial),
                        expectation
                    )
                );
            })
        );

        describe(
            "That scaling complex numbers work correctly",
            () => [
                [ComplexNumber.ZERO, 0, ComplexNumber.ZERO],
                [ComplexNumber.ZERO, 1, ComplexNumber.ZERO],

                [ComplexNumber.NORTH, 0, ComplexNumber.ZERO],
                [ComplexNumber.NORTH, 1, ComplexNumber.NORTH],
                [ComplexNumber.NORTH, 2, cr(0, 2)],

                [ComplexNumber.WEST, 0, ComplexNumber.ZERO],
                [ComplexNumber.WEST, 1, ComplexNumber.WEST],
                [ComplexNumber.WEST, 3, cr(-3, 0)],

                [ComplexNumber.SOUTH, 0, ComplexNumber.ZERO],
                [ComplexNumber.SOUTH, -1, ComplexNumber.NORTH],
                [ComplexNumber.SOUTH, -5, cr(0, 5)],

                [ComplexNumber.EAST, 0, ComplexNumber.ZERO],
                [ComplexNumber.EAST, 1, ComplexNumber.EAST],
                [ComplexNumber.EAST, 7, cr(7, 0)],

                [ComplexNumber.NORTH_EAST, 0, ComplexNumber.ZERO],
                [ComplexNumber.NORTH_EAST, 1, ComplexNumber.NORTH_EAST],
                [ComplexNumber.NORTH_EAST, 11, cp(11, Math.PI / 4)],

                [ComplexNumber.SOUTH_WEST, 0, ComplexNumber.ZERO],
                [ComplexNumber.SOUTH_WEST, 1, ComplexNumber.SOUTH_WEST],
                [ComplexNumber.SOUTH_WEST, -13, cp(13, Math.PI / 4)],
            ].forEach(([subject, scalingFactor, expectation]) =>
                describe(
                    `That scaling ${subject} by ${scalingFactor} yields ${expectation}`,
                    () => expectEqual(subject.scale((scalingFactor)), expectation)
                )
            )
        );

        describe(
            "That multiplying works correctly",
            () => [
                [[ComplexNumber.ZERO, ComplexNumber.ZERO], ComplexNumber.ZERO],
                [[ComplexNumber.ZERO, ComplexNumber.EAST], ComplexNumber.ZERO],

                [[ComplexNumber.EAST, ComplexNumber.EAST, ComplexNumber.EAST, ComplexNumber.EAST], ComplexNumber.EAST],
                [[cp(3, Math.PI / 3), cp(5 / 2, Math.PI / 7)], cp(15 / 2, Math.PI * (1 / 3 + 1 / 7))],
                [[cr(3, -5), cr(7, -11)], cr((3 * 7) - (-5 * -11), (3 * -11) + (-5 * 7))],
            ].forEach(([multiplicands, expectation]) =>
                describe(
                    `That multiplying ${multiplicands} yields ${expectation}`,
                    () => expectEqual(
                        multiplicands.reduce((acc, curr) => acc.multiply(curr), multiplicands.shift()),
                        expectation
                    )
                )
            )
        );

        describe(
            "That raising complex numbers to integer powers works correctly",
            () => [
                [ComplexNumber.ZERO, 0, ComplexNumber.EAST],
                [ComplexNumber.SOUTH_WEST, 0, ComplexNumber.EAST],

                [ComplexNumber.NORTH, 1, ComplexNumber.NORTH],
                [ComplexNumber.SOUTH_EAST, 1, ComplexNumber.SOUTH_EAST],

                [ComplexNumber.NORTH_EAST, 2, cp(1, Math.PI / 2)],

                [ComplexNumber.NORTH_EAST, -2, cp(1 ** -2, -2 * ComplexNumber.NORTH_EAST.arg)],

                [cp(3, .3374938748934), 17, cp(3 ** 17, .3374938748934 * 17)],

                [cp(12719712891.121, 1.1212121), -2, cp(12719712891.121 ** -2, 1.1212121 * -2 + TWO_PI)],
            ].forEach(([subject, exponent, expectation]) =>
                describe(
                    `That ${subject} ** ${exponent} yields ${expectation}`,
                    () => expectEqual(subject.power((exponent)), expectation)
                )
            )
        );

        describe(
            "That dividing works correctly",
            () => [
                [ComplexNumber.ZERO, ComplexNumber.EAST, ComplexNumber.ZERO],

                [ComplexNumber.EAST, ComplexNumber.EAST, ComplexNumber.EAST],

                [ComplexNumber.WEST, ComplexNumber.EAST, ComplexNumber.WEST],
                [ComplexNumber.SOUTH_WEST, ComplexNumber.EAST, ComplexNumber.SOUTH_WEST],

                [
                    cr(2, -3),
                    cr(5, -7),
                    cr(
                        ((2 * 5) + (-3 * -7)) / (5 ** 2 + (-7) ** 2),
                        ((-3 * 5) - (2 * -7)) / (5 ** 2 + (-7) ** 2)
                    )
                ],

            ].forEach(([numerator, denominator, expectation]) =>
                describe(
                    `That ${numerator} / ${denominator} yields ${expectation}`,
                    () => expectEqual(numerator.divide(denominator), expectation)
                )
            )
        );

        describe(
            "That multiplicative inverses work correctly",
            () => [
                ComplexNumber.EAST,
                ComplexNumber.NORTH_EAST,
                ComplexNumber.NORTH,
                ComplexNumber.NORTH_WEST,
                ComplexNumber.WEST,
                ComplexNumber.SOUTH_WEST,
                ComplexNumber.SOUTH,
                ComplexNumber.SOUTH_EAST,
            ].forEach((subject) => expectEqual(subject.multiply(subject.inverse), ComplexNumber.EAST))
        );

        describe(
            "That normalise works as expected",
            () => [
                [ComplexNumber.NORTH, ComplexNumber.NORTH],
                [cp(100, Math.PI), cp(1, Math.PI)],
                [cp(ComplexNumber.TOLERANCE * 2, ComplexNumber.TOLERANCE * 2), cp(1, ComplexNumber.TOLERANCE * 2)],
                [cp(2542967897894723, TWO_PI - .1), cp(1, TWO_PI - .1)],
            ].forEach(
                ([subject, expectation]) => expectEqual(subject.normalise(), expectation)
            )
        );

        describe(
            "Finding the roots of complex numbers",
            () => [
                [ComplexNumber.i, 3, cr(Math.sqrt(3) / 2, 1 / 2)]
            ].forEach(([subject, degree, expectation]) => expectEqual(expectation, subject.root(degree)))
        );

        describe(
            "Finding the principal logarithm of complex numbers",
            () => [
                [ComplexNumber.i, cr(Math.log(1), Math.PI / 2)],
                [cr(-5, 0), cr(Math.log(5), Math.PI)],
                [cr(1, 1), cr(Math.log(Math.sqrt(2)), Math.PI / 4)],
                [cr(1, -1), cr(Math.log(Math.sqrt(2)), -Math.PI / 4)],
            ].forEach(([subject, expectation]) =>
                describe(
                    `That Log(${subject})=${subject.Log()}=${expectation}`,
                    () => expectEqual(expectation, subject.Log())
                )
            )
        );
    });
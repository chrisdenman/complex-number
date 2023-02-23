import ComplexNumberConfig from "./complexNumberConfig.js";
import Assertions from "@ceilingcat/assertions";

const TWO_PI =  Math.PI + Math.PI;

/**
 * An immutable complex number class.
 */
export default class ComplexNumber {
    
    /**
     * The currently configured tolerance value.
     *
     * @return {number} ComplexNumberConfig.TOLERANCE
     *
     * @see ComplexNumberConfig.TOLERANCE
     */
    static get TOLERANCE() {
        return ComplexNumberConfig.TOLERANCE;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} √2 + i√2 (1∠π/4)
     */
    static get NORTH_EAST() {
        return NORTH_EAST;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} -√2 + i√2 (1∠3π/4)
     */
    static get NORTH_WEST() {
        return NORTH_WEST;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} -√2 - i√2 (1∠5π/4)
     */
    static get SOUTH_WEST() {
        return SOUTH_WEST;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} √2 - i√2 (1∠7π/4)
     */
    static get SOUTH_EAST() {
        return SOUTH_EAST;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} 0 + 0i (0∠0)
     */
    static get ZERO() {
        return ZERO;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} 1 + 0i (1∠0)
     */
    static get EAST() {
        return EAST;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} 0 + 1i (1∠π/2)
     */
    static get NORTH() {
        return NORTH;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} 0 + 1i (1∠π/2)
     */
    static get i() {
        return NORTH;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} -1 + 0i (1∠π)
     */
    static get WEST() {
        return WEST;
    }

    /**
     * @return {ComplexNumber} the {@link ComplexNumber} 0 - 1i (1∠3π/2)
     */
    static get SOUTH() {
        return SOUTH;
    }

    #real = NaN;

    #imaginary = NaN;

    #modulus = NaN;

    #argument = NaN;

    /**
     * Calculates and returns the principal argument for the given rectangular components of a complex number.
     *
     * The principal argument lies in the range (−π,π].
     *
     * @param {number} real the real component of a complex number
     * @param {number}  imaginary the imaginary component of a complex number
     *
     * @return {number} the counterclockwise (positive) angle the given rectangular coordinates subtend from the
     * positive real (x) axis
     */
    static principalArgument(real, imaginary) {
        Assertions.isNumber(real);
        Assertions.isNumber(imaginary);

        return Math.atan2(imaginary, real);
    }

    /**
     * Tests to see if two numbers are equal within a given tolerance.
     *
     * @param {number} a the first number to compare
     * @param {number} b the second number to compare
     *
     * @return {boolean} <code>true</code> if 'a' and 'b' are equal within a given tolerance, <code>false</code>
     * otherwise
     *
     * @throws {Error} if either 'a' or 'b' are not numbers
     *
     * @see ComplexNumber.TOLERANCE
     */
    static withinTolerance(a, b) {
        Assertions.isNumber(a);
        Assertions.isNumber(b);

        return Math.abs(a - b) <= ComplexNumber.TOLERANCE
    }

    /**
     * Creates and returns a complex number from rectangular coordinates.
     *
     * The argument is reduced to lie within [0,2π).
     *
     * @param {number} real - the real component
     * @param {number} imaginary - the imaginary component
     *
     * @return {ComplexNumber} a complex number with the given rectangular coordinates
     *
     * @throws {Error} if either 'modulus' or 'argument' are not numbers
     */
    static createRectangular(real, imaginary) {
        Assertions.isNumber(real);
        Assertions.isNumber(imaginary);

        const [mod, arg] = ComplexNumber.rectangularToPolar(real, imaginary);

        return new this(real, imaginary, mod, arg);
    }

    /**
     * Creates and returns a complex number from polar coordinates.
     *
     * The argument is reduced to lie within [0,2π).
     *
     * @param {number} modulus - the modulus of the complex number
     * @param {number} argument - the argument of the complex number
     *
     * @return {ComplexNumber} a ComplexNumber with the given polar coordinates
     *
     * @throws {Error} if 'modulus' < 0 or either 'modulus' or 'argument' are not numbers
     */
    static createPolar(modulus, argument) {
        Assertions.isNonNegativeNumber(modulus);
        Assertions.isNumber(argument);

        if (ComplexNumber.withinTolerance(modulus, 0)) {
            argument = 0;
        } else {
            argument %= TWO_PI;
            if (argument < 0) {
                argument += TWO_PI;
            }
        }

        return new this(...ComplexNumber.polarToRectangular(modulus, argument), modulus, argument);
    }

    /**
     * Converts from polar to rectangular coordinates.
     *
     * @param {number} modulus the modulus (or magnitude) of the complex number
     * @param {number} argument the argument of the complex number
     *
     * @return {number[]} an array containing the: real and imaginary components of the rectangular representation, in
     * that order
     *
     * @throws {Error} if either component provided is not a number typed value or if the provided modulus is negative
     */
    static polarToRectangular(modulus, argument) {
        Assertions.isNonNegativeNumber(modulus);
        Assertions.isNumber(argument);

        return [
            Math.cos(argument),
            Math.sin(argument)
        ].map((component) => component * modulus);
    }

    /**
     * Converts from rectangular to polar coordinates.
     *
     * @param {number} real the real (or x) coordinate
     * @param {number} imaginary the imaginary (or y) coordinate
     *
     * @return {number[]} an array containing the: modulus and argument of the polar representation, in that order
     *
     * @throws {Error} if either component provided is not a number typed value
     */
    static rectangularToPolar(real, imaginary) {
        Assertions.isNumber(real);
        Assertions.isNumber(imaginary);

        const polarCoordinates = [
            Math.sqrt(ComplexNumber.modulusSquared(real, imaginary)),
            ComplexNumber.#argumentOf(real, imaginary)
        ];

        return polarCoordinates;
    }

    /**
     * Returns the square of the modulus of the complex number defined by rectangular coordinates.
     *
     * This can be interpreted as the square of the distance between the two complex numbers when viewed geometrically.
     *
     * @param {number} real - the real coordinate
     * @param {number} imaginary - the imaginary coordinate
     *
     * @return {number} the square of the modulus of a complex number
     *
     * @throws {Error} 'real' or 'imaginary' are not numbers
     */
    static modulusSquared(real, imaginary) {
        Assertions.isNumber(real);
        Assertions.isNumber(imaginary);

        return real ** 2 + imaginary ** 2;
    }

    static #withAssertedComplexNumber(value) {
        return Assertions.isInstanceOf(value, ComplexNumber);
    }

    static #argumentOf(real, imaginary) {
        Assertions.isNumber(real);
        Assertions.isNumber(imaginary);
        if (ComplexNumber.withinTolerance(real, 0) && ComplexNumber.withinTolerance(imaginary, 0)) {
            return 0;
        } else {
            const principalArgument = ComplexNumber.principalArgument(real, imaginary)
            return principalArgument < 0 ?
                principalArgument + TWO_PI :
                principalArgument;
        }
    }

    /**
     * Asserts that 'complexNumber' is a {@link ComplexNumber} and it does not equal {@link ComplexNumber.ZERO}.
     *
     * @param {ComplexNumber} complexNumber the value to assert
     *
     * @return {ComplexNumber} the argument passed in
     *
     * @throws {Error} if, 'complexNumber' is not a {@link ComplexNumber}, or it equals {@link ComplexNumber.ZERO}
     */
    static #withAssertedNotZero(complexNumber) {
        ComplexNumber.#withAssertedComplexNumber(complexNumber);

        Assertions.withGuard(() => !complexNumber.equals(this.ZERO));

        return complexNumber;
    }

    /**
     * Class constructor designed for internal use only as, the arguments are only type checked but no further
     * consistency checks are performed as the static methods 'createRectangular' and 'createPolar' are designed for
     * public use.
     *
     * @param {number} real the real (or x) coordinate
     * @param {number} imaginary the imaginary (or y) coordinate
     * @param {number} modulus the length of the vector
     * @param {number} argument the clockwise angle in radians the vector makes with the positive x-axis
     *
     * @throws {Error} if any argument's type is not a {number} or 'modulus' is negatively valued
     */
    constructor(real, imaginary, modulus, argument) {
        this.#real = Assertions.isNumber(real);
        this.#imaginary = Assertions.isNumber(imaginary);
        this.#modulus = Assertions.isNonNegativeNumber(modulus);
        this.#argument = Assertions.isNumber(argument);
    }

    /**
     * Calculates and returns this complex number's principal argument.
     *
     * @return {number} the counterclockwise (positive) angle the given rectangular coordinates subtended from the
     * positive real (x) axis
     *
     * @see ComplexNumber.principalArgument
     */
    get principalArgument() {
        return Math.atan2(this.#imaginary, this.#real);
    }

    /**
     * Returns the real part of this complex number when considered in rectangular form (a+ib), that is 'a'.
     *
     * @return {number} the real part of this complex number when considered in rectangular coordinates
     */
    get re() {
        return this.#real;
    }

    /**
     * Returns the imaginary part of this complex number when considered in rectangular form (a+ib), that is 'b'.
     *
     * @return {number} the imaginary part of this complex number when considered in rectangular coordinates
     */
    get im() {
        return this.#imaginary;
    }

    /**
     * Returns the modulus of this complex number when considered in polar form.
     *
     * @return {number} the modulus of this complex number when considered in polar coordinates
     */
    get mod() {
        return this.#modulus;
    }

    /**
     * Returns the argument of this complex number when considered in polar form.
     *
     * @return {number} the argument of this complex number when considered in polar coordinates
     */
    get arg() {
        return this.#argument;
    }

    /**
     * Returns the conjugate of this complex number.
     * In polar form, if this number is a+ib then a-ib is returned.
     *
     * @return {ComplexNumber} this complex number's conjugate
     */
    get conjugate() {
        return ComplexNumber.createRectangular(this.#real, -this.#imaginary);
    }

    /**
     * Returns the sum of this and another number.
     *
     * @param {ComplexNumber} addend
     *
     * @return {ComplexNumber} @example this+addend
     *
     * @throws {Error} if 'addend' is not a ComplexNumber
     */
    add(addend) {
        ComplexNumber.#withAssertedComplexNumber(addend);

        return ComplexNumber.createRectangular(addend.re + this.re, addend.im + this.im);
    }

    /**
     * Returns the difference of this and subtrahend.
     *
     * @param {ComplexNumber} subtrahend the subtrahend
     *
     * @return {ComplexNumber} @example this-subtrahend
     *
     * @throws {Error} if 'subtrahend' is not a ComplexNumber
     */
    subtract(subtrahend) {
        ComplexNumber.#withAssertedComplexNumber(subtrahend);

        return ComplexNumber.createRectangular(
            this.re - subtrahend.re,
            this.im - subtrahend.im
        );
    }

    /**
     * Multiply this ComplexNumber with another.
     *
     * @param {ComplexNumber} factor the value to multiple this ComplexNumber by
     *
     * @return {ComplexNumber} the product of this and the given ComplexNumber argument
     *
     * @throws {Error} if 'factor' is not a ComplexNumber
     */
    multiply(factor) {
        ComplexNumber.#withAssertedComplexNumber(factor);

        return ComplexNumber.createPolar(
            this.#modulus * factor.mod,
            this.#argument + factor.arg,
        );
    }

    /**
     * Raises this ComplexNumber to an integer power and returns the result.
     *
     * @param {number} exponent the value to raise this ComplexNumber to
     *
     * @return {ComplexNumber} the value resulting from raising this ComplexNumber to 'exponent'
     *
     * @throws {Error} if 'exponent' is not an integer number
     */
    power(exponent) {
        Assertions.isIntegerNumber(exponent);

        return ComplexNumber.createPolar(
            this.#modulus ** exponent,
            this.#argument * exponent,
        );
    }

    /**
     * Returns root (of degree 'degree') of this complex number.
     *
     * The principal argument is used to calculate the resultant complex number's argument value.
     *
     * @param degree the degree of the root to calculate
     *
     * @return {ComplexNumber} the root of this complex number of degree 'degree'
     *
     * @throws {Error} if, 'degree' is not a positive number, or 'degree' is not an integer.
     */
    root(degree) {
        Assertions.isPositiveNumber(degree);
        Assertions.isIntegerNumber(degree);

        const modulus = Math.pow(this.#modulus, 1 / degree);
        const principalArgument = this.principalArgument / degree;

        return ComplexNumber.createPolar(modulus, principalArgument);
    }

    /**
     * Calculates the division of this by 'denominator'.
     *
     * @param {ComplexNumber} denominator the number to divide this by
     *
     * @return {ComplexNumber}
     *
     * @throws {Error} if, 'denominator' is not a {@link ComplexNumber}, or 'denominator' equals
     * {@link ComplexNumber.ZERO}
     */
    divide(denominator) {
        ComplexNumber.#withAssertedNotZero(denominator);

        return ComplexNumber.createPolar(
            this.#modulus / denominator.mod,
            this.#argument - denominator.arg,
        );
    }

    /**
     * For all complex number's not equal to {@link ComplexNumber.ZERO}, returns a complex number which when considered
     * in polar form, has the same argument as the original, but with a modulus of <code>1</code>.
     *
     * @return {ComplexNumber} a normalised version of this complex number
     *
     * @throws {Error} if this {@link ComplexNumber} equals {@link ComplexNumber.ZERO}
     */
    normalise() {
        ComplexNumber.#withAssertedNotZero(this);

        return ComplexNumber.createPolar(1, this.#argument);
    }

    /**
     * Returns the principle value of the complex logarithm of this complex number.
     *
     * @return {ComplexNumber} the principal value of the natural logarithm
     */
    Log() {
        return ComplexNumber.createRectangular(Math.log(this.#modulus), this.principalArgument);
    }

    /**
     * Provides the multiplicative inverse of this complex number <code>1/this</code>.
     *
     * @return {ComplexNumber} the inverse of this complex number, that is, the number <code>y</code> such that
     * <code>this * y = 1</code>.
     *
     * @throws {Error} if this equals {@link ComplexNumber.ZERO}
     */
    get inverse() {
        return EAST.divide(this);
    }

    /**
     * Produces the additive inverse of this complex number.
     *
     * @return {ComplexNumber} the number which when added to this complex number equals
     * {@link ComplexNumber.ZERO}
     */
    get negate() {
        return this.equals(ComplexNumber.ZERO) ?
            ComplexNumber.ZERO :
            ComplexNumber.createRectangular(-this.re, -this.im);
    }

    /**
     * Scales this complex number by a given scalar number.
     *
     * @param {number} number the number to scale by
     *
     * @return {ComplexNumber} a scaled version of this complex number
     *
     * @throws {Error} if 'number' is not a number
     */
    scale(number) {
        Assertions.isNumber(number)

        return ComplexNumber.createRectangular(this.#real * number, this.#imaginary * number);
    }

    /**
     * Returns a textual representation of this complex number in both: rectangular and, polar forms.
     *
     * @returns {string} a textual representation of this complex number
     */
    toString() {
        // ${this.#real}+${this.#imaginary}i
        return `(${this.#modulus}∠${this.arg})`;
    }

    /**
     * Determines if this complex number equals another (within tolerable accuracy).
     *
     * @param {ComplexNumber} that the ComplexNumber to test with this one for equality
     *
     * @return {boolean} <code>true</code> if the two complex numbers are equal, otherwise <code>false</code>
     *
     * @throws {Error} if 'that' is not a {@link ComplexNumber}
     */
    equals(that) {
        ComplexNumber.#withAssertedComplexNumber(that);

        return ComplexNumber.withinTolerance(this.#real, that.re) &&
            ComplexNumber.withinTolerance(this.#imaginary, that.im);
    }
}

const ZERO = ComplexNumber.createRectangular(0, 0);

const EAST = ComplexNumber.createRectangular(1, 0);

const NORTH = ComplexNumber.createRectangular(0, 1);

const WEST = ComplexNumber.createRectangular(-1, 0);

const SOUTH = ComplexNumber.createRectangular(0, -1);

const NORTH_EAST = ComplexNumber.createPolar(1, Math.PI / 4);

const NORTH_WEST = ComplexNumber.createPolar(1, 3 * Math.PI / 4);

const SOUTH_WEST = ComplexNumber.createPolar(1, 5 * Math.PI / 4)

const SOUTH_EAST = ComplexNumber.createPolar(1, 7 * Math.PI / 4);


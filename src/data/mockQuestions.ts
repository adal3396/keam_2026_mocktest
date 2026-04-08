import { Question } from '../types';

export const MOCK_QUESTIONS: Question[] = [
  // ─────────────────────── MATHEMATICS (Q1–Q75) ───────────────────────
  {
    id: 'm1', subject: 'Mathematics', questionNo: 1,
    questionText: 'The value of ∫₀^π sin(x) dx is:',
    options: ['0', '1', '2', '-2', '-1'],
    correctOption: 2,
    explanation: '[-cos(x)]₀^π = -cos(π) + cos(0) = 1 + 1 = 2'
  },
  {
    id: 'm2', subject: 'Mathematics', questionNo: 2,
    questionText: 'If A is a square matrix of order 3 and |A| = 5, then |adj A| is:',
    options: ['5', '25', '125', '15', '10'],
    correctOption: 1,
    explanation: '|adj A| = |A|^(n-1) = 5^(3-1) = 25'
  },
  {
    id: 'm3', subject: 'Mathematics', questionNo: 3,
    questionText: 'The number of ways to arrange 5 persons in a row is:',
    options: ['60', '100', '120', '150', '20'],
    correctOption: 2,
    explanation: '5! = 5×4×3×2×1 = 120'
  },
  {
    id: 'm4', subject: 'Mathematics', questionNo: 4,
    questionText: 'The sum of the series 1 + 1/2 + 1/4 + 1/8 + ... ∞ is:',
    options: ['1', '3/2', '2', '5/2', '∞'],
    correctOption: 2,
    explanation: 'S = a/(1-r) = 1/(1-1/2) = 2'
  },
  {
    id: 'm5', subject: 'Mathematics', questionNo: 5,
    questionText: 'The equation of the circle with centre (2, 3) and radius 5 is:',
    options: ['(x-2)² + (y-3)² = 5', '(x+2)² + (y+3)² = 25', '(x-2)² + (y-3)² = 25', '(x+2)² + (y-3)² = 25', 'x² + y² = 25'],
    correctOption: 2,
    explanation: '(x-h)² + (y-k)² = r² → (x-2)² + (y-3)² = 25'
  },
  {
    id: 'm6', subject: 'Mathematics', questionNo: 6,
    questionText: 'If f(x) = x² + 2x + 1, then f\'(x) is:',
    options: ['2x', '2x + 2', 'x + 2', '2x - 2', 'x² + 2'],
    correctOption: 1,
    explanation: 'f\'(x) = 2x + 2'
  },
  {
    id: 'm7', subject: 'Mathematics', questionNo: 7,
    questionText: 'The domain of f(x) = √(x - 3) is:',
    options: ['x < 3', 'x ≤ 3', 'x ≥ 3', 'x > 3', 'All real numbers'],
    correctOption: 2,
    explanation: 'x - 3 ≥ 0 ⟹ x ≥ 3'
  },
  {
    id: 'm8', subject: 'Mathematics', questionNo: 8,
    questionText: 'The angle between lines y = x and y = √3 x is:',
    options: ['15°', '30°', '45°', '60°', '90°'],
    correctOption: 0,
    explanation: 'tan θ = |(m₂-m₁)/(1+m₁m₂)| = |(√3-1)/(1+√3)| = tan 15°'
  },
  {
    id: 'm9', subject: 'Mathematics', questionNo: 9,
    questionText: 'The value of sin 75° is:',
    options: ['(√6 - √2)/4', '(√6 + √2)/4', '(√3 + 1)/2', '(√3 - 1)/2√2', '1/√2'],
    correctOption: 1,
    explanation: 'sin 75° = sin(45° + 30°) = (√6 + √2)/4'
  },
  {
    id: 'm10', subject: 'Mathematics', questionNo: 10,
    questionText: 'If z = 3 + 4i, then |z| is:',
    options: ['3', '4', '5', '7', '25'],
    correctOption: 2,
    explanation: '|z| = √(3² + 4²) = √25 = 5'
  },
  {
    id: 'm11', subject: 'Mathematics', questionNo: 11,
    questionText: 'The value of lim(x→0) (sin x)/x is:',
    options: ['0', '∞', '1', '-1', 'Does not exist'],
    correctOption: 2,
    explanation: 'Standard limit: lim(x→0) (sin x)/x = 1'
  },
  {
    id: 'm12', subject: 'Mathematics', questionNo: 12,
    questionText: 'The derivative of ln(x) is:',
    options: ['ln(x)', '1/x', 'x', 'e^x', '1/x²'],
    correctOption: 1,
    explanation: 'd/dx[ln x] = 1/x'
  },
  {
    id: 'm13', subject: 'Mathematics', questionNo: 13,
    questionText: 'How many terms are in the expansion of (a + b)^10?',
    options: ['9', '10', '11', '12', '20'],
    correctOption: 2,
    explanation: 'Number of terms = n + 1 = 10 + 1 = 11'
  },
  {
    id: 'm14', subject: 'Mathematics', questionNo: 14,
    questionText: 'The value of tan⁻¹(1) is:',
    options: ['0', 'π/6', 'π/4', 'π/3', 'π/2'],
    correctOption: 2,
    explanation: 'tan(π/4) = 1, so tan⁻¹(1) = π/4'
  },
  {
    id: 'm15', subject: 'Mathematics', questionNo: 15,
    questionText: 'If P(A) = 1/3 and P(B) = 1/4 and A, B are independent, then P(A∩B) is:',
    options: ['1/12', '7/12', '1/2', '1/3', '1/4'],
    correctOption: 0,
    explanation: 'P(A∩B) = P(A)·P(B) = 1/3 × 1/4 = 1/12'
  },
  {
    id: 'm16', subject: 'Mathematics', questionNo: 16,
    questionText: 'The eccentricity of the ellipse x²/16 + y²/9 = 1 is:',
    options: ['√7/4', '√3/4', '3/4', '7/16', '√7/16'],
    correctOption: 0,
    explanation: 'e = √(1 - b²/a²) = √(1 - 9/16) = √(7/16) = √7/4'
  },
  {
    id: 'm17', subject: 'Mathematics', questionNo: 17,
    questionText: 'The number of diagonals in a polygon with 10 sides is:',
    options: ['30', '35', '40', '45', '50'],
    correctOption: 1,
    explanation: 'Diagonals = n(n-3)/2 = 10×7/2 = 35'
  },
  {
    id: 'm18', subject: 'Mathematics', questionNo: 18,
    questionText: 'The rank of matrix [[1,2],[3,4]] is:',
    options: ['0', '1', '2', '3', '4'],
    correctOption: 2,
    explanation: 'det = 4-6 = -2 ≠ 0, so rank = 2'
  },
  {
    id: 'm19', subject: 'Mathematics', questionNo: 19,
    questionText: 'If y = e^(2x), then dy/dx is:',
    options: ['e^(2x)', '2e^(2x)', 'e^x', '2xe^x', 'e^(2x)/2'],
    correctOption: 1,
    explanation: 'dy/dx = 2e^(2x) by chain rule'
  },
  {
    id: 'm20', subject: 'Mathematics', questionNo: 20,
    questionText: 'The common ratio in the GP 3, 6, 12, 24, ... is:',
    options: ['1/2', '2', '3', '4', '6'],
    correctOption: 1,
    explanation: 'r = 6/3 = 2'
  },
  {
    id: 'm21', subject: 'Mathematics', questionNo: 21,
    questionText: 'The value of C(10,3) is:',
    options: ['30', '60', '120', '720', '1000'],
    correctOption: 2,
    explanation: 'C(10,3) = 10!/(3!7!) = 120'
  },
  {
    id: 'm22', subject: 'Mathematics', questionNo: 22,
    questionText: 'The focus of the parabola y² = 8x is:',
    options: ['(2, 0)', '(-2, 0)', '(0, 2)', '(0, -2)', '(4, 0)'],
    correctOption: 0,
    explanation: '4a = 8 ⟹ a = 2, focus = (a, 0) = (2, 0)'
  },
  {
    id: 'm23', subject: 'Mathematics', questionNo: 23,
    questionText: 'If the two roots of x² - 5x + k = 0 are equal, then k is:',
    options: ['5', '10', '25/4', '25', '5/2'],
    correctOption: 2,
    explanation: 'For equal roots: b² - 4ac = 0 → 25 - 4k = 0 → k = 25/4'
  },
  {
    id: 'm24', subject: 'Mathematics', questionNo: 24,
    questionText: 'The area of a triangle with vertices (0,0), (4,0), (0,3) is:',
    options: ['6', '7', '8', '12', '3'],
    correctOption: 0,
    explanation: 'Area = 1/2 × base × height = 1/2 × 4 × 3 = 6'
  },
  {
    id: 'm25', subject: 'Mathematics', questionNo: 25,
    questionText: '∫ e^x dx is:',
    options: ['e^x + C', 'xe^x + C', 'e^x/x + C', 'e^(x+1)/(x+1) + C', '1/e^x + C'],
    correctOption: 0,
    explanation: '∫ e^x dx = e^x + C'
  },
  {
    id: 'm26', subject: 'Mathematics', questionNo: 26,
    questionText: 'The general term in the expansion of (1+x)^n is:',
    options: ['C(n,r)xʳ', 'n!xʳ', 'C(n,r)x^(n-r)', 'nxʳ', 'C(n,r)x^(n+r)'],
    correctOption: 0,
    explanation: 'T(r+1) = C(n,r) xʳ'
  },
  {
    id: 'm27', subject: 'Mathematics', questionNo: 27,
    questionText: 'The slope of the line 3x + 4y = 12 is:',
    options: ['3/4', '-3/4', '4/3', '-4/3', '3'],
    correctOption: 1,
    explanation: '4y = -3x + 12 → y = -3x/4 + 3, slope = -3/4'
  },
  {
    id: 'm28', subject: 'Mathematics', questionNo: 28,
    questionText: 'If sin θ = 3/5, then cos θ is (θ in first quadrant):',
    options: ['4/5', '3/5', '5/3', '5/4', '1/5'],
    correctOption: 0,
    explanation: 'cos θ = √(1 - sin²θ) = √(1-9/25) = 4/5'
  },
  {
    id: 'm29', subject: 'Mathematics', questionNo: 29,
    questionText: 'The arithmetic mean of 2, 4, 6, 8, 10 is:',
    options: ['4', '5', '6', '7', '8'],
    correctOption: 2,
    explanation: 'AM = (2+4+6+8+10)/5 = 30/5 = 6'
  },
  {
    id: 'm30', subject: 'Mathematics', questionNo: 30,
    questionText: 'lim(x→2) (x² - 4)/(x - 2) is:',
    options: ['0', '1', '2', '4', 'Does not exist'],
    correctOption: 3,
    explanation: '(x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2 → 4 as x→2'
  },
  {
    id: 'm31', subject: 'Mathematics', questionNo: 31,
    questionText: 'The value of i⁴ where i = √(-1) is:',
    options: ['-1', 'i', '-i', '1', '0'],
    correctOption: 3,
    explanation: 'i⁴ = (i²)² = (-1)² = 1'
  },
  {
    id: 'm32', subject: 'Mathematics', questionNo: 32,
    questionText: 'The equation x² + y² + 6x - 8y = 0 represents a circle with centre:',
    options: ['(3, -4)', '(-3, 4)', '(6, -8)', '(-3, -4)', '(3, 4)'],
    correctOption: 1,
    explanation: 'Centre = (-g, -f) = (-3, 4)'
  },
  {
    id: 'm33', subject: 'Mathematics', questionNo: 33,
    questionText: 'The distance between points (1,2) and (4,6) is:',
    options: ['3', '4', '5', '6', '7'],
    correctOption: 2,
    explanation: '√((4-1)² + (6-2)²) = √(9+16) = √25 = 5'
  },
  {
    id: 'm34', subject: 'Mathematics', questionNo: 34,
    questionText: 'If f(x) = 3x² - 4x + 1, then f(2) is:',
    options: ['1', '3', '5', '7', '9'],
    correctOption: 2,
    explanation: 'f(2) = 3(4) - 4(2) + 1 = 12 - 8 + 1 = 5'
  },
  {
    id: 'm35', subject: 'Mathematics', questionNo: 35,
    questionText: 'The 10th term of the AP 3, 7, 11, 15, ... is:',
    options: ['39', '40', '41', '42', '43'],
    correctOption: 0,
    explanation: 'T₁₀ = a + 9d = 3 + 9(4) = 39'
  },
  {
    id: 'm36', subject: 'Mathematics', questionNo: 36,
    questionText: 'The value of cos 0° + sin 90° is:',
    options: ['0', '1', '2', '-1', 'Undefined'],
    correctOption: 2,
    explanation: 'cos 0° = 1, sin 90° = 1, sum = 2'
  },
  {
    id: 'm37', subject: 'Mathematics', questionNo: 37,
    questionText: '∫ (1/x) dx is:',
    options: ['x + C', 'ln|x| + C', '-1/x² + C', 'x² + C', 'e^x + C'],
    correctOption: 1,
    explanation: '∫ (1/x) dx = ln|x| + C'
  },
  {
    id: 'm38', subject: 'Mathematics', questionNo: 38,
    questionText: 'The sum of the first n natural numbers is:',
    options: ['n(n+1)', 'n(n-1)/2', 'n(n+1)/2', 'n²', '(n+1)/2'],
    correctOption: 2,
    explanation: 'Sum = n(n+1)/2'
  },
  {
    id: 'm39', subject: 'Mathematics', questionNo: 39,
    questionText: 'The matrix equation AX = B has unique solution when:',
    options: ['|A| = 0', '|A| ≠ 0', 'A is singular', 'B = 0', 'A is zero matrix'],
    correctOption: 1,
    explanation: 'Unique solution exists iff |A| ≠ 0 (A is non-singular)'
  },
  {
    id: 'm40', subject: 'Mathematics', questionNo: 40,
    questionText: 'If log₂ 8 = x, then x is:',
    options: ['1', '2', '3', '4', '8'],
    correctOption: 2,
    explanation: 'log₂ 8 = log₂ 2³ = 3'
  },
  {
    id: 'm41', subject: 'Mathematics', questionNo: 41,
    questionText: 'The derivative of sin x is:',
    options: ['-sin x', 'cos x', '-cos x', 'tan x', 'sec x'],
    correctOption: 1,
    explanation: 'd/dx(sin x) = cos x'
  },
  {
    id: 'm42', subject: 'Mathematics', questionNo: 42,
    questionText: 'P(A ∪ B) = P(A) + P(B) when A and B are:',
    options: ['Independent', 'Complementary', 'Mutually Exclusive', 'Exhaustive', 'Equally likely'],
    correctOption: 2,
    explanation: 'P(A∪B) = P(A)+P(B) only when A and B are mutually exclusive (P(A∩B)=0)'
  },
  {
    id: 'm43', subject: 'Mathematics', questionNo: 43,
    questionText: 'The value of ⁿC₀ + ⁿC₁ + ⁿC₂ + ... + ⁿCₙ is:',
    options: ['n', 'n!', '2ⁿ', '2ⁿ⁻¹', 'n²'],
    correctOption: 2,
    explanation: 'Sum of binomial coefficients = 2ⁿ'
  },
  {
    id: 'm44', subject: 'Mathematics', questionNo: 44,
    questionText: 'The value of tan 45° is:',
    options: ['0', '1/√2', '√3', '1', '√3/2'],
    correctOption: 3,
    explanation: 'tan 45° = 1'
  },
  {
    id: 'm45', subject: 'Mathematics', questionNo: 45,
    questionText: 'The transpose of matrix A = [[1,2],[3,4]] is:',
    options: ['[[1,3],[2,4]]', '[[4,3],[2,1]]', '[[1,2],[3,4]]', '[[2,1],[4,3]]', '[[-1,-2],[-3,-4]]'],
    correctOption: 0,
    explanation: 'Transpose swaps rows and columns'
  },
  {
    id: 'm46', subject: 'Mathematics', questionNo: 46,
    questionText: 'The value of sin²θ + cos²θ is always:',
    options: ['0', '2', 'sin θ', 'cos θ', '1'],
    correctOption: 4,
    explanation: 'Fundamental identity: sin²θ + cos²θ = 1'
  },
  {
    id: 'm47', subject: 'Mathematics', questionNo: 47,
    questionText: 'Solve: 2x + 3 = 11',
    options: ['x = 2', 'x = 3', 'x = 4', 'x = 5', 'x = 7'],
    correctOption: 2,
    explanation: '2x = 8, x = 4'
  },
  {
    id: 'm48', subject: 'Mathematics', questionNo: 48,
    questionText: 'The product of the roots of x² - 5x + 6 = 0 is:',
    options: ['5', '-5', '6', '-6', '3'],
    correctOption: 2,
    explanation: 'Product of roots = c/a = 6/1 = 6'
  },
  {
    id: 'm49', subject: 'Mathematics', questionNo: 49,
    questionText: 'The slope of a horizontal line is:',
    options: ['1', '-1', '∞', '0', 'Undefined'],
    correctOption: 3,
    explanation: 'Horizontal lines have slope = 0'
  },
  {
    id: 'm50', subject: 'Mathematics', questionNo: 50,
    questionText: 'The value of e⁰ is:',
    options: ['0', 'e', '1', '-1', '∞'],
    correctOption: 2,
    explanation: 'Any non-zero number to the power 0 is 1'
  },
  {
    id: 'm51', subject: 'Mathematics', questionNo: 51,
    questionText: 'If A = {1,2,3} and B = {2,3,4}, then A ∩ B is:',
    options: ['{1,2,3,4}', '{1,4}', '{2,3}', '{1}', '{}'],
    correctOption: 2,
    explanation: 'A ∩ B = elements common to both = {2,3}'
  },
  {
    id: 'm52', subject: 'Mathematics', questionNo: 52,
    questionText: 'The maximum value of sin x is:',
    options: ['0', '∞', '-1', '2', '1'],
    correctOption: 4,
    explanation: 'Maximum value of sin x is 1 (at x = π/2)'
  },
  {
    id: 'm53', subject: 'Mathematics', questionNo: 53,
    questionText: 'The value of ∫₀¹ x dx is:',
    options: ['1', '1/4', '1/2', '2', '0'],
    correctOption: 2,
    explanation: '[x²/2]₀¹ = 1/2 - 0 = 1/2'
  },
  {
    id: 'm54', subject: 'Mathematics', questionNo: 54,
    questionText: 'The number of solutions of cos x = 1 in [0, 2π] is:',
    options: ['0', '1', '2', '3', '∞'],
    correctOption: 1,
    explanation: 'cos x = 1 only at x = 0 in [0, 2π], so 1 solution'
  },
  {
    id: 'm55', subject: 'Mathematics', questionNo: 55,
    questionText: 'If f(x) = x³, then f\'(x) is:',
    options: ['x²', '3x', '3x²', 'x³/3', '3x³'],
    correctOption: 2,
    explanation: 'f\'(x) = 3x²'
  },
  {
    id: 'm56', subject: 'Mathematics', questionNo: 56,
    questionText: 'The vertex of the parabola y = x² - 4x + 5 is:',
    options: ['(2,1)', '(-2,1)', '(2,-1)', '(4,5)', '(0,5)'],
    correctOption: 0,
    explanation: 'x = -b/2a = 4/2 = 2, y = 4 - 8 + 5 = 1 → (2,1)'
  },
  {
    id: 'm57', subject: 'Mathematics', questionNo: 57,
    questionText: 'The value of sin(A + B) is:',
    options: ['sin A + sin B', 'sin A · cos B + cos A · sin B', 'sin A · sin B - cos A · cos B', 'cos A · cos B - sin A · sin B', 'sin A · cos B - cos A · sin B'],
    correctOption: 1,
    explanation: 'sin(A+B) = sin A cos B + cos A sin B'
  },
  {
    id: 'm58', subject: 'Mathematics', questionNo: 58,
    questionText: 'What is the inverse of matrix [[2,0],[0,3]]?',
    options: ['[[1/2,0],[0,1/3]]', '[[3,0],[0,2]]', '[[2,0],[0,3]]', '[[-2,0],[0,-3]]', '[[0,2],[3,0]]'],
    correctOption: 0,
    explanation: 'Inverse of diagonal matrix: reciprocals of diagonal elements'
  },
  {
    id: 'm59', subject: 'Mathematics', questionNo: 59,
    questionText: 'The sum of first 100 natural numbers is:',
    options: ['5000', '5050', '4950', '10100', '10000'],
    correctOption: 1,
    explanation: 'n(n+1)/2 = 100×101/2 = 5050'
  },
  {
    id: 'm60', subject: 'Mathematics', questionNo: 60,
    questionText: 'Which of the following is a rational number?',
    options: ['√2', 'π', '√3', '22/7', 'e'],
    correctOption: 3,
    explanation: '22/7 is a rational number (ratio of two integers)'
  },
  {
    id: 'm61', subject: 'Mathematics', questionNo: 61,
    questionText: 'The value of log(ab) is:',
    options: ['log a × log b', 'log a + log b', 'log a - log b', 'log a / log b', 'log(a+b)'],
    correctOption: 1,
    explanation: 'log(ab) = log a + log b (product rule of logarithms)'
  },
  {
    id: 'm62', subject: 'Mathematics', questionNo: 62,
    questionText: 'The coefficient of x³ in (1+x)^5 is:',
    options: ['5', '10', '15', '20', '1'],
    correctOption: 1,
    explanation: 'C(5,3) = 10'
  },
  {
    id: 'm63', subject: 'Mathematics', questionNo: 63,
    questionText: 'The direction cosines of a line making equal angles with axes satisfy:',
    options: ['l = m = n = 0', 'l² + m² + n² = 0', 'l = m = n = 1/√3', 'l + m + n = 1', 'l = m = n = 1'],
    correctOption: 2,
    explanation: 'l = m = n and l²+m²+n² = 1 → 3l² = 1 → l = 1/√3'
  },
  {
    id: 'm64', subject: 'Mathematics', questionNo: 64,
    questionText: 'The standard deviation of 2, 4, 6, 8, 10 is:',
    options: ['2', '√8', '√10', '2√2', '4'],
    correctOption: 3,
    explanation: 'Mean=6, Variance = [(16+4+0+4+16)/5] = 8, SD = 2√2'
  },
  {
    id: 'm65', subject: 'Mathematics', questionNo: 65,
    questionText: 'The conjugate of 3 + 4i is:',
    options: ['3 - 4i', '-3 + 4i', '-3 - 4i', '4 - 3i', '3 + 4i'],
    correctOption: 0,
    explanation: 'Conjugate of a+bi is a-bi'
  },
  {
    id: 'm66', subject: 'Mathematics', questionNo: 66,
    questionText: 'If f(x) = 2x and g(x) = x², then (f∘g)(x) is:',
    options: ['2x²', '4x²', '2x + x²', '(2x)²', 'x² + 2x'],
    correctOption: 0,
    explanation: '(f∘g)(x) = f(g(x)) = f(x²) = 2x²'
  },
  {
    id: 'm67', subject: 'Mathematics', questionNo: 67,
    questionText: 'The equation of x-axis is:',
    options: ['x = 0', 'y = 0', 'z = 0', 'x = y', 'x + y = 0'],
    correctOption: 1,
    explanation: 'x-axis is defined by y = 0'
  },
  {
    id: 'm68', subject: 'Mathematics', questionNo: 68,
    questionText: 'The value of ⁸C₄ is:',
    options: ['28', '56', '70', '112', '40'],
    correctOption: 2,
    explanation: '⁸C₄ = 8!/(4!4!) = 70'
  },
  {
    id: 'm69', subject: 'Mathematics', questionNo: 69,
    questionText: 'The period of sin x is:',
    options: ['π', '2π', 'π/2', '3π', '4π'],
    correctOption: 1,
    explanation: 'Period of sin x = 2π'
  },
  {
    id: 'm70', subject: 'Mathematics', questionNo: 70,
    questionText: 'The value of d/dx(tan x) is:',
    options: ['sec x', 'cosec x', 'cot x', 'sec²x', '-cosec²x'],
    correctOption: 3,
    explanation: 'd/dx(tan x) = sec²x'
  },
  {
    id: 'm71', subject: 'Mathematics', questionNo: 71,
    questionText: 'A function f is one-one if:',
    options: ['f(a) = f(b) implies a ≠ b', 'f(a) ≠ f(b) implies a = b', 'f(a) = f(b) implies a = b', 'Every element has a preimage', 'f is onto'],
    correctOption: 2,
    explanation: 'A function is one-one (injective) if f(a)=f(b) ⟹ a=b'
  },
  {
    id: 'm72', subject: 'Mathematics', questionNo: 72,
    questionText: 'The value of Σr from r=1 to n of r² is:',
    options: ['n(n+1)/2', 'n(n+1)(2n+1)/6', '[n(n+1)/2]²', 'n²(n+1)/2', 'n(n+1)(n+2)/6'],
    correctOption: 1,
    explanation: 'Σr² = n(n+1)(2n+1)/6'
  },
  {
    id: 'm73', subject: 'Mathematics', questionNo: 73,
    questionText: 'The midpoint of segment joining (2, 4) and (6, 8) is:',
    options: ['(4, 6)', '(3, 5)', '(8, 12)', '(2, 2)', '(4, 4)'],
    correctOption: 0,
    explanation: 'Midpoint = ((2+6)/2, (4+8)/2) = (4, 6)'
  },
  {
    id: 'm74', subject: 'Mathematics', questionNo: 74,
    questionText: 'The value of sin 30° × cos 60° is:',
    options: ['1/2', '1/4', '√3/4', '√3/2', '1'],
    correctOption: 1,
    explanation: 'sin 30° = 1/2, cos 60° = 1/2, product = 1/4'
  },
  {
    id: 'm75', subject: 'Mathematics', questionNo: 75,
    questionText: 'The equation of line passing through (0,0) with slope 2 is:',
    options: ['y = 2', 'x = 2', 'y = 2x', '2x + y = 0', 'y = x + 2'],
    correctOption: 2,
    explanation: 'y = mx + c, c = 0, m = 2 → y = 2x'
  },

  // ─────────────────────── PHYSICS (Q76–Q120) ───────────────────────
  {
    id: 'p1', subject: 'Physics', questionNo: 76,
    questionText: 'A car starts from rest and accelerates uniformly at 2 m/s² for 10 s. The distance covered is:',
    options: ['50 m', '100 m', '150 m', '200 m', '250 m'],
    correctOption: 1,
    explanation: 's = ut + ½at² = 0 + ½×2×100 = 100 m'
  },
  {
    id: 'p2', subject: 'Physics', questionNo: 77,
    questionText: 'The SI unit of magnetic flux density is:',
    options: ['Weber', 'Tesla', 'Henry', 'Farad', 'Gauss'],
    correctOption: 1,
    explanation: 'Tesla (T) is the SI unit of magnetic flux density (B)'
  },
  {
    id: 'p3', subject: 'Physics', questionNo: 78,
    questionText: 'The refractive index of glass is 1.5. The speed of light in glass is:',
    options: ['3 × 10⁸ m/s', '2 × 10⁸ m/s', '1.5 × 10⁸ m/s', '4.5 × 10⁸ m/s', '1 × 10⁸ m/s'],
    correctOption: 1,
    explanation: 'v = c/n = (3×10⁸)/1.5 = 2×10⁸ m/s'
  },
  {
    id: 'p4', subject: 'Physics', questionNo: 79,
    questionText: 'The work done by a force of 10 N moving a body through 5 m at angle 60° is:',
    options: ['50 J', '25 J', '25√3 J', '10 J', '43.3 J'],
    correctOption: 1,
    explanation: 'W = Fs cosθ = 10×5×cos60° = 50×0.5 = 25 J'
  },
  {
    id: 'p5', subject: 'Physics', questionNo: 80,
    questionText: 'The dimensional formula of pressure is:',
    options: ['[MLT⁻²]', '[ML⁻¹T⁻²]', '[ML²T⁻²]', '[M⁰L⁰T⁰]', '[MLT⁻¹]'],
    correctOption: 1,
    explanation: 'Pressure = Force/Area → [MLT⁻²]/[L²] = [ML⁻¹T⁻²]'
  },
  {
    id: 'p6', subject: 'Physics', questionNo: 81,
    questionText: 'Which law states that the total energy of an isolated system is conserved?',
    options: ['Newton\'s 2nd Law', 'Ohm\'s Law', 'Law of Conservation of Energy', 'Gauss\'s Law', 'Hooke\'s Law'],
    correctOption: 2,
    explanation: 'The First Law of Thermodynamics / Law of Conservation of Energy'
  },
  {
    id: 'p7', subject: 'Physics', questionNo: 82,
    questionText: 'The time period of a simple pendulum depends on:',
    options: ['Mass of bob', 'Length and g', 'Amplitude', 'Material of bob', 'All of above'],
    correctOption: 1,
    explanation: 'T = 2π√(L/g) — depends on length L and g only'
  },
  {
    id: 'p8', subject: 'Physics', questionNo: 83,
    questionText: 'The equivalent resistance of two resistors R₁ and R₂ in parallel is:',
    options: ['R₁ + R₂', 'R₁R₂/(R₁+R₂)', '(R₁+R₂)/2', '1/(R₁+R₂)', 'R₁ - R₂'],
    correctOption: 1,
    explanation: '1/R = 1/R₁ + 1/R₂ → R = R₁R₂/(R₁+R₂)'
  },
  {
    id: 'p9', subject: 'Physics', questionNo: 84,
    questionText: 'Photoelectric effect was explained by:',
    options: ['Maxwell', 'Newton', 'Einstein', 'Bohr', 'Planck'],
    correctOption: 2,
    explanation: 'Einstein explained the photoelectric effect using photon theory (Nobel Prize 1921)'
  },
  {
    id: 'p10', subject: 'Physics', questionNo: 85,
    questionText: 'The escape velocity from Earth\'s surface is approximately:',
    options: ['7.9 km/s', '11.2 km/s', '15 km/s', '3 km/s', '9.8 km/s'],
    correctOption: 1,
    explanation: 'Escape velocity = √(2gR) ≈ 11.2 km/s for Earth'
  },
  {
    id: 'p11', subject: 'Physics', questionNo: 86,
    questionText: 'The phenomenon of splitting of white light into colors by a prism is called:',
    options: ['Reflection', 'Refraction', 'Dispersion', 'Diffraction', 'Polarization'],
    correctOption: 2,
    explanation: 'Dispersion: white light splits into constituent colors due to different refractive indices'
  },
  {
    id: 'p12', subject: 'Physics', questionNo: 87,
    questionText: 'A body is in equilibrium if the net force on it is:',
    options: ['Maximum', 'Minimum', 'Zero', 'Constant', 'Variable'],
    correctOption: 2,
    explanation: 'For equilibrium: ΣF = 0 and Στ = 0'
  },
  {
    id: 'p13', subject: 'Physics', questionNo: 88,
    questionText: 'The charge on an electron is approximately:',
    options: ['1.6 × 10⁻¹⁹ C', '9.1 × 10⁻³¹ C', '1.67 × 10⁻²⁷ C', '6.02 × 10²³ C', '1.6 × 10¹⁹ C'],
    correctOption: 0,
    explanation: 'e = 1.6 × 10⁻¹⁹ C'
  },
  {
    id: 'p14', subject: 'Physics', questionNo: 89,
    questionText: 'Ohm\'s law states that V is proportional to I provided:',
    options: ['Temperature changes', 'Temperature is constant', 'Resistance changes', 'Power is zero', 'Current is zero'],
    correctOption: 1,
    explanation: 'V = IR holds when temperature (and hence resistance) is constant'
  },
  {
    id: 'p15', subject: 'Physics', questionNo: 90,
    questionText: 'The process by which heat is transferred through electromagnetic waves is:',
    options: ['Conduction', 'Convection', 'Radiation', 'Advection', 'Diffusion'],
    correctOption: 2,
    explanation: 'Radiation does not require a medium; transfers via EM waves'
  },
  {
    id: 'p16', subject: 'Physics', questionNo: 91,
    questionText: 'The Bohr\'s model of atom assumes that electrons move in:',
    options: ['Elliptical orbits', 'Random paths', 'Circular orbits with fixed energy', 'Parabolic paths', 'Stationary positions'],
    correctOption: 2,
    explanation: 'Bohr postulated discrete circular orbits with quantized angular momentum'
  },
  {
    id: 'p17', subject: 'Physics', questionNo: 92,
    questionText: 'The unit of electric potential is:',
    options: ['Ampere', 'Watt', 'Volt', 'Ohm', 'Coulomb'],
    correctOption: 2,
    explanation: 'Electric potential is measured in Volts (V) = J/C'
  },
  {
    id: 'p18', subject: 'Physics', questionNo: 93,
    questionText: 'The acceleration due to gravity on the moon is approximately:',
    options: ['9.8 m/s²', '1.6 m/s²', '3.7 m/s²', '6.7 m/s²', '0 m/s²'],
    correctOption: 1,
    explanation: 'g_moon ≈ 1.6 m/s² ≈ g/6'
  },
  {
    id: 'p19', subject: 'Physics', questionNo: 94,
    questionText: 'In a transformer, if the primary has 200 turns and secondary has 400 turns, it is a:',
    options: ['Step-down transformer', 'Step-up transformer', 'Isolating transformer', 'Auto-transformer', 'Current transformer'],
    correctOption: 1,
    explanation: 'N_s > N_p → voltage steps up → Step-up transformer'
  },
  {
    id: 'p20', subject: 'Physics', questionNo: 95,
    questionText: 'Which type of wave requires a medium for propagation?',
    options: ['X-rays', 'Light waves', 'Radio waves', 'Sound waves', 'Gamma rays'],
    correctOption: 3,
    explanation: 'Sound waves are mechanical waves requiring a medium'
  },
  {
    id: 'p21', subject: 'Physics', questionNo: 96,
    questionText: 'The moment of inertia of a solid sphere about its diameter is:',
    options: ['MR²', '2MR²/3', '2MR²/5', 'MR²/2', 'MR²/4'],
    correctOption: 2,
    explanation: 'I = 2/5 MR² for solid sphere about diameter'
  },
  {
    id: 'p22', subject: 'Physics', questionNo: 97,
    questionText: 'What does an ammeter measure?',
    options: ['Voltage', 'Resistance', 'Power', 'Current', 'Capacitance'],
    correctOption: 3,
    explanation: 'Ammeter measures electric current; connected in series'
  },
  {
    id: 'p23', subject: 'Physics', questionNo: 98,
    questionText: 'The speed of sound in air at 0°C is approximately:',
    options: ['340 m/s', '332 m/s', '300 m/s', '350 m/s', '380 m/s'],
    correctOption: 1,
    explanation: 'Speed of sound in air at 0°C ≈ 332 m/s'
  },
  {
    id: 'p24', subject: 'Physics', questionNo: 99,
    questionText: 'The phenomenon where light bends around obstacles is called:',
    options: ['Reflection', 'Refraction', 'Dispersion', 'Diffraction', 'Polarization'],
    correctOption: 3,
    explanation: 'Diffraction is the bending of light around corners/obstacles'
  },
  {
    id: 'p25', subject: 'Physics', questionNo: 100,
    questionText: 'The wavelength of visible light range is approximately:',
    options: ['1 nm – 100 nm', '100 nm – 400 nm', '400 nm – 700 nm', '700 nm – 1000 nm', '1000 nm – 10000 nm'],
    correctOption: 2,
    explanation: 'Visible light: 400 nm (violet) to 700 nm (red)'
  },
  {
    id: 'p26', subject: 'Physics', questionNo: 101,
    questionText: 'The first law of thermodynamics is essentially:',
    options: ['Newton\'s law', 'Law of momentum', 'Law of energy conservation', 'Law of entropy', 'Boyle\'s law'],
    correctOption: 2,
    explanation: 'First law: ΔU = Q - W (energy conservation for thermodynamic systems)'
  },
  {
    id: 'p27', subject: 'Physics', questionNo: 102,
    questionText: 'The gravitational force between two masses is proportional to:',
    options: ['Sum of masses', 'Difference of masses', 'Product of masses', 'Square of masses', 'Square root of masses'],
    correctOption: 2,
    explanation: 'F = Gm₁m₂/r², proportional to product of masses'
  },
  {
    id: 'p28', subject: 'Physics', questionNo: 103,
    questionText: 'If KE = p²/2m, what is the relation between KE and momentum p?',
    options: ['KE ∝ p', 'KE ∝ p²', 'KE ∝ 1/p', 'KE ∝ p³', 'KE ∝ √p'],
    correctOption: 1,
    explanation: 'KE = p²/2m → KE ∝ p²'
  },
  {
    id: 'p29', subject: 'Physics', questionNo: 104,
    questionText: 'An object projected horizontally has zero initial vertical velocity. The trajectory is:',
    options: ['Straight line', 'Circle', 'Parabola', 'Ellipse', 'Hyperbola'],
    correctOption: 2,
    explanation: 'Projectile motion follows a parabolic trajectory'
  },
  {
    id: 'p30', subject: 'Physics', questionNo: 105,
    questionText: 'The nuclear force is:',
    options: ['Long range attractive', 'Short range repulsive', 'Short range attractive', 'Long range repulsive', 'Equal to gravity'],
    correctOption: 2,
    explanation: 'Nuclear force is short range (≈1-3 fm) and strongly attractive'
  },
  {
    id: 'p31', subject: 'Physics', questionNo: 106,
    questionText: 'A 100 W bulb is used for 10 hours. Energy consumed is:',
    options: ['100 Wh', '10 Wh', '1000 Wh = 1 kWh', '10 kWh', '100 kWh'],
    correctOption: 2,
    explanation: 'E = P × t = 100W × 10h = 1000 Wh = 1 kWh'
  },
  {
    id: 'p32', subject: 'Physics', questionNo: 107,
    questionText: 'The SI unit of frequency is:',
    options: ['Metre', 'Second', 'Hertz', 'Newton', 'Joule'],
    correctOption: 2,
    explanation: 'Frequency is measured in Hertz (Hz) = s⁻¹'
  },
  {
    id: 'p33', subject: 'Physics', questionNo: 108,
    questionText: 'The ratio of charge to mass (e/m) for an electron was determined by:',
    options: ['Millikan', 'Rutherford', 'J.J. Thomson', 'Bohr', 'Einstein'],
    correctOption: 2,
    explanation: 'J.J. Thomson measured e/m ratio using cathode ray tube experiment'
  },
  {
    id: 'p34', subject: 'Physics', questionNo: 109,
    questionText: 'Lenz\'s law is related to:',
    options: ['Refraction', 'Electromagnetic induction', 'Photoelectric effect', 'Nuclear fission', 'Gravity'],
    correctOption: 1,
    explanation: 'Lenz\'s law: induced EMF opposes the change in magnetic flux (electromagnetic induction)'
  },
  {
    id: 'p35', subject: 'Physics', questionNo: 110,
    questionText: 'The de Broglie wavelength of a particle is:',
    options: ['λ = h/mv', 'λ = mv/h', 'λ = hm/v', 'λ = h/(mv)²', 'λ = mv²/h'],
    correctOption: 0,
    explanation: 'de Broglie wavelength: λ = h/p = h/mv'
  },
  {
    id: 'p36', subject: 'Physics', questionNo: 111,
    questionText: 'A concave lens always forms:',
    options: ['Real, magnified image', 'Real, diminished image', 'Virtual, erect, diminished image', 'Virtual, inverted image', 'No image'],
    correctOption: 2,
    explanation: 'Concave (diverging) lens always forms virtual, erect, and diminished image'
  },
  {
    id: 'p37', subject: 'Physics', questionNo: 112,
    questionText: 'The force on a moving charge in a magnetic field is given by:',
    options: ['F = qE', 'F = qv', 'F = qvB sinθ', 'F = qvB cosθ', 'F = qB'],
    correctOption: 2,
    explanation: 'Lorentz force: F = qvB sinθ'
  },
  {
    id: 'p38', subject: 'Physics', questionNo: 113,
    questionText: 'What is the half-life of a radioactive substance if 3/4 of it decays in 20 years?',
    options: ['5 years', '10 years', '20 years', '40 years', '15 years'],
    correctOption: 1,
    explanation: 'After 2 half-lives, 3/4 decays → 2T₁/₂ = 20 → T₁/₂ = 10 years'
  },
  {
    id: 'p39', subject: 'Physics', questionNo: 114,
    questionText: 'Which of the following is NOT an electromagnetic wave?',
    options: ['X-rays', 'Gamma rays', 'UV rays', 'Sound waves', 'Radio waves'],
    correctOption: 3,
    explanation: 'Sound waves are mechanical (longitudinal) waves, not electromagnetic'
  },
  {
    id: 'p40', subject: 'Physics', questionNo: 115,
    questionText: 'The device used to measure very small electric currents is:',
    options: ['Voltmeter', 'Galvanometer', 'Ammeter', 'Potentiometer', 'Ohmmeter'],
    correctOption: 1,
    explanation: 'Galvanometer detects and measures very small currents'
  },
  {
    id: 'p41', subject: 'Physics', questionNo: 116,
    questionText: 'Young\'s double slit experiment demonstrates:',
    options: ['Photoelectric effect', 'Wave nature of light', 'Particle nature of light', 'X-ray diffraction', 'Radioactivity'],
    correctOption: 1,
    explanation: 'Young\'s experiment shows interference — wave nature of light'
  },
  {
    id: 'p42', subject: 'Physics', questionNo: 117,
    questionText: 'The p-n junction diode allows current to flow:',
    options: ['In both directions', 'Only in reverse bias', 'Only in forward bias', 'Only at high temperature', 'Never'],
    correctOption: 2,
    explanation: 'In forward bias, diode conducts; in reverse bias, it blocks current'
  },
  {
    id: 'p43', subject: 'Physics', questionNo: 118,
    questionText: 'Bernoulli\'s theorem is based on:',
    options: ['Mass conservation', 'Momentum conservation', 'Energy conservation', 'Charge conservation', 'Newton\'s 3rd law'],
    correctOption: 2,
    explanation: 'Bernoulli\'s equation is derived from energy conservation for fluid flow'
  },
  {
    id: 'p44', subject: 'Physics', questionNo: 119,
    questionText: 'The uncertainty principle was proposed by:',
    options: ['Bohr', 'Einstein', 'Heisenberg', 'Schrödinger', 'Pauli'],
    correctOption: 2,
    explanation: 'Heisenberg\'s uncertainty principle: ΔxΔp ≥ ħ/2'
  },
  {
    id: 'p45', subject: 'Physics', questionNo: 120,
    questionText: 'In a series LCR circuit at resonance, the impedance is:',
    options: ['Maximum', 'Zero', 'Equal to R', 'Equal to XL', 'Equal to XC'],
    correctOption: 2,
    explanation: 'At resonance XL = XC, so Z = R (purely resistive)'
  },

  // ─────────────────────── CHEMISTRY (Q121–Q150) ───────────────────────
  {
    id: 'c1', subject: 'Chemistry', questionNo: 121,
    questionText: 'Which of the following has the highest electronegativity?',
    options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen', 'Bromine'],
    correctOption: 2,
    explanation: 'Fluorine has the highest electronegativity (3.98 on Pauling scale)'
  },
  {
    id: 'c2', subject: 'Chemistry', questionNo: 122,
    questionText: 'The pH of a 0.01 M HCl solution is:',
    options: ['1', '2', '7', '12', '0'],
    correctOption: 1,
    explanation: 'pH = -log[H⁺] = -log(0.01) = 2'
  },
  {
    id: 'c3', subject: 'Chemistry', questionNo: 123,
    questionText: 'Which of the following is a greenhouse gas?',
    options: ['Nitrogen', 'Oxygen', 'Argon', 'Methane', 'Neon'],
    correctOption: 3,
    explanation: 'Methane (CH₄) is a potent greenhouse gas'
  },
  {
    id: 'c4', subject: 'Chemistry', questionNo: 124,
    questionText: 'The number of electrons in the outermost shell of a noble gas (except He) is:',
    options: ['2', '4', '6', '8', '7'],
    correctOption: 3,
    explanation: 'Noble gases (Ne, Ar, Kr...) have 8 electrons in their outermost shell'
  },
  {
    id: 'c5', subject: 'Chemistry', questionNo: 125,
    questionText: 'Which law states that equal volumes of gases at same T and P contain equal number of molecules?',
    options: ['Boyle\'s Law', 'Charles\' Law', 'Avogadro\'s Law', 'Dalton\'s Law', 'Henry\'s Law'],
    correctOption: 2,
    explanation: 'Avogadro\'s law: equal volumes of gases at same conditions contain equal molecules'
  },
  {
    id: 'c6', subject: 'Chemistry', questionNo: 126,
    questionText: 'The molar mass of water (H₂O) is:',
    options: ['16 g/mol', '18 g/mol', '20 g/mol', '12 g/mol', '36 g/mol'],
    correctOption: 1,
    explanation: 'H₂O: 2(1) + 16 = 18 g/mol'
  },
  {
    id: 'c7', subject: 'Chemistry', questionNo: 127,
    questionText: 'Which type of bond is formed by sharing of electrons?',
    options: ['Ionic bond', 'Metallic bond', 'Covalent bond', 'Hydrogen bond', 'Van der Waals'],
    correctOption: 2,
    explanation: 'Covalent bond: formed by sharing of electron pairs between atoms'
  },
  {
    id: 'c8', subject: 'Chemistry', questionNo: 128,
    questionText: 'The atomic number of Carbon is:',
    options: ['4', '6', '8', '12', '14'],
    correctOption: 1,
    explanation: 'Carbon has atomic number 6 (6 protons)'
  },
  {
    id: 'c9', subject: 'Chemistry', questionNo: 129,
    questionText: 'Which of the following is an example of an exothermic reaction?',
    options: ['Photosynthesis', 'Dissolution of NaCl in water', 'Combustion of methane', 'Electrolysis of water', 'Cooking of food'],
    correctOption: 2,
    explanation: 'Combustion releases heat → exothermic: CH₄ + 2O₂ → CO₂ + 2H₂O + heat'
  },
  {
    id: 'c10', subject: 'Chemistry', questionNo: 130,
    questionText: 'The hybridization of carbon in methane (CH₄) is:',
    options: ['sp', 'sp²', 'sp³', 'sp³d', 'sp³d²'],
    correctOption: 2,
    explanation: 'CH₄ has tetrahedral geometry, carbon is sp³ hybridized'
  },
  {
    id: 'c11', subject: 'Chemistry', questionNo: 131,
    questionText: 'Which acid is present in vinegar?',
    options: ['Citric acid', 'Oxalic acid', 'Acetic acid', 'Tartaric acid', 'Lactic acid'],
    correctOption: 2,
    explanation: 'Vinegar contains 5-8% acetic acid (CH₃COOH)'
  },
  {
    id: 'c12', subject: 'Chemistry', questionNo: 132,
    questionText: 'The process of conversion of glucose to ethanol is:',
    options: ['Oxidation', 'Reduction', 'Fermentation', 'Hydrolysis', 'Saponification'],
    correctOption: 2,
    explanation: 'Fermentation by yeast: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂'
  },
  {
    id: 'c13', subject: 'Chemistry', questionNo: 133,
    questionText: 'The IUPAC name of CH₃-CH₂-OH is:',
    options: ['Methanol', 'Ethanol', 'Propanol', 'Butanol', 'Ethanoic acid'],
    correctOption: 1,
    explanation: 'CH₃-CH₂-OH is ethanol (2 carbon alcohol)'
  },
  {
    id: 'c14', subject: 'Chemistry', questionNo: 134,
    questionText: 'Which of the following is a reducing agent in the reaction between Zn and CuSO₄?',
    options: ['Cu', 'SO₄²⁻', 'Zn', 'CuSO₄', 'ZnSO₄'],
    correctOption: 2,
    explanation: 'Zn loses electrons (oxidized), acts as reducing agent'
  },
  {
    id: 'c15', subject: 'Chemistry', questionNo: 135,
    questionText: 'The shape of the water molecule (H₂O) is:',
    options: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Bent/V-shaped', 'Octahedral'],
    correctOption: 3,
    explanation: 'H₂O is V-shaped/bent due to 2 lone pairs on oxygen'
  },
  {
    id: 'c16', subject: 'Chemistry', questionNo: 136,
    questionText: 'Avogadro\'s number is approximately:',
    options: ['6.02 × 10²²', '6.02 × 10²³', '6.02 × 10²⁴', '3.01 × 10²³', '1.38 × 10⁻²³'],
    correctOption: 1,
    explanation: 'Avogadro\'s number Nₐ = 6.022 × 10²³ mol⁻¹'
  },
  {
    id: 'c17', subject: 'Chemistry', questionNo: 137,
    questionText: 'The periodic table is arranged in order of:',
    options: ['Atomic mass', 'Atomic number', 'Valence electrons', 'Electron affinity', 'Ionization energy'],
    correctOption: 1,
    explanation: 'Modern periodic table is arranged by increasing atomic number'
  },
  {
    id: 'c18', subject: 'Chemistry', questionNo: 138,
    questionText: 'Which of the following gases has the smell of rotten eggs?',
    options: ['SO₂', 'NH₃', 'H₂S', 'CO₂', 'Cl₂'],
    correctOption: 2,
    explanation: 'H₂S (hydrogen sulfide) has a characteristic rotten egg smell'
  },
  {
    id: 'c19', subject: 'Chemistry', questionNo: 139,
    questionText: 'The catalyst used in the Haber process for ammonia synthesis is:',
    options: ['Platinum', 'Vanadium pentoxide', 'Iron', 'Nickel', 'Manganese dioxide'],
    correctOption: 2,
    explanation: 'Haber process: N₂ + 3H₂ → 2NH₃, uses iron catalyst with promoters'
  },
  {
    id: 'c20', subject: 'Chemistry', questionNo: 140,
    questionText: 'An isotope of Carbon-12 with 8 neutrons is:',
    options: ['¹²C', '¹³C', '¹⁴C', '¹¹C', '¹⁶C'],
    correctOption: 2,
    explanation: 'Carbon has 6 protons; with 8 neutrons: mass number = 14 → ¹⁴C'
  },
  {
    id: 'c21', subject: 'Chemistry', questionNo: 141,
    questionText: 'Soap is made by the process of:',
    options: ['Fermentation', 'Saponification', 'Oxidation', 'Esterification', 'Hydrogenation'],
    correctOption: 1,
    explanation: 'Soap is made by saponification: hydrolysis of fats/oils with NaOH'
  },
  {
    id: 'c22', subject: 'Chemistry', questionNo: 142,
    questionText: 'The electronic configuration of Na (Z=11) is:',
    options: ['2,8,1', '2,9', '2,8,2', '2,7,2', '2,6,3'],
    correctOption: 0,
    explanation: 'Na: 1s²2s²2p⁶3s¹ → 2,8,1'
  },
  {
    id: 'c23', subject: 'Chemistry', questionNo: 143,
    questionText: 'Which of the following is the strongest acid?',
    options: ['HF', 'HCl', 'HBr', 'HI', 'CH₃COOH'],
    correctOption: 3,
    explanation: 'HI is the strongest acid among hydrohalic acids (bond strength decreases down the group)'
  },
  {
    id: 'c24', subject: 'Chemistry', questionNo: 144,
    questionText: 'The formula for baking soda is:',
    options: ['Na₂CO₃', 'NaHCO₃', 'NaOH', 'CaCO₃', 'Na₂SO₄'],
    correctOption: 1,
    explanation: 'Baking soda = Sodium bicarbonate = NaHCO₃'
  },
  {
    id: 'c25', subject: 'Chemistry', questionNo: 145,
    questionText: 'The number of sigma bonds in ethylene (C₂H₄) is:',
    options: ['3', '4', '5', '6', '2'],
    correctOption: 2,
    explanation: 'C₂H₄: 4 C-H sigma bonds + 1 C-C sigma bond = 5 sigma bonds'
  },
  {
    id: 'c26', subject: 'Chemistry', questionNo: 146,
    questionText: 'Galvanization is the process of coating iron with:',
    options: ['Tin', 'Copper', 'Zinc', 'Nickel', 'Chromium'],
    correctOption: 2,
    explanation: 'Galvanization: coating iron/steel with zinc to prevent corrosion'
  },
  {
    id: 'c27', subject: 'Chemistry', questionNo: 147,
    questionText: 'Which of the following is a colloidal solution?',
    options: ['Salt water', 'Sugar solution', 'Milk', 'Copper sulphate solution', 'Air'],
    correctOption: 2,
    explanation: 'Milk is a colloid (fat droplets dispersed in water)'
  },
  {
    id: 'c28', subject: 'Chemistry', questionNo: 148,
    questionText: 'The oxidation state of Cr in K₂Cr₂O₇ is:',
    options: ['+3', '+4', '+5', '+6', '+7'],
    correctOption: 3,
    explanation: '2(1) + 2x + 7(-2) = 0 → 2x = 12 → x = +6'
  },
  {
    id: 'c29', subject: 'Chemistry', questionNo: 149,
    questionText: 'Le Chatelier\'s principle states that if a system in equilibrium is disturbed:',
    options: ['It shifts to increase disturbance', 'It shifts to nullify the disturbance', 'It remains unchanged', 'Temperature always decreases', 'Concentration always increases'],
    correctOption: 1,
    explanation: 'Le Chatelier\'s principle: system shifts to oppose/counteract the imposed change'
  },
  {
    id: 'c30', subject: 'Chemistry', questionNo: 150,
    questionText: 'Which functional group is present in aldehydes?',
    options: ['-OH', '-COOH', '-CHO', '-CO-', '-NH₂'],
    correctOption: 2,
    explanation: 'Aldehydes contain the -CHO (formyl) functional group'
  },
];

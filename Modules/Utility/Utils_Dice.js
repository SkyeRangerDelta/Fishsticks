// ---- Dice Utility ----
// Native replacement for the 'roll' npm package.
// Supports standard dice notation: NdN, d%, +, -, *, /, best-of (b), worst-of (w).

const SEGMENT_REGEX = /^(\d*)d(\d+|%)(?:([bw*\/])(\d+))?$/;
const CONSTANT_REGEX = /^\d+$/;

//Exports
module.exports = { validate, roll };

//Functions
function validate( notation ) {
	if ( !notation || typeof notation !== 'string' ) return false;

	const segments = notation.split( /[\+\-]/ );
	if ( segments.length === 0 || segments.some( s => s === '' ) ) return false;

	let hasDice = false;
	for ( const seg of segments ) {
		if ( seg.includes( 'd' ) ) {
			if ( !SEGMENT_REGEX.test( seg ) ) return false;
			hasDice = true;
		}
		else if ( !CONSTANT_REGEX.test( seg ) ) {
			return false;
		}
	}

	return hasDice;
}

function roll( notation ) {
	if ( !validate( notation ) ) return null;

	// Split on + and - (matching original roll package behavior)
	const segments = notation.split( /[\+\-]/ );
	const operators = ['+'];
	let opIdx = 0;

	for ( let i = 0; i < segments.length - 1; i++ ) {
		opIdx += segments[i].length;
		operators.push( notation[opIdx] );
		opIdx++;
	}

	const allRolled = [];
	const calcSteps = [];
	let runningTotal = 0;
	const isSimpleRoll = segments.length === 1 && segments[0].includes( 'd' );

	for ( let i = 0; i < segments.length; i++ ) {
		const seg = segments[i];
		const op = operators[i];

		if ( seg.includes( 'd' ) ) {
			const m = seg.match( SEGMENT_REGEX );
			if ( !m ) return null;

			const qty = m[1] ? parseInt( m[1] ) : 1;
			const sides = m[2] === '%' ? 100 : parseInt( m[2] );

			const rolls = [];
			for ( let j = 0; j < qty; j++ ) {
				rolls.push( Math.floor( Math.random() * sides ) + 1 );
			}

			allRolled.push( rolls );
			let groupSum;

			if ( m[3] === 'b' || m[3] === 'w' ) {
				const count = parseInt( m[4] );
				const sorted = m[3] === 'b'
					? [...rolls].sort( ( a, b ) => b - a )
					: [...rolls].sort( ( a, b ) => a - b );
				const filtered = sorted.slice( 0, count );
				calcSteps.push( filtered );
				groupSum = filtered.reduce( ( s, v ) => s + v, 0 );
			}
			else {
				groupSum = rolls.reduce( ( s, v ) => s + v, 0 );

				if ( m[3] === '*' ) groupSum *= parseInt( m[4] );
				else if ( m[3] === '/' ) groupSum = Math.floor( groupSum / parseInt( m[4] ) );

				if ( isSimpleRoll && !m[3] ) {
					calcSteps.push( [...rolls] );
				}
			}

			runningTotal = applyOp( runningTotal, groupSum, op );
		}
		else {
			runningTotal = applyOp( runningTotal, parseInt( seg ), op );
		}

		calcSteps.push( runningTotal );
	}

	const calculations = calcSteps.reverse();
	const rolled = allRolled.length === 1 ? allRolled[0] : allRolled;

	return {
		result: calculations[0],
		calculations,
		rolled
	};
}

function applyOp( a, b, op ) {
	switch ( op ) {
		case '+': return a + b;
		case '-': return a - b;
		case '*': return a * b;
		case '/': return Math.floor( a / b );
		default: return a + b;
	}
}

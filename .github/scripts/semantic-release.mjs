// Runs semantic-release via its JS API and exposes whether a release was
// actually published as step outputs, so downstream jobs can be gated on it.
import semanticRelease from 'semantic-release';
import { appendFileSync } from 'node:fs';

const result = await semanticRelease();
const published = Boolean(result);

const outputs = [ `published=${published}` ];
if ( published ) {
  outputs.push( `version=${result.nextRelease.version}` );
  outputs.push( `tag=${result.nextRelease.gitTag}` );
}

if ( process.env.GITHUB_OUTPUT ) {
  appendFileSync( process.env.GITHUB_OUTPUT, outputs.join( '\n' ) + '\n' );
}

console.log( published
  ? `Published release ${result.nextRelease.gitTag}.`
  : 'No release published.' );

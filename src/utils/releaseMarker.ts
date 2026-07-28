import fs from 'fs';
import path from 'path';

// ?release pulls new commits into src, which tsx watch notices and restarts
// on, so the process handling the release may be killed before it can
// report success. This marker survives that restart so the next boot can
// confirm the release actually completed.
const MARKER_PATH = path.join(process.cwd(), '.release-marker.json');

const writeReleaseMarker = (marker: {
  channel: string;
  threadTs?: string;
  sha: string;
  title: string;
}) => {
  fs.writeFileSync(MARKER_PATH, JSON.stringify(marker));
};

const clearReleaseMarker = () => {
  if (fs.existsSync(MARKER_PATH)) {
    fs.unlinkSync(MARKER_PATH);
  }
};

const consumeReleaseMarker = () => {
  if (!fs.existsSync(MARKER_PATH)) {
    return null;
  }

  const marker = JSON.parse(fs.readFileSync(MARKER_PATH, 'utf8'));
  clearReleaseMarker();
  return marker;
};

export { writeReleaseMarker, clearReleaseMarker, consumeReleaseMarker };

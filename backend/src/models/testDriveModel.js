import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const testDriveFile = path.join(dataDir, 'testDrives.json');

let testDrives = [];

export async function initTestDrives() {
  try {
    await fs.ensureDir(dataDir);
    if (await fs.pathExists(testDriveFile)) {
      testDrives = await fs.readJson(testDriveFile);
      console.log(`Loaded ${testDrives.length} test drive records`);
    } else {
      await fs.writeJson(testDriveFile, [], { spaces: 2 });
      testDrives = [];
      console.log('Initialized empty testDrives.json');
    }
  } catch (err) {
    console.error('Failed to initialize test drives:', err);
    testDrives = [];
  }
}

async function saveTestDrives() {
  try {
    await fs.writeJson(testDriveFile, testDrives, { spaces: 2 });
    console.log('testDrives.json saved successfully');
  } catch (err) {
    console.error('Failed to save test drives:', err);
  }
}

function nextId() {
  const maxNum = testDrives.reduce((max, td) => {
    const n = parseInt(String(td.id || '').split('-')[1], 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  return `TD-${maxNum + 1}`;
}

export async function addTestDrive(record) {
  const withId = { id: nextId(), ...record };
  testDrives.push(withId);
  await saveTestDrives();
  return withId;
}

export async function getTestDrivesByUser(userId) {
  return testDrives.filter((t) => t.userId === userId);
}



import fs from 'fs';
import path from 'path';

// Base64 encoded simple blue square PNG (32x32)
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwMS8zMS8yNpl8G0cAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzQGstOgAAAAKklEQVRYhc3MQQEAAAgDoG3/0iK4aQckIAA99+sAAAAAAAD4WwAAAAAAgBd6XgB61WjW6wAAAABJRU5ErkJggg==';

const iconPath = path.join('src-tauri', 'icons', 'app-icon.png');
const buffer = Buffer.from(base64Png, 'base64');

fs.writeFileSync(iconPath, buffer);
console.log('Created valid PNG icon at ' + iconPath);
